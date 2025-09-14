import { Model } from 'mongoose';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { CheckIn, CheckInDocument } from './schemas/check-in.schema';
export declare class CheckInsService {
    private checkInModel;
    constructor(checkInModel: Model<CheckInDocument>);
    create(createCheckInDto: CreateCheckInDto): Promise<CheckIn>;
    findAll(): Promise<CheckIn[]>;
    findOne(id: string): Promise<CheckIn>;
    update(id: string, updateCheckInDto: UpdateCheckInDto): Promise<CheckIn>;
    remove(id: string): Promise<CheckIn>;
}
