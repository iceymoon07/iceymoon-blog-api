import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { PostModel } from './post.model';

class PostDto {
    @ApiProperty({ description: '文章标题', example: '默认文章标题' })
    title: string
    @ApiProperty({ description: '文章内容', example: '默认文章内容' })
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
        let { viewcount } = await PostModel.findById(id, { viewcount: 1 }) // 解构赋值，把 id 对应的文章的阅读数取出来
        viewcount++ // 阅读数+1
        await PostModel.findByIdAndUpdate(id, { $set: { viewcount: viewcount } }) // 更新阅读数
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
