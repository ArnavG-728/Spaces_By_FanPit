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
exports.SpacesModule = void 0;
const common_1 = require("@nestjs/common");
const reservations_module_1 = require("../reservations/reservations.module");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mongoose_3 = require("mongoose");
const space_schema_1 = require("./schemas/space.schema");
const spaces_service_1 = require("./spaces.service");
const spaces_controller_1 = require("./spaces.controller");
let SpacesModule = class SpacesModule {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async onModuleInit() {
        try {
            const collection = this.connection.collection('spaces');
            await collection.dropIndex('pricing.promoCodes.code_1');
            console.log('Dropped problematic unique index on pricing.promoCodes.code');
        }
        catch (error) {
            console.log('Index pricing.promoCodes.code_1 does not exist or already dropped');
        }
    }
};
exports.SpacesModule = SpacesModule;
exports.SpacesModule = SpacesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: space_schema_1.Space.name, schema: space_schema_1.SpaceSchema }]), (0, common_1.forwardRef)(() => reservations_module_1.ReservationsModule)],
        controllers: [spaces_controller_1.SpacesController],
        providers: [spaces_service_1.SpacesService],
        exports: [spaces_service_1.SpacesService],
    }),
    __param(0, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_3.Connection])
], SpacesModule);
//# sourceMappingURL=spaces.module.js.map