import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStreamingContentDto } from './dto/create-streaming-content.dto';
import { UpdateStreamingContentDto } from './dto/update-streaming-content.dto';

@Injectable()
export class StreamingService {
  constructor(private prisma: PrismaService) {}

  async create(createStreamingContentDto: CreateStreamingContentDto) {
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
    } catch (error) {
      throw new BadRequestException('Failed to create content');
    }
  }

  async findAll() {
    return await this.prisma.streamingContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.streamingContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(id: string, updateStreamingContentDto: UpdateStreamingContentDto) {
    try {
      await this.findOne(id); // Check if exists

      // If watchProgress is not provided, set it to 0 (not started)
      const dataToUpdate = {
        ...updateStreamingContentDto,
        watchProgress: updateStreamingContentDto.watchProgress ?? 0,
      };

      return await this.prisma.streamingContent.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update content');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id); // Check if exists

      await this.prisma.streamingContent.delete({
        where: { id },
      });

      return { message: `Content with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete content');
    }
  }

  async updateProgress(id: string, watchProgress: number) {
    try {
      await this.findOne(id); // Check if exists

      return await this.prisma.streamingContent.update({
        where: { id },
        data: { watchProgress },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update watch progress');
    }
  }
}