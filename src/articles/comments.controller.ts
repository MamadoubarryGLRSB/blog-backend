import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@ApiTags('comments') // Tag Swagger pour documenter les endpoints relatifs aux commentaires
@Controller('articles/:articleId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Endpoint : Ajouter un commentaire
   * Méthode : POST
   * Description : Permet à un utilisateur connecté d'ajouter un commentaire à un article spécifique.
   * Paramètres :
   * - articleId : ID de l'article auquel ajouter le commentaire.
   * - userId : ID de l'utilisateur (extrait du token JWT).
   * - createCommentDto : Contenu du commentaire.
   * Retourne : Les détails du commentaire ajouté.
   */

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a comment' })
  create(
    @Param('articleId') articleId: string,
    @User('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(articleId, userId, createCommentDto);
  }

  /**
   * Endpoint : Récupérer tous les commentaires d'un article
   * Méthode : GET
   * Description : Permet de lister tous les commentaires associés à un article spécifique.
   * Paramètres :
   * - articleId : ID de l'article.
   * Retourne : Une liste des commentaires de l'article.
   */
  @Get()
  @ApiOperation({ summary: 'Get all comments for an article' })
  findAll(@Param('articleId') articleId: string) {
    return this.commentsService.findByArticleId(articleId);
  }

  /**
   * Endpoint : Mettre à jour un commentaire
   * Méthode : PATCH
   * Description : Permet à l'auteur d'un commentaire de le mettre à jour.
   * Paramètres :
   * - id : ID du commentaire.
   * - userId : ID de l'utilisateur connecté.
   * - updateCommentDto : Nouveau contenu du commentaire.
   * Retourne : Le commentaire mis à jour.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, userId, updateCommentDto);
  }
  /**
   * Endpoint : Supprimer un commentaire
   * Méthode : DELETE
   * Description : Permet à l'auteur d'un commentaire de le supprimer.
   * Paramètres :
   * - id : ID du commentaire.
   * - userId : ID de l'utilisateur connecté.
   * Retourne : Confirmation de suppression.
   */

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.commentsService.remove(id, userId);
  }
}
