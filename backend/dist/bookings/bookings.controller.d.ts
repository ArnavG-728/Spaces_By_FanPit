import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<import("./schemas/booking.schema").Booking>;
    findAll(): Promise<import("./schemas/booking.schema").Booking[]>;
    findOne(id: string): Promise<import("./schemas/booking.schema").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("./schemas/booking.schema").Booking>;
    remove(id: string): Promise<import("./schemas/booking.schema").Booking>;
}
