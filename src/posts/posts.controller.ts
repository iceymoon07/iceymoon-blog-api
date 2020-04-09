import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

class CreatePostDto {
    @ApiProperty({ description: '文章标题' })
    title: string
    @ApiProperty({ description: '文章内容' })
    content: string
}

@Controller('posts')
@ApiTags('文章')
export class PostsController {
    @Get('/')
    @ApiOperation({ summary: '显示文章列表' })
    index() {
        return [
            {
                id: 1
            }
        ]
    }

    @Post()
    @ApiOperation({ summary: '创建文章' })
    create(@Body() body: CreatePostDto) {
        return body
    }

    @Get(':id')
    @ApiOperation({ summary: '文章详情' })
    detail(@Param('id') id: string) {
        return {
            id: id,
            title: 'iceymoon'
        }
    }

    @Put(':id')
    @ApiOperation({ summary: '编辑文章' })
    update(@Param('id') id: string, @Body() body: CreatePostDto) {
        return {
            id: id,
            body: body
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除文章' })
    remove(@Param('id') id: string) {
        return { success: true }
    }
}
