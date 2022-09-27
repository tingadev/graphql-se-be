import { IsEmail } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ObjectType, InputType } from "type-graphql";
@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: string;

  @Field()
  @Column({ default: "Amanotes" })
  public firstname?: string;

  @Field()
  @Column({ default: "Amanotes" })
  public lastname?: string;

  @Field()
  @Column()
  @IsEmail()
  public email!: string;

  @Field((type) => String)
  protected fullname!: string;
}
@InputType()
export class NewUserInput {
  @Field()
  public firstname!: string;

  @Field()
  public lastname!: string;

  @Field()
  public email!: string;
}

@ObjectType()
export class NotificationObject {
  @Field()
  id!: string;

  @Field({ nullable: true })
  message?: User;

  @Field((_) => Date)
  date!: Date;

  @Field()
  type!: string;
}

export interface NotificationPayload {
  id: string;
  message?: User;
  type: string;
}
