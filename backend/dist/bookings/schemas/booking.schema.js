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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = exports.Booking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
const space_schema_1 = require("../../spaces/schemas/space.schema");
let Booking = class Booking {
    space;
    user;
    startTime;
    endTime;
    status;
    notes;
    amount;
    paymentStatus;
    paymentOrderId;
    paymentId;
    paidAt;
    totalPrice;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Space', required: true }),
    __metadata("design:type", space_schema_1.Space)
], Booking.prototype, "space", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Booking.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'completed', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "paymentOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map