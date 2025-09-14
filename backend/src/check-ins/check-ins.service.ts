import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { CheckIn, CheckInDocument } from './schemas/check-in.schema';

@Injectable()
export class CheckInsService {
  constructor(@InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>) {}

  async create(createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    const createdCheckIn = new this.checkInModel(createCheckInDto);
    return createdCheckIn.save();
  }

  async findAll(): Promise<CheckIn[]> {
    return this.checkInModel.find().populate('booking').populate('staff').exec();
  }

  async findOne(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findById(id).populate('booking').populate('staff').exec();
    if (!checkIn) {
      throw new NotFoundException(`CheckIn with ID "${id}" not found`);
    }
    return checkIn;
  }

  async update(id: string, updateCheckInDto: UpdateCheckInDto): Promise<CheckIn> {
    const existingCheckIn = await this.checkInModel.findByIdAndUpdate(id, updateCheckInDto, { new: true }).exec();
    if (!existingCheckIn) {
      throw new NotFoundException(`CheckIn with ID "${id}" not found`);
    }
    return existingCheckIn;
  }

  async remove(id: string): Promise<CheckIn> {
    const deletedCheckIn = await this.checkInModel.findByIdAndDelete(id).exec();
    if (!deletedCheckIn) {
      throw new NotFoundException(`CheckIn with ID "${id}" not found`);
    }
    return deletedCheckIn;
  }
}
