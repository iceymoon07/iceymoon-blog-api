import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostModel } from './post.model';
import { IsNotEmpty, ArrayNotEmpty } from 'class-validator'

class PostDto {
    @ApiProperty({ description: '文章标题', example: '默认文章标题' })
    @IsNotEmpty({ message: '未读取到标题' })
    title: string
    @ApiProperty({ description: '文章内容', example: '默认文章内容' })
    @IsNotEmpty({ message: '文章内容不能为空' })
    content: string
    @ApiProperty({ description: '文章分类标签', example: ['默认分类'], isArray: true })
    @ArrayNotEmpty({ message: '必须选择分类标签' })
    tags: string[]
}

@Controller('posts')
@ApiTags('文章')
export class PostsController {
    @Get('/')
    @ApiOperation({ summary: '查找所有文章' })
    async index() {
        return await PostModel.find()
    }

    @Get('count')
    @ApiOperation({ summary: '文章数量' })
    async count() {
        return await PostModel.find().count()
    }

    @Post()
    @ApiOperation({ summary: '创建文章' })
    async create(@Body() createPostDto: PostDto) {
        const { title, content, tags } = createPostDto
        await PostModel.create({
            title: title,
            content: content,
            viewcount: 0, // 初始化阅读数为0
            tags: tags
        })
        return {
            msg: "文章发布成功"
        }
    }

    @Get(':id')
    @ApiOperation({ summary: '根据 id 查找文章' })
    async detail(@Param('id') id: string) {
        return await PostModel.findById(id)
    }

    @Get(':tag')
    @ApiOperation({ summary: '根据标签名查找文章' })
    async category(@Param('tag') tag: string) {
        return await PostModel.find({ tags: tag })
    }

    @Put(':id/addview')
    @ApiOperation({ summary: '阅读数加1' })
    async viewAddOne(@Param('id') id: string) {
        await PostModel.findByIdAndUpdate(id, { $inc: { viewcount: 1 } }) // 更新阅读数，用 $inc 操作符自增1
        return {
            msg: "view+1"
        }
    }

    @Put(':id')
    @ApiOperation({ summary: '编辑文章' })
    async update(@Param('id') id: string, @Body() updatePostDto: PostDto) {
        const { title, content, tags } = updatePostDto
        await PostModel.findByIdAndUpdate(id, { $set: { title: title, content: content, tags: tags } })
        return {
            msg: "文章更新成功"
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除文章' })
    async remove(@Param('id') id: string) {
        await PostModel.findByIdAndDelete(id)
        return {
            msg: "文章删除成功"
        }
    }
}
