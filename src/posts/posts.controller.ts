import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { PostModel } from './post.model';
import { IsNotEmpty } from 'class-validator'

class PostDto {
    @ApiProperty({ description: '文章标题', example: '默认文章标题' })
    @IsNotEmpty({ message: '未读取到标题' })
    title: string
    @ApiProperty({ description: '文章内容', example: '默认文章内容' })
    @IsNotEmpty({ message: '文章内容不能为空' })
    content: string
}

@Controller('posts')
@ApiTags('文章')
export class PostsController {
    @Get('/')
    @ApiOperation({ summary: '显示文章列表' })
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
        const { title, content } = createPostDto
        await PostModel.create({
            title: title,
            content: content,
            viewcount: 0 // 初始化阅读数为0
        })
        return {
            msg: "文章发布成功"
        }
    }

    @Get(':id')
    @ApiOperation({ summary: '文章详情' })
    async detail(@Param('id') id: string) {
        return await PostModel.findById(id)
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
        const { title, content } = updatePostDto
        await PostModel.findByIdAndUpdate(id, { $set: { title: title, content: content } })
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
