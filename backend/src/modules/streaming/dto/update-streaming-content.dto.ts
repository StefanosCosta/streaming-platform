import { CreateStreamingContentDto } from './create-streaming-content.dto';

// PUT requires all fields for full replacement (not partial like PATCH)
export class UpdateStreamingContentDto extends CreateStreamingContentDto {}