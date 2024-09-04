import { eq } from 'drizzle-orm';
import { injectable } from 'inversify';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schema';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { User } from '@/src/entities/models/user';

@injectable()
export class UsersRepository implements IUsersRepository {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const query = db.query.users.findFirst({
        where: eq(users.id, id),
      });

      const user = await query.execute();

      return user;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const query = db.query.users.findFirst({
        where: eq(users.username, username),
      });

      const user = await query.execute();

      return user;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }

  async createUser(input: User): Promise<User> {
    try {
      const query = db.insert(users).values(input).returning();

      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError('Cannot create user.');
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
