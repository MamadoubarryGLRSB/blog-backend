import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Endpoint : Récupérer tous les tags
   * Méthode : GET
   * URL : /tags
   * Description : Récupère la liste de tous les tags disponibles.
   */
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  findAll() {
    return this.tagsService.findAll();
  }
}
