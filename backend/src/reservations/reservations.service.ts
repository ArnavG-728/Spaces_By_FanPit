import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { FindReservationsQueryDto } from './dto/find-reservations-query.dto';
import { Reservation, ReservationDocument, ReservationStatus } from './schemas/reservation.schema';
import { SpacesService } from '../spaces/spaces.service';

@Injectable()
export class ReservationsService {
  private razorpay?: Razorpay; // Make Razorpay optional

  constructor(
    @InjectModel(Reservation.name) private readonly reservationModel: Model<ReservationDocument>,
    private readonly spacesService: SpacesService,
    private readonly configService: ConfigService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { spaceId, userId, startTime, endTime } = createReservationDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('End time must be after start time.');
    }

    // 1. Check if space exists
    const space = await this.spacesService.findOne(spaceId);

    // 2. Check for booking conflicts
    const existingReservation = await this.reservationModel.findOne({
      spaceId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    }).exec();

    if (existingReservation) {
      throw new ConflictException('The selected time slot is not available.');
    }

    // 3. Calculate price (simple hourly rate for now)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = durationHours * (space.pricing.hourlyRate || 500); // Default price if not set

    // 4. Create Razorpay Order
    if (!this.razorpay) {
      throw new BadRequestException('Payment gateway is not configured.');
    }
    const order = await this.razorpay.orders.create({
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    });

    // 5. Create and save reservation
    const newReservation = new this.reservationModel({
      ...createReservationDto,
      totalPrice,
      paymentDetails: { orderId: order.id },
    });

    return newReservation.save();
  }

    async findAll(query: FindReservationsQueryDto): Promise<Reservation[]> {
    const filters: any = {};
    if (query.spaceId) {
      filters.spaceId = query.spaceId;
    }
    if (query.userId) {
      filters.userId = query.userId;
    }
    if (query.status) {
      filters.status = query.status;
    }
    if (query.date) {
      const dayStart = new Date(query.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(query.date);
      dayEnd.setHours(23, 59, 59, 999);
      filters.startTime = { $lte: dayEnd };
      filters.endTime = { $gte: dayStart };
    }

        return this.reservationModel.find(filters).populate('spaceId').sort({ startTime: 1 }).exec();
  }

  async findAllForSpace(spaceId: string): Promise<Reservation[]> {
    return this.reservationModel.find({
      spaceId,
      status: ReservationStatus.CONFIRMED,
    }).exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).populate('spaceId').exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID "${id}" not found`);
    }
    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const existingReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .exec();

    if (!existingReservation) {
      throw new NotFoundException(`Reservation with ID "${id}" not found`);
    }
    return existingReservation;
  }

  async remove(id: string): Promise<any> {
    const result = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reservation with ID "${id}" not found`);
    }
    return { deleted: true };
  }

  async handleSuccessfulPayment(orderId: string, paymentId: string, signature: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findOne({ 'paymentDetails.orderId': orderId }).exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation for order ID "${orderId}" not found`);
    }

    reservation.status = ReservationStatus.CONFIRMED;
    reservation.paymentDetails.paymentId = paymentId;
    reservation.paymentDetails.signature = signature;

    return reservation.save();
  }
}
