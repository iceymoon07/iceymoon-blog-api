import { getModelForClass, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class Post extends TimeStamps {
    @prop()
    title: string
    @prop()
    content: string
    @prop()
    viewcount: number
}

export const PostModel = getModelForClass(Post)