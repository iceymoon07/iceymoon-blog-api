import { prop, getModelForClass } from "@typegoose/typegoose";

export class Tags {
    @prop()
    name: string
}

export const TagsModel = getModelForClass(Tags)