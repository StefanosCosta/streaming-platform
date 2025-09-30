import {
  IsString,
  IsInt,
  IsNumber,
  IsArray,
  IsUrl,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateStreamingContentDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsUrl()
  thumbnailUrl: string;

  @IsUrl()
  videoUrl: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsString()
  @MinLength(1)
  genre: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Min(1)
  duration: number;

  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @IsNumber()
  @Min(0)
  @Max(100)
  watchProgress?: number;
}