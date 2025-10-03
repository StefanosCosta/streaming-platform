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
exports.StreamingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let StreamingService = class StreamingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStreamingContentDto) {
        try {
            return await this.prisma.streamingContent.create({
                data: {
                    title: createStreamingContentDto.title,
                    description: createStreamingContentDto.description,
                    thumbnailUrl: createStreamingContentDto.thumbnailUrl,
                    videoUrl: createStreamingContentDto.videoUrl,
                    year: createStreamingContentDto.year,
                    genre: createStreamingContentDto.genre,
                    rating: createStreamingContentDto.rating,
                    duration: createStreamingContentDto.duration,
                    cast: createStreamingContentDto.cast,
                    watchProgress: createStreamingContentDto.watchProgress || 0,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create content');
        }
    }
    async findAll() {
        return await this.prisma.streamingContent.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const content = await this.prisma.streamingContent.findUnique({
            where: { id },
        });
        if (!content) {
            throw new common_1.NotFoundException(`Content with ID ${id} not found`);
        }
        return content;
    }
    async update(id, updateStreamingContentDto) {
        try {
            await this.findOne(id);
            const dataToUpdate = {
                ...updateStreamingContentDto,
                watchProgress: updateStreamingContentDto.watchProgress ?? 0,
            };
            return await this.prisma.streamingContent.update({
                where: { id },
                data: dataToUpdate,
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update content');
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            await this.prisma.streamingContent.delete({
                where: { id },
            });
            return { message: `Content with ID ${id} has been deleted` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete content');
        }
    }
    async updateProgress(id, watchProgress) {
        try {
            await this.findOne(id);
            return await this.prisma.streamingContent.update({
                where: { id },
                data: { watchProgress },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update watch progress');
        }
    }
};
exports.StreamingService = StreamingService;
exports.StreamingService = StreamingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreamingService);
//# sourceMappingURL=streaming.service.js.map