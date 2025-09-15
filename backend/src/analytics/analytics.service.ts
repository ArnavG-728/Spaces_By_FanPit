import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument, ReservationStatus } from '../reservations/schemas/reservation.schema';
import { Space, SpaceDocument } from '../spaces/schemas/space.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Reservation.name) private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel(Space.name) private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async getDashboardSummary() {
    const [totalRevenue, totalBookings, totalSpaces, topSpaces, recentBookings] = await Promise.all([
      this.getTotalRevenue(),
      this.getTotalBookings(),
      this.spaceModel.countDocuments().exec(),
      this.getTopPerformingSpaces(),
      this.getRecentBookings(),
    ]);

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalBookings,
      totalSpaces,
      topSpaces,
      recentBookings,
    };
  }

  private async getTotalRevenue() {
    return this.reservationModel.aggregate([
      {
        $match: { status: ReservationStatus.CONFIRMED },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);
  }

  private async getTotalBookings() {
    return this.reservationModel.countDocuments({ status: ReservationStatus.CONFIRMED }).exec();
  }

  private async getTopPerformingSpaces() {
    return this.reservationModel.aggregate([
      {
        $match: { status: ReservationStatus.CONFIRMED },
      },
      {
        $group: {
          _id: '$spaceId',
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'spaces',
          localField: '_id',
          foreignField: '_id',
          as: 'spaceDetails',
        },
      },
      {
        $unwind: '$spaceDetails',
      },
      {
        $project: {
          _id: 0,
          spaceId: '$_id',
          name: '$spaceDetails.name',
          totalRevenue: 1,
          totalBookings: 1,
        },
      },
    ]);
  }

  private async getRecentBookings() {
    return this.reservationModel
      .find({ status: ReservationStatus.CONFIRMED })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('spaceId', 'name')
      .exec();
  }
}
