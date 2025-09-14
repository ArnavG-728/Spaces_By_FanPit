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
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let Space = class Space {
    name;
    description;
    location;
    price;
    owner;
    amenities;
    capacity;
    images;
};
exports.Space = Space;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Space.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Space.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Space.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Space.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Space.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Space.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Space.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Space.prototype, "images", void 0);
exports.Space = Space = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Space);
exports.SpaceSchema = mongoose_1.SchemaFactory.createForClass(Space);
//# sourceMappingURL=space.schema.js.map