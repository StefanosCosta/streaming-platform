import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamingContentDto } from './create-streaming-content.dto';

export class UpdateStreamingContentDto extends PartialType(
  CreateStreamingContentDto,
) {}