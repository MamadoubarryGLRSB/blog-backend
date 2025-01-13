import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage de la base de données
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Création des tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Technology' } }),
    prisma.tag.create({ data: { name: 'Programming' } }),
    prisma.tag.create({ data: { name: 'Web Development' } }),
    prisma.tag.create({ data: { name: 'AI' } }),
    prisma.tag.create({ data: { name: 'Database' } }),
  ]);

  // Création des utilisateurs avec leurs profils
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        username: 'johndoe',
        profile: {
          create: {
            bio: 'Senior Software Engineer passionate about web technologies',
            avatar: 'https://i.pravatar.cc/150?u=johndoe',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        username: 'janesmith',
        profile: {
          create: {
            bio: 'Tech blogger and AI enthusiast',
            avatar: 'https://i.pravatar.cc/150?u=janesmith',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.wilson@example.com',
        password: await bcrypt.hash('password123', 10),
        username: 'bobwilson',
        profile: {
          create: {
            bio: 'Full-stack developer and open source contributor',
            avatar: 'https://i.pravatar.cc/150?u=bobwilson',
          },
        },
      },
    }),
  ]);

  // Création des articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting Started with NestJS',
        content:
          'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications...',
        published: true,
        authorId: users[0].id,
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[1].id }],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'Understanding Prisma with PostgreSQL',
        content:
          'Prisma is a next-generation ORM that can help you build faster and make fewer errors...',
        published: true,
        authorId: users[1].id,
        tags: {
          connect: [{ id: tags[4].id }, { id: tags[2].id }],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'The Future of AI in Web Development',
        content:
          'Artificial Intelligence is revolutionizing how we build and maintain web applications...',
        published: true,
        authorId: users[2].id,
        tags: {
          connect: [{ id: tags[3].id }, { id: tags[0].id }],
        },
      },
    }),
  ]);

  // Création des commentaires
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! Very informative.',
        authorId: users[1].id,
        articleId: articles[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for sharing these insights!',
        authorId: users[2].id,
        articleId: articles[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'This helped me understand Prisma better.',
        authorId: users[0].id,
        articleId: articles[1].id,
      },
    }),
  ]);

  // Création des likes
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[1].id,
        articleId: articles[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        articleId: articles[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[0].id,
        articleId: articles[1].id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
