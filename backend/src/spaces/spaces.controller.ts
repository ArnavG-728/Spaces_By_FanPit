import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Space } from './schemas/space.schema';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Post()
  create(@Body() body: Omit<Space, '_id'>) {
    return this.spacesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Space>) {
    return this.spacesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}
