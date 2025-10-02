import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { CreateStreamingContentDto } from './dto/create-streaming-content.dto';
import { UpdateStreamingContentDto } from './dto/update-streaming-content.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createStreamingContentDto: CreateStreamingContentDto,
  ) {
    return this.streamingService.create(createStreamingContentDto);
  }

  @Get()
  findAll() {
    return this.streamingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streamingService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateStreamingContentDto: UpdateStreamingContentDto,
  ) {
    return this.streamingService.update(id, updateStreamingContentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.streamingService.remove(id);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProgressDto: UpdateProgressDto,
  ) {
    return this.streamingService.updateProgress(
      id,
      updateProgressDto.watchProgress,
    );
  }
}