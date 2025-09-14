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
exports.CheckInsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const check_in_schema_1 = require("./schemas/check-in.schema");
let CheckInsService = class CheckInsService {
    checkInModel;
    constructor(checkInModel) {
        this.checkInModel = checkInModel;
    }
    async create(createCheckInDto) {
        const createdCheckIn = new this.checkInModel(createCheckInDto);
        return createdCheckIn.save();
    }
    async findAll() {
        return this.checkInModel.find().populate('booking').populate('staff').exec();
    }
    async findOne(id) {
        const checkIn = await this.checkInModel.findById(id).populate('booking').populate('staff').exec();
        if (!checkIn) {
            throw new common_1.NotFoundException(`CheckIn with ID "${id}" not found`);
        }
        return checkIn;
    }
    async update(id, updateCheckInDto) {
        const existingCheckIn = await this.checkInModel.findByIdAndUpdate(id, updateCheckInDto, { new: true }).exec();
        if (!existingCheckIn) {
            throw new common_1.NotFoundException(`CheckIn with ID "${id}" not found`);
        }
        return existingCheckIn;
    }
    async remove(id) {
        const deletedCheckIn = await this.checkInModel.findByIdAndDelete(id).exec();
        if (!deletedCheckIn) {
            throw new common_1.NotFoundException(`CheckIn with ID "${id}" not found`);
        }
        return deletedCheckIn;
    }
};
exports.CheckInsService = CheckInsService;
exports.CheckInsService = CheckInsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(check_in_schema_1.CheckIn.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CheckInsService);
//# sourceMappingURL=check-ins.service.js.map