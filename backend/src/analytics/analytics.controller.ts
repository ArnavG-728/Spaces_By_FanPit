import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get a summary of dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Dashboard summary data.' })
  getDashboardSummary() {
    return this.analyticsService.getDashboardSummary();
  }
}
