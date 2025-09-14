"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const Razorpay = require('razorpay');
let PaymentsService = class PaymentsService {
    bookingModel;
    razorpay;
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
        });
    }
    async createOrder(bookingId, amount) {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `booking_${bookingId}`,
            notes: {
                booking_id: bookingId,
            },
        };
        const order = await this.razorpay.orders.create(options);
        await this.bookingModel.findByIdAndUpdate(bookingId, {
            paymentOrderId: order.id,
            paymentStatus: 'pending',
            amount: amount,
        });
        return order;
    }
    async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const crypto = require('crypto');
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
            .update(body.toString())
            .digest('hex');
        if (expectedSignature === razorpaySignature) {
            await this.bookingModel.findOneAndUpdate({ paymentOrderId: razorpayOrderId }, {
                paymentStatus: 'completed',
                paymentId: razorpayPaymentId,
                paidAt: new Date(),
            });
            return { status: 'success' };
        }
        else {
            return { status: 'failure' };
        }
    }
    async handleWebhook(payload) {
        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;
        switch (event) {
            case 'payment.captured':
                await this.bookingModel.findOneAndUpdate({ paymentOrderId: paymentEntity.order_id }, {
                    paymentStatus: 'completed',
                    paymentId: paymentEntity.id,
                    paidAt: new Date(),
                });
                break;
            case 'payment.failed':
                await this.bookingModel.findOneAndUpdate({ paymentOrderId: paymentEntity.order_id }, { paymentStatus: 'failed' });
                break;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map