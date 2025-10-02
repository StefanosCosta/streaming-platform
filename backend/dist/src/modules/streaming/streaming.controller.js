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
exports.StreamingController = void 0;
const common_1 = require("@nestjs/common");
const streaming_service_1 = require("./streaming.service");
const create_streaming_content_dto_1 = require("./dto/create-streaming-content.dto");
const update_streaming_content_dto_1 = require("./dto/update-streaming-content.dto");
const update_progress_dto_1 = require("./dto/update-progress.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StreamingController = class StreamingController {
    streamingService;
    constructor(streamingService) {
        this.streamingService = streamingService;
    }
    create(createStreamingContentDto) {
        return this.streamingService.create(createStreamingContentDto);
    }
    findAll() {
        return this.streamingService.findAll();
    }
    findOne(id) {
        return this.streamingService.findOne(id);
    }
    update(id, updateStreamingContentDto) {
        return this.streamingService.update(id, updateStreamingContentDto);
    }
    remove(id) {
        return this.streamingService.remove(id);
    }
    updateProgress(id, updateProgressDto) {
        return this.streamingService.updateProgress(id, updateProgressDto.watchProgress);
    }
};
exports.StreamingController = StreamingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_streaming_content_dto_1.CreateStreamingContentDto]),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_streaming_content_dto_1.UpdateStreamingContentDto]),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_progress_dto_1.UpdateProgressDto]),
    __metadata("design:returntype", void 0)
], StreamingController.prototype, "updateProgress", null);
exports.StreamingController = StreamingController = __decorate([
    (0, common_1.Controller)('api/streaming'),
    __metadata("design:paramtypes", [streaming_service_1.StreamingService])
], StreamingController);
//# sourceMappingURL=streaming.controller.js.map