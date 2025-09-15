import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space, SpaceDocument } from './schemas/space.schema';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(Space.name) private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
    const newSpace = new this.spaceModel(createSpaceDto);
    return newSpace.save();
  }

  async findAll(): Promise<Space[]> {
    return this.spaceModel.find().exec();
  }

  async findOne(id: string): Promise<Space> {
    const space = await this.spaceModel.findById(id).exec();
    if (!space) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
    const existingSpace = await this.spaceModel
      .findByIdAndUpdate(id, updateSpaceDto, { new: true })
      .exec();

    if (!existingSpace) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return existingSpace;
  }

  async remove(id: string): Promise<any> {
    const result = await this.spaceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Space with ID "${id}" not found`);
    }
    return { deleted: true };
  }
}
