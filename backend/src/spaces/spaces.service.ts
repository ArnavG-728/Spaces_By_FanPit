import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space, SpaceDocument } from './schemas/space.schema';

@Injectable()
export class SpacesService {
  constructor(@InjectModel(Space.name) private spaceModel: Model<SpaceDocument>) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
    const createdSpace = new this.spaceModel(createSpaceDto);
    return createdSpace.save();
  }

  async findAll(): Promise<Space[]> {
    return this.spaceModel.find().populate('owner').exec();
  }

  async findOne(id: string): Promise<Space> {
    const space = await this.spaceModel.findById(id).populate('owner').exec();
    if (!space) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
    const existingSpace = await this.spaceModel.findByIdAndUpdate(id, updateSpaceDto, { new: true }).exec();
    if (!existingSpace) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return existingSpace;
  }

  async remove(id: string): Promise<Space> {
    const deletedSpace = await this.spaceModel.findByIdAndDelete(id).exec();
    if (!deletedSpace) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return deletedSpace;
  }
}
