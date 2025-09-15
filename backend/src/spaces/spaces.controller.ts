import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SpacesService } from './spaces.service';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import ical from 'ical-generator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Space } from './schemas/space.schema';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly spacesService: SpacesService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new space' })
  @ApiResponse({ status: 201, description: 'The space has been successfully created.', type: Space })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all spaces' })
  @ApiResponse({ status: 200, description: 'A list of all spaces.', type: [Space] })
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single space by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the space to retrieve' })
  @ApiResponse({ status: 200, description: 'The requested space.', type: Space })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing space' })
  @ApiParam({ name: 'id', description: 'The ID of the space to update' })
  @ApiResponse({ status: 200, description: 'The space has been successfully updated.', type: Space })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a space' })
  @ApiParam({ name: 'id', description: 'The ID of the space to delete' })
  @ApiResponse({ status: 204, description: 'The space has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  async remove(@Param('id') id: string) {
        await this.spacesService.remove(id);
  }

  @Get(':id/ical')
  @ApiOperation({ summary: 'Export space reservations as an iCal file' })
  @ApiParam({ name: 'id', description: 'The ID of the space' })
  @ApiResponse({ status: 200, description: 'An iCal file with all confirmed reservations.' })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  async exportICal(@Param('id') id: string, @Res() res: Response) {
    const space = await this.spacesService.findOne(id);
    const reservations = await this.reservationsService.findAllForSpace(id);

    const calendar = ical({ name: `${space.name} - Reservations` });

    for (const reservation of reservations) {
      calendar.createEvent({
        start: reservation.startTime,
        end: reservation.endTime,
        summary: `Reservation for ${space.name}`,
        description: `Booked by user ${reservation.userId}`,
        location: space.address,
      });
    }

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${space.name.replace(/\s+/g, '_')}_reservations.ics"`);
    res.send(calendar.toString());
  }
}
