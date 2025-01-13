import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un commentaire associé à un article.
   * Vérifie d'abord si l'article existe.
   *
   * @param articleId - ID de l'article où le commentaire sera ajouté.
   * @param userId - ID de l'utilisateur qui ajoute le commentaire.
   * @param createCommentDto - Contenu du commentaire.
   * @returns Les détails du commentaire créé.
   * @throws NotFoundException si l'article n'existe pas.
   */

  async create(
    articleId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    // Vérifier si l'article existe
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        article: { connect: { id: articleId } },
        author: { connect: { id: userId } },
      },
      include: {
        author: true,
      },
    });
  }

  /**
   * Récupère tous les commentaires associés à un article.
   *
   * @param articleId - ID de l'article cible.
   * @returns Une liste de commentaires triés par date de création (plus récents en premier).
   */

  async findByArticleId(articleId: string) {
    return this.prisma.comment.findMany({
      where: { articleId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Met à jour le contenu d'un commentaire existant.
   * Vérifie que le commentaire existe et que l'utilisateur est bien l'auteur.
   *
   * @param id - ID du commentaire à mettre à jour.
   * @param userId - ID de l'utilisateur connecté.
   * @param updateCommentDto - Nouveau contenu du commentaire.
   * @returns Le commentaire mis à jour.
   * @throws NotFoundException si le commentaire n'existe pas.
   * @throws ForbiddenException si l'utilisateur n'est pas l'auteur.
   */

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException("Cannot update someone else's comment");
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: true,
      },
    });
  }

  /**
   * Supprime un commentaire existant.
   * Vérifie que le commentaire existe et que l'utilisateur est bien l'auteur.
   *
   * @param id - ID du commentaire à supprimer.
   * @param userId - ID de l'utilisateur connecté.
   * @returns Confirmation de suppression.
   * @throws NotFoundException si le commentaire n'existe pas.
   * @throws ForbiddenException si l'utilisateur n'est pas l'auteur.
   */

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException("Cannot delete someone else's comment");
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
