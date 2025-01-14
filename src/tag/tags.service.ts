// src/tags/tags.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupère tous les tags.
   * @returns Une liste de tous les tags disponibles.
   */
  async findAll() {
    return this.prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }
}
