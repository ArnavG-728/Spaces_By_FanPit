import { PricingDto } from './pricing.dto';
export declare class CreateSpaceDto {
    name: string;
    description: string;
    address: string;
    capacity: number;
    amenities?: string[];
    images?: string[];
    pricing?: PricingDto;
}
