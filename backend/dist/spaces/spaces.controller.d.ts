import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(createSpaceDto: CreateSpaceDto): Promise<import("./schemas/space.schema").Space>;
    findAll(): Promise<import("./schemas/space.schema").Space[]>;
    findOne(id: string): Promise<import("./schemas/space.schema").Space>;
    update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<import("./schemas/space.schema").Space>;
    remove(id: string): Promise<import("./schemas/space.schema").Space>;
}
