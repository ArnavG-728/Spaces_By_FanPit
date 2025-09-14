import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from './schemas/space.schema';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(Space.name) private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async findAll() {
    return this.spaceModel.find().lean();
  }

  async findOne(id: string) {
    const doc = await this.spaceModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Space not found');
    return doc;
  }

  async create(payload: Omit<Space, '_id'>) {
    const created = await this.spaceModel.create(payload as any);
    return created.toObject();
  }

  async update(id: string, payload: Partial<Space>) {
    const updated = await this.spaceModel
      .findByIdAndUpdate(id, payload, { new: true })
      .lean();
    if (!updated) throw new NotFoundException('Space not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.spaceModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Space not found');
    return { deleted: true } as const;
  }
}
