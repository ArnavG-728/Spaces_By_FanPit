import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('spaces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @Roles('owner', 'staff')
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @Roles('owner', 'staff')
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @Roles('owner', 'staff')
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}
