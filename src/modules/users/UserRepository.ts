import { MysqlDataSource } from "../..";
import { NewUserInput, User } from "./entities/User";

type T = User;

export class UserRepository {
  public reposiory = MysqlDataSource.getRepository(User).extend({
    async getUsers() {
      return await this.createQueryBuilder("user").getMany();
    },

    async findByEmail(email: string): Promise<T | null> {
      return await this.findOne({
        where: {
          email: email,
        },
      });
    },

    async getUser(id: string): Promise<T | null> {
      const user = await this.createQueryBuilder("user")
        .andWhere("user.id = :id", { id })
        .getOne();
      return user;
    },

    async createUser(data: NewUserInput): Promise<User> {
      const user = new User();
      user.firstname = data.firstname;
      user.lastname = data.lastname;
      user.email = data.email;
      return await this.save(user);
    },
  });
}
