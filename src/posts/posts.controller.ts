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
        await PostModel.create(createPostDto)
        return { success: true }
    }

    @Get(':id')
    @ApiOperation({ summary: '文章详情' })
    async detail(@Param('id') id: string) {
        return await PostModel.findById(id)
    }

    @Put(':id')
    @ApiOperation({ summary: '编辑文章' })
    async update(@Param('id') id: string, @Body() updatePostDto: PostDto) {
        await PostModel.findByIdAndUpdate(id, updatePostDto)
        return {
            success: true
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除文章' })
    async remove(@Param('id') id: string) {
        await PostModel.findByIdAndDelete(id)
        return {
            success: true
        }
    }
}
