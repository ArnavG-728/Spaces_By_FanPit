"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const reservations_service_1 = require("../reservations/reservations.service");
const notifications_service_1 = require("../notifications/notifications.service");
const transaction_log_schema_1 = require("./schemas/transaction-log.schema");
let PaymentsService = class PaymentsService {
    transactionLogModel;
    reservationsService;
    configService;
    notificationsService;
    webhookSecret;
    constructor(transactionLogModel, reservationsService, configService, notificationsService) {
        this.transactionLogModel = transactionLogModel;
        this.reservationsService = reservationsService;
        this.configService = configService;
        this.notificationsService = notificationsService;
        const secret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!secret) {
            throw new Error('RAZORPAY_KEY_SECRET is not defined in environment variables.');
        }
        this.webhookSecret = secret;
    }
    async handleWebhook(event, signature) {
        const isValid = this.verifySignature(JSON.stringify(event), signature);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid Razorpay webhook signature');
        }
        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const reservation = await this.reservationsService.handleSuccessfulPayment(orderId, payment.id, signature);
            await this.createTransactionLog(reservation, payment, transaction_log_schema_1.TransactionStatus.SUCCESS, event);
            await this.notificationsService.sendReservationConfirmation(reservation.userId, reservation);
        }
        return { received: true };
    }
    verifySignature(body, signature) {
        const hmac = crypto.createHmac('sha256', this.webhookSecret);
        hmac.update(body);
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }
    async createTransactionLog(reservation, payment, status, rawEvent) {
        const log = new this.transactionLogModel({
            reservationId: reservation._id,
            spaceId: reservation.spaceId,
            razorpayOrderId: payment.order_id,
            razorpayPaymentId: payment.id,
            status,
            rawEvent,
        });
        return log.save();
    }
    async findAllLogs() {
        return this.transactionLogModel.find().sort({ createdAt: -1 }).exec();
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_log_schema_1.TransactionLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        reservations_service_1.ReservationsService,
        config_1.ConfigService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map