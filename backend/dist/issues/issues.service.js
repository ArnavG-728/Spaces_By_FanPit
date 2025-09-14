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
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const issue_schema_1 = require("./schemas/issue.schema");
let IssuesService = class IssuesService {
    issueModel;
    constructor(issueModel) {
        this.issueModel = issueModel;
    }
    async create(createIssueDto) {
        const createdIssue = new this.issueModel(createIssueDto);
        return createdIssue.save();
    }
    async findAll() {
        return this.issueModel.find().populate('space').populate('reportedBy').populate('assignedTo').exec();
    }
    async findOne(id) {
        const issue = await this.issueModel.findById(id).populate('space').populate('reportedBy').populate('assignedTo').exec();
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with ID "${id}" not found`);
        }
        return issue;
    }
    async update(id, updateIssueDto) {
        const existingIssue = await this.issueModel.findByIdAndUpdate(id, updateIssueDto, { new: true }).exec();
        if (!existingIssue) {
            throw new common_1.NotFoundException(`Issue with ID "${id}" not found`);
        }
        return existingIssue;
    }
    async remove(id) {
        const deletedIssue = await this.issueModel.findByIdAndDelete(id).exec();
        if (!deletedIssue) {
            throw new common_1.NotFoundException(`Issue with ID "${id}" not found`);
        }
        return deletedIssue;
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(issue_schema_1.Issue.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IssuesService);
//# sourceMappingURL=issues.service.js.map