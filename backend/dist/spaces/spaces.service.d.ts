import { Model } from 'mongoose';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space, SpaceDocument } from './schemas/space.schema';
export declare class SpacesService {
    private readonly spaceModel;
    constructor(spaceModel: Model<SpaceDocument>);
    create(createSpaceDto: CreateSpaceDto): Promise<Space>;
    findAll(): Promise<Space[]>;
    findOne(id: string): Promise<Space>;
    update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space>;
    remove(id: string): Promise<any>;
}
