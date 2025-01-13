import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable() // Déclare cette classe comme un service injectable.
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouvel utilisateur avec un mot de passe haché.
   *
   * @param createUserDto - Contient l'email, le nom d'utilisateur et le mot de passe.
   * @returns Les informations de l'utilisateur créé, y compris son profil.
   * @throws ConflictException si l'email ou le nom d'utilisateur existe déjà.
   */

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    // Vérifier si l'email ou le username existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {}, // Crée un profil vide
        },
      },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Récupère tous les utilisateurs avec leurs profils, articles et commentaires.
   *
   * @returns Une liste d'utilisateurs.
   */

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: {
            articles: true,
            comments: true,
          },
        },
      },
    });
  }

  /**
   * Récupère un utilisateur spécifique par son ID.
   *
   * @param id - ID de l'utilisateur.
   * @returns Les informations de l'utilisateur, y compris son profil et ses articles.
   */

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        articles: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    const data: any = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
      },
    });
  }

  /**
   * Met à jour le profil d'un utilisateur connecté (bio, avatar, etc.).
   *
   * @param userId - ID de l'utilisateur connecté.
   * @param updateProfileDto - Données à mettre à jour dans le profil.
   * @returns Le profil mis à jour.
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }

  /**
   * Supprime un utilisateur de la base de données.
   *
   * @param id - ID de l'utilisateur.
   * @returns Confirmation de suppression.
   */

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
