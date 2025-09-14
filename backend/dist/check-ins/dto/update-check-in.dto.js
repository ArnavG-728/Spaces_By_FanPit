"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCheckInDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_check_in_dto_1 = require("./create-check-in.dto");
class UpdateCheckInDto extends (0, mapped_types_1.PartialType)(create_check_in_dto_1.CreateCheckInDto) {
}
exports.UpdateCheckInDto = UpdateCheckInDto;
//# sourceMappingURL=update-check-in.dto.js.map