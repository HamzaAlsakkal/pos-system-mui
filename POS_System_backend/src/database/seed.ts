import { DataSource } from 'typeorm';
import { DatabaseSeeder } from './seeders/database.seeder';

// Database configuration
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'pos',
  entities: [
    'dist/**/*.entity.js'
  ],
  synchronize: false,
  logging: false,
});

async function runSeeder() {
  try {
    console.log('🔗 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully!');

    console.log('🌱 Starting database seeding...');
    const seeder = new DatabaseSeeder(dataSource);
    await seeder.seed();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the seeder
runSeeder();