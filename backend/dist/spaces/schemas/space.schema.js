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
exports.SpaceSchema = exports.Space = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const pricing_schema_1 = require("./pricing.schema");
let Space = class Space {
    name;
    description;
    address;
    capacity;
    amenities;
    images;
    pricing;
};
exports.Space = Space;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Space.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Space.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Space.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Space.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Space.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Space.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: pricing_schema_1.PricingSchema, default: () => ({}) }),
    __metadata("design:type", pricing_schema_1.Pricing)
], Space.prototype, "pricing", void 0);
exports.Space = Space = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Space);
exports.SpaceSchema = mongoose_1.SchemaFactory.createForClass(Space);
//# sourceMappingURL=space.schema.js.map