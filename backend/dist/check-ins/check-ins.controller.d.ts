import { CheckInsService } from './check-ins.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
export declare class CheckInsController {
    private readonly checkInsService;
    constructor(checkInsService: CheckInsService);
    create(createCheckInDto: CreateCheckInDto): Promise<import("./schemas/check-in.schema").CheckIn>;
    findAll(): Promise<import("./schemas/check-in.schema").CheckIn[]>;
    findOne(id: string): Promise<import("./schemas/check-in.schema").CheckIn>;
    update(id: string, updateCheckInDto: UpdateCheckInDto): Promise<import("./schemas/check-in.schema").CheckIn>;
    remove(id: string): Promise<import("./schemas/check-in.schema").CheckIn>;
}
