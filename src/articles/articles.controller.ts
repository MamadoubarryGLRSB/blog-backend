import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { SearchArticleDto, UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateArticleDto } from './create-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Endpoint : Créer un nouvel article
   * Méthode : POST
   * URL : /articles
   * Description : Permet à un utilisateur connecté de créer un article.
   * Paramètres :
   * - userId : ID de l'utilisateur (extrait du token JWT).
   * - createArticleDto : Données de l'article à créer.
   * Retourne : Les informations de l'article créé.
   */

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new article' })
  create(
    @User('id') userId: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.create(userId, createArticleDto);
  }

  /**
   * Endpoint : Récupérer tous les articles
   * Méthode : GET
   * URL : /articles
   * Description : Récupère la liste de tous les articles, y compris les auteurs et les tags associés.
   */

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  findAll() {
    return this.articlesService.findAll();
  }

  /**
   * Endpoint : Rechercher des articles
   * Méthode : GET
   * URL : /articles/search
   * Description : Permet de rechercher des articles par mots-clés ou tags.
   * Paramètres :
   * - search : Mot-clé à rechercher.
   * - tags : Liste des IDs de tags pour filtrer les articles.
   * Retourne : Les articles correspondant aux critères de recherche.
   */

  @Get('search')
  @ApiOperation({ summary: 'Search articles' })
  search(@Query() searchArticleDto: SearchArticleDto) {
    return this.articlesService.search(searchArticleDto);
  }

  /**
   * Endpoint : Récupérer un article par ID
   * Méthode : GET
   * URL : /articles/:id
   * Description : Récupère un article spécifique avec ses détails (auteur, tags, commentaires, likes).
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an article by id' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  /**
   * Endpoint : Mettre à jour un article
   * Méthode : PATCH
   * URL : /articles/:id
   * Description : Permet à l'auteur d'un article de le mettre à jour.
   * Paramètres :
   * - id : ID de l'article.
   * - userId : ID de l'auteur connecté.
   * - updateArticleDto : Données à mettre à jour.
   * Retourne : L'article mis à jour.
   */

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an article' })
  update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, userId, updateArticleDto);
  }

  /**
   * Endpoint : Supprimer un article
   * Méthode : DELETE
   * URL : /articles/:id
   * Description : Permet à l'auteur d'un article de le supprimer.
   */

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an article' })
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.articlesService.remove(id, userId);
  }

  /**
   * Endpoint : Liker un article
   * Méthode : POST
   * URL : /articles/:id/like
   * Description : Permet à un utilisateur connecté de liker un article.
   */

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Like an article' })
  like(@Param('id') id: string, @User('id') userId: string) {
    return this.articlesService.like(id, userId);
  }

  /**
   * Endpoint : Retirer un like d'un article
   * Méthode : DELETE
   * URL : /articles/:id/like
   * Description : Permet à un utilisateur connecté d'annuler son like sur un article.
   */

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unlike an article' })
  unlike(@Param('id') id: string, @User('id') userId: string) {
    return this.articlesService.unlike(id, userId);
  }
}
