import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('issues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @Roles('consumer', 'owner')
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  @Roles('staff')
  findAll() {
    return this.issuesService.findAll();
  }

  @Get(':id')
  @Roles('staff', 'consumer', 'owner')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  @Roles('staff')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @Roles('staff')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }
}
