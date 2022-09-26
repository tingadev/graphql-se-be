import { UserRepository } from "../UserRepository";
import { Arg, Query, Mutation } from "type-graphql";
import { NewUserInput, User } from "../entities/User";
import { InjectRepository } from "typeorm-typedi-extensions";

export class UserResolver {
  public constructor(
    @InjectRepository(User)
    private userRepository: UserRepository
  ) {
    this.userRepository = new UserRepository();
  }

  @Query((_returns) => User)
  public async getUser(@Arg("id") id: string): Promise<User | null> {
    return await this.userRepository.reposiory.findOne({
      where: {
        id,
      },
    });
  }

  @Query((_returns) => [User])
  public async getUsers(): Promise<User[]> {
    return await this.userRepository.reposiory.find();
  }

  @Mutation((_returns) => User)
  public async createUser(@Arg("data") data: NewUserInput): Promise<User> {
    return await this.userRepository.reposiory.createUser(data);
  }
}
