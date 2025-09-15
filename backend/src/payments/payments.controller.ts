import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint, ApiHeader } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Razorpay webhook events' })
  @ApiHeader({
    name: 'x-razorpay-signature',
    description: 'The signature provided by Razorpay to verify the webhook authenticity.',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook received and processed.' })
  @ApiResponse({ status: 400, description: 'Invalid signature.' })
  handleWebhook(
    @Body() event: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(event, signature);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Retrieve all transaction logs (Admin)' })
  @ApiResponse({ status: 200, description: 'A list of all transaction logs.' })
  findAllLogs() {
    return this.paymentsService.findAllLogs();
  }

  // Exclude the default CRUD endpoints that are not used
  @ApiExcludeEndpoint()
  create() {}

  @ApiExcludeEndpoint()
  findAll() {}

  @ApiExcludeEndpoint()
  findOne() {}

  @ApiExcludeEndpoint()
  update() {}

  @ApiExcludeEndpoint()
  remove() {}
}
