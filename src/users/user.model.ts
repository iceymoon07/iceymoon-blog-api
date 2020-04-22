import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
    @prop()
    name: string
    @prop()
    password: string
}

export const UserModel = getModelForClass(User)