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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HealthService = class HealthService {
    http;
    connection;
    constructor(http, connection) {
        this.http = http;
        this.connection = connection;
    }
    async check() {
        const dbReady = this.connection.readyState === 1;
        let probeOk = null;
        const probeUrl = process.env.PROBE_URL;
        if (probeUrl) {
            try {
                const res = await (0, rxjs_1.firstValueFrom)(this.http.get(probeUrl));
                probeOk = res.status >= 200 && res.status < 400;
            }
            catch (e) {
                probeOk = false;
            }
        }
        const green = dbReady && (probeOk !== false);
        return {
            status: green ? 'green' : 'yellow',
            db: dbReady ? 'up' : 'down',
            probe: probeOk,
            time: new Date().toISOString(),
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Connection])
], HealthService);
//# sourceMappingURL=health.service.js.map