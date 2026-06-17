import type { EpisodeApiDto } from '@/application/dto/episode.dto';
import type { Episode } from '@/core/domain/entities/episode.entity';

/**
 * Map a raw API episode DTO to the domain entity, renaming the snake_case /
 * API-specific fields (`air_date`, `episode`) to domain-friendly names.
 */
export function mapEpisode(dto: EpisodeApiDto): Episode {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.episode,
    airDate: dto.air_date,
  };
}
