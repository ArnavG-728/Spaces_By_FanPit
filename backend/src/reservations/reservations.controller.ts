import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { FindReservationsQueryDto } from './dto/find-reservations-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Reservation } from './schemas/reservation.schema';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'The reservation has been successfully created.', type: Reservation })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Conflict: Time slot not available.' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reservations (with optional filters for dashboard)' })
  @ApiResponse({ status: 200, description: 'A list of matching reservations.', type: [Reservation] })
  findAll(@Query() query: FindReservationsQueryDto) {
    return this.reservationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single reservation by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the reservation to retrieve' })
  @ApiResponse({ status: 200, description: 'The requested reservation.', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation status (for staff)' })
  @ApiParam({ name: 'id', description: 'The ID of the reservation to update' })
  @ApiResponse({ status: 200, description: 'The reservation has been successfully updated.', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiParam({ name: 'id', description: 'The ID of the reservation to delete' })
  @ApiResponse({ status: 204, description: 'The reservation has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async remove(@Param('id') id: string) {
    await this.reservationsService.remove(id);
  }
}
