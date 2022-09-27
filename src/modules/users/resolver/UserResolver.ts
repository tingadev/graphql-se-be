import { UserRepository } from "../UserRepository";
import {
  Arg,
  Query,
  Mutation,
  Subscription,
  Root,
  Publisher,
  PubSub,
  FieldResolver,
  Resolver,
} from "type-graphql";
import {
  NewUserInput,
  NotificationObject,
  NotificationPayload,
  User,
} from "../entities/User";
import { InjectRepository } from "typeorm-typedi-extensions";
import { DeleteResult } from "typeorm";
@Resolver((of) => User)
export class UserResolver {
  public constructor(
    @InjectRepository(User)
    private userRepository: UserRepository
  ) {
    this.userRepository = new UserRepository();
  }

  @Subscription({
    topics: "NOTIFICATIONS",
  })
  newNotification(
    @Root() notificationPayload: NotificationPayload
  ): NotificationObject {
    return {
      ...notificationPayload,
      date: new Date(),
    };
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
  public async createUser(
    @Arg("data") data: NewUserInput,
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>
  ): Promise<User> {
    const now = new Date().getTime();
    const user = await this.userRepository.reposiory.createUser(data);
    await publish({
      message: user,
      id: user.id.toString(),
      type: "CREATE",
    });
    return user;
  }

  @Mutation((_returns) => String)
  public async deleteUser(
    @Arg("id") id: string,
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>
  ): Promise<String> {
    const now = new Date().getTime();

    const res = await this.userRepository.reposiory.deleteUser(id);
    await publish({
      id: id,
      type: "DELETE",
    });
    return id;
  }

  @FieldResolver((_type) => String)
  public async fullname(@Root() user: User): Promise<string> {
    const fullname = user.firstname + " " + user.lastname;
    return fullname;
  }
}
