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
import { UsersService } from './users.service';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users') // Groupe Swagger : regroupe tous les endpoints "users" sous une même catégorie.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint : Créer un utilisateur
   * Méthode : POST
   * URL : /users
   * Description : Permet de créer un nouvel utilisateur dans l'application.
   * Paramètres :
   * - createUserDto : Contient l'email, le nom d'utilisateur et le mot de passe.
   * Retourne : Les informations de l'utilisateur nouvellement créé.
   */

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint : Lister tous les utilisateurs
   * Méthode : GET
   * URL : /users
   * Description : Récupère tous les utilisateurs avec leurs profils, articles et commentaires.
   * Accessible uniquement aux utilisateurs connectés (JwtAuthGuard).
   */

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }
  /**
   * Endpoint : Récupérer le profil de l'utilisateur connecté
   * Méthode : GET
   * URL : /users/profile
   * Description : Récupère les informations de l'utilisateur connecté.
   * Utilise le décorateur personnalisé @User pour obtenir l'ID de l'utilisateur.
   */

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@User('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Endpoint : Récupérer un utilisateur spécifique par ID
   * Méthode : GET
   * URL : /users/:id
   * Description : Récupère les détails d'un utilisateur spécifique.
   * Nécessite une authentification via JwtAuthGuard.
   */

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(
    @User('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Endpoint : Supprimer un utilisateur
   * Méthode : DELETE
   * URL : /users/:id
   * Description : Supprime un utilisateur spécifique par son ID.
   * Nécessite une authentification via JwtAuthGuard.
   */

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
