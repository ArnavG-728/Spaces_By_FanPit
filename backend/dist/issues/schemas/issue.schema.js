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
exports.IssueSchema = exports.Issue = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const space_schema_1 = require("../../spaces/schemas/space.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
let Issue = class Issue {
    title;
    description;
    status;
    space;
    reportedBy;
    assignedTo;
};
exports.Issue = Issue;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' }),
    __metadata("design:type", String)
], Issue.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Space', required: true }),
    __metadata("design:type", space_schema_1.Space)
], Issue.prototype, "space", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Issue.prototype, "reportedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_schema_1.User)
], Issue.prototype, "assignedTo", void 0);
exports.Issue = Issue = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Issue);
exports.IssueSchema = mongoose_1.SchemaFactory.createForClass(Issue);
//# sourceMappingURL=issue.schema.js.map