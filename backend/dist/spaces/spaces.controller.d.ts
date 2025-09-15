import type { Response } from 'express';
import { SpacesService } from './spaces.service';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space } from './schemas/space.schema';
export declare class SpacesController {
    private readonly spacesService;
    private readonly reservationsService;
    constructor(spacesService: SpacesService, reservationsService: ReservationsService);
    create(createSpaceDto: CreateSpaceDto): Promise<Space>;
    findAll(): Promise<Space[]>;
    findOne(id: string): Promise<Space>;
    update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space>;
    remove(id: string): Promise<void>;
    exportICal(id: string, res: Response): Promise<void>;
}
