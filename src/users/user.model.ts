import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
    @prop()
    name: string
    @prop()
    password: string
    @prop()
    role: number
}

export const UserModel = getModelForClass(User)