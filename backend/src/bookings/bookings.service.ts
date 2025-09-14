import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('space').populate('user').exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).populate('space').populate('user').exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const existingBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
    if (!existingBooking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return existingBooking;
  }

  async remove(id: string): Promise<Booking> {
    const deletedBooking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!deletedBooking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return deletedBooking;
  }
}
