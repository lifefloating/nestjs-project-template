import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedOptions {
  includeTestData?: boolean;
  userCount?: number;
  postCount?: number;
}

interface PostData {
  title: string;
  content: string;
  published: boolean;
}

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
}

// Parse command line arguments
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);
  const options: SeedOptions = {
    includeTestData: true,
    userCount: 2,
    postCount: 3,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--no-test-data':
        options.includeTestData = false;
        break;
      case '--users':
        if (args[i + 1]) {
          options.userCount = parseInt(args[i + 1], 10);
          i++; // Skip next argument
        }
        break;
      case '--posts':
        if (args[i + 1]) {
          options.postCount = parseInt(args[i + 1], 10);
          i++; // Skip next argument
        }
        break;
    }
  }

  return options;
}

async function createUsers(options: SeedOptions) {
  console.log('👥 Creating users...');

  // Always create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Create additional users if test data is enabled
  const userCount = options.userCount || 2;
  if (options.includeTestData && userCount > 1) {
    const userPassword = await bcrypt.hash(process.env.USER_PASSWORD || 'user123', 10);

    // Prepare batch user data
    const usersToCreate: UserData[] = [];
    for (let i = 1; i < userCount; i++) {
      usersToCreate.push({
        email: `user${i}@example.com`,
        password: userPassword,
        firstName: `User`,
        lastName: `${i}`,
        role: 'USER' as const,
      });
    }

    if (usersToCreate.length > 0) {
      try {
        const result = await prisma.user.createMany({
          data: usersToCreate,
        });
        console.log(`✅ Created ${result.count} additional users`);

        // Log individual user emails for clarity
        usersToCreate.forEach((user, index) => {
          if (index < result.count) {
            console.log(`   - ${user.email}`);
          }
        });
      } catch (error) {
        console.error('❌ Error creating users:', error);
        throw error;
      }
    }
  }
}

async function createPosts(options: SeedOptions) {
  if (!options.includeTestData) {
    console.log('⏭  Skipping posts creation (test data disabled)');
    return;
  }

  console.log('📝 Creating sample posts...');

  const samplePosts: PostData[] = [
    {
      title: 'Welcome to Our Platform',
      content: 'This is the first post in our system. Welcome aboard!',
      published: true,
    },
    {
      title: 'Getting Started with NestJS',
      content:
        'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.',
      published: true,
    },
    {
      title: 'Introduction to Prisma',
      content: 'Prisma is an open-source ORM for Node.js and TypeScript.',
      published: false,
    },
    {
      title: 'MongoDB Best Practices',
      content: 'Learn how to effectively use MongoDB in your applications.',
      published: true,
    },
    {
      title: 'API Security Guidelines',
      content: 'Essential security practices for building secure APIs.',
      published: false,
    },
  ];

  const postsToCreate = samplePosts.slice(0, options.postCount || 3);

  if (postsToCreate.length > 0) {
    try {
      const result = await prisma.post.createMany({
        data: postsToCreate,
      });
      console.log(`✅ Created ${result.count} posts`);

      // Log individual post titles for clarity
      postsToCreate.forEach((post, index) => {
        if (index < result.count) {
          console.log(`   - ${post.title}`);
        }
      });
    } catch (error) {
      console.error('❌ Error creating posts:', error);
      throw error;
    }
  }
}

async function cleanup() {
  if (process.env.SEED_CLEANUP === 'true') {
    console.log('🧹 Cleaning up existing data...');
    try {
      const deletedPosts = await prisma.post.deleteMany({});
      const deletedUsers = await prisma.user.deleteMany({});
      console.log(
        `✅ Cleanup completed: ${deletedPosts.count} posts, ${deletedUsers.count} users deleted`,
      );
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw error;
    }
  }
}

async function main() {
  const options = parseArgs();
  const startTime = Date.now();

  console.log('🌱 Starting database seeding...');
  console.log('📋 Seed options:', options);

  try {
    await cleanup();
    await createUsers(options);
    await createPosts(options);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`✅ Database seeding completed successfully in ${duration}s!`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Unknown error');
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
