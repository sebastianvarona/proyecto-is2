import type { Password, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { db } from '../utils/db.server';

export type { User } from '@prisma/client';

export async function getUserById(id: User['id']) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return db.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User['email']) {
  return db.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash']
) {
  const userWithPassword = await db.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getTeachers(groups: { id: string; name: string }[] = []) {
  const teachers = await db.user.findMany({
    where: {
      isTeacher: true,
      groups: {
        some: {
          id: {
            in: groups.map((group) => group.id),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return teachers;
}

export async function getTeacherFromGroup(groupId: string) {
  const teacher = await db.user.findFirst({
    where: {
      isTeacher: true,
      groups: {
        some: {
          id: groupId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  return teacher;
}
