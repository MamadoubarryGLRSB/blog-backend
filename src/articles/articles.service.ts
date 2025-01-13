// src/articles/articles.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { SearchArticleDto, UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouvel article.
   *
   * @param authorId - ID de l'auteur.
   * @param createArticleDto - Données de l'article.
   * @returns Les informations de l'article créé.
   */

  async create(authorId: string, createArticleDto: CreateArticleDto) {
    const { tagIds, ...articleData } = createArticleDto;

    return this.prisma.article.create({
      data: {
        ...articleData,
        author: { connect: { id: authorId } },
        tags: tagIds
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  /**
   * Récupère tous les articles avec leurs relations.
   *
   * @returns Une liste d'articles.
   */

  async findAll() {
    return this.prisma.article.findMany({
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  /**
   * Recherche des articles par mots-clés ou tags.
   */
  async search(searchArticleDto: SearchArticleDto) {
    const { search, tags } = searchArticleDto;

    return this.prisma.article.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          },
          tags
            ? {
                tags: {
                  some: {
                    id: { in: tags },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  /**
   * Récupère un article par ID avec ses relations.
   */
  async findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  /**
   * Met à jour un article existant.
   */
  async update(
    id: string,
    authorId: string,
    updateArticleDto: UpdateArticleDto,
  ) {
    const { tagIds, ...articleData } = updateArticleDto;

    return this.prisma.article.update({
      where: { id, authorId },
      data: {
        ...articleData,
        tags: tagIds
          ? {
              set: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  /**
   * Supprime un article.
   */

  async remove(id: string, authorId: string) {
    return this.prisma.article.delete({
      where: { id, authorId },
    });
  }

  async like(articleId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        article: { connect: { id: articleId } },
        user: { connect: { id: userId } },
      },
    });
  }

  /**
   * Retire un like d'un article.
   */
  async unlike(articleId: string, userId: string) {
    return this.prisma.like.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}
