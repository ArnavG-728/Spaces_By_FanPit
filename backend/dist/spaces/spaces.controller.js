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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesController = void 0;
const common_1 = require("@nestjs/common");
const spaces_service_1 = require("./spaces.service");
const reservations_service_1 = require("../reservations/reservations.service");
const create_space_dto_1 = require("./dto/create-space.dto");
const update_space_dto_1 = require("./dto/update-space.dto");
const ical_generator_1 = __importDefault(require("ical-generator"));
const swagger_1 = require("@nestjs/swagger");
const space_schema_1 = require("./schemas/space.schema");
let SpacesController = class SpacesController {
    spacesService;
    reservationsService;
    constructor(spacesService, reservationsService) {
        this.spacesService = spacesService;
        this.reservationsService = reservationsService;
    }
    create(createSpaceDto) {
        return this.spacesService.create(createSpaceDto);
    }
    findAll() {
        return this.spacesService.findAll();
    }
    findOne(id) {
        return this.spacesService.findOne(id);
    }
    update(id, updateSpaceDto) {
        return this.spacesService.update(id, updateSpaceDto);
    }
    async remove(id) {
        await this.spacesService.remove(id);
    }
    async exportICal(id, res) {
        const space = await this.spacesService.findOne(id);
        const reservations = await this.reservationsService.findAllForSpace(id);
        const calendar = (0, ical_generator_1.default)({ name: `${space.name} - Reservations` });
        for (const reservation of reservations) {
            calendar.createEvent({
                start: reservation.startTime,
                end: reservation.endTime,
                summary: `Reservation for ${space.name}`,
                description: `Booked by user ${reservation.userId}`,
                location: space.address,
            });
        }
        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', `attachment; filename="${space.name.replace(/\s+/g, '_')}_reservations.ics"`);
        res.send(calendar.toString());
    }
};
exports.SpacesController = SpacesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new space' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The space has been successfully created.', type: space_schema_1.Space }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_1.CreateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all spaces' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A list of all spaces.', type: [space_schema_1.Space] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single space by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the space to retrieve' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The requested space.', type: space_schema_1.Space }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Space not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing space' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the space to update' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The space has been successfully updated.', type: space_schema_1.Space }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Space not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_space_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a space' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the space to delete' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'The space has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Space not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/ical'),
    (0, swagger_1.ApiOperation)({ summary: 'Export space reservations as an iCal file' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the space' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'An iCal file with all confirmed reservations.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Space not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "exportICal", null);
exports.SpacesController = SpacesController = __decorate([
    (0, swagger_1.ApiTags)('spaces'),
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [spaces_service_1.SpacesService,
        reservations_service_1.ReservationsService])
], SpacesController);
//# sourceMappingURL=spaces.controller.js.map