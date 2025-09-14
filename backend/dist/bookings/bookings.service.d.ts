import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';
export declare class BookingsService {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    remove(id: string): Promise<Booking>;
}
