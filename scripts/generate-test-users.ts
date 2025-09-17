#!/usr/bin/env ts-node

/**
 * Script to generate test users
 * Script to generate test users
 */

import { User, UserRole } from '../shared/types';

interface TestUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

const testUsers: TestUserData[] = [
  {
    email: 'admin@propbase.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    password: 'admin123!'
  },
  {
    email: 'user@propbase.com',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
    password: 'user123!'
  },
  {
    email: 'premium@propbase.com',
    firstName: 'Premium',
    lastName: 'User',
    role: UserRole.PREMIUM,
    password: 'premium123!'
  },
  {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.USER,
    password: 'john123!'
  },
  {
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: UserRole.PREMIUM,
    password: 'jane123!'
  }
];

/**
 * Generates test users
 * Generates test users
 */
async function generateTestUsers(): Promise<void> {
  console.log('Generating test users...');
  
  for (const userData of testUsers) {
    try {
      // TODO: Implement real user creation
      console.log(`Creating user: ${userData.email} (${userData.role})`);
      
      // Simulate API call
      await simulateUserCreation(userData);
      
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }
  
  console.log('Test user generation completed!');
}

/**
 * Simulates user creation
 * Simulates user creation
 */
async function simulateUserCreation(userData: TestUserData): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log(`✓ User created: ${user.firstName} ${user.lastName} (${user.id})`);
}

/**
 * Main function
 * Main function
 */
async function main(): Promise<void> {
  try {
    await generateTestUsers();
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// Skript ausführen wenn direkt aufgerufen
if (require.main === module) {
  main();
} 