"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIssueDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_issue_dto_1 = require("./create-issue.dto");
class UpdateIssueDto extends (0, mapped_types_1.PartialType)(create_issue_dto_1.CreateIssueDto) {
}
exports.UpdateIssueDto = UpdateIssueDto;
//# sourceMappingURL=update-issue.dto.js.map