import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export async function seedUsers(connection: DataSource) {
  const userRepository = connection.getRepository(User);
  const roleRepository = connection.getRepository(Role);

  const plainPassword = '123456';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Check if Super Admin role exists
  let superAdminRole = await roleRepository.findOne({ where: { name: 'Super Admin' } });
  if (!superAdminRole) {
    superAdminRole = roleRepository.create({
      name: 'Super Admin',
      description: 'Has full access to the system',
      isSuperAdmin: true
    });
    await roleRepository.save(superAdminRole);
  }

  // Check if Super Admin user exists
  const superAdminUser = await userRepository.findOne({
    where: { email: 'admin@example.com' },
    relations: ['roles']
  });

  if (!superAdminUser) {
    const user = userRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      phone: '0123456789',
      gender: 1,
      address: '123 Hoang Dieu',
      avatar: null,
      status: 1,
      roles: [superAdminRole]
    });
    await userRepository.save(user);
  } else {
    // Ensure the user has Super Admin role
    if (!superAdminUser.roles.some((role) => role.name === 'Super Admin')) {
      superAdminUser.roles.push(superAdminRole);
      await userRepository.save(superAdminUser);
    }
  }

  const users = [
    {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      phone: '0123456789',
      gender: 1,
      address: '123 Hoang Dieu',
      avatar: null,
      status: 1
    },
    {
      email: 'user@example.com',
      password: hashedPassword,
      fullName: 'Normal User',
      phone: '0987654321',
      gender: 2,
      address: '456 Hoang Dieu',
      avatar: null,
      status: 1
    }
    // Add more user data if needed
  ];

  // Save users and create employment histories
  for (const userData of users) {
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }
  }
}
