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
exports.CheckInsController = void 0;
const common_1 = require("@nestjs/common");
const check_ins_service_1 = require("./check-ins.service");
const create_check_in_dto_1 = require("./dto/create-check-in.dto");
const update_check_in_dto_1 = require("./dto/update-check-in.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let CheckInsController = class CheckInsController {
    checkInsService;
    constructor(checkInsService) {
        this.checkInsService = checkInsService;
    }
    create(createCheckInDto) {
        return this.checkInsService.create(createCheckInDto);
    }
    findAll() {
        return this.checkInsService.findAll();
    }
    findOne(id) {
        return this.checkInsService.findOne(id);
    }
    update(id, updateCheckInDto) {
        return this.checkInsService.update(id, updateCheckInDto);
    }
    remove(id) {
        return this.checkInsService.remove(id);
    }
};
exports.CheckInsController = CheckInsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('staff'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_check_in_dto_1.CreateCheckInDto]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('staff'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('staff'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('staff'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_check_in_dto_1.UpdateCheckInDto]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('staff'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "remove", null);
exports.CheckInsController = CheckInsController = __decorate([
    (0, common_1.Controller)('check-ins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [check_ins_service_1.CheckInsService])
], CheckInsController);
//# sourceMappingURL=check-ins.controller.js.map