import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('check-ins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Post()
  @Roles('staff')
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInsService.create(createCheckInDto);
  }

  @Get()
  @Roles('staff')
  findAll() {
    return this.checkInsService.findAll();
  }

  @Get(':id')
  @Roles('staff')
  findOne(@Param('id') id: string) {
    return this.checkInsService.findOne(id);
  }

  @Patch(':id')
  @Roles('staff')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInsService.update(id, updateCheckInDto);
  }

  @Delete(':id')
  @Roles('staff')
  remove(@Param('id') id: string) {
    return this.checkInsService.remove(id);
  }
}
