import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
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

class QueryOption {
    @ApiProperty({ description: '按什么字段排序' })
    orderBy: string
    @ApiProperty({ description: '升序还是降序' })
    ascOrDesc: number
}

@Controller('posts')
@ApiTags('文章')
export class PostsController {
    @Get('/')
    @ApiOperation({ summary: '查找所有文章' })
    async index() {
        return await PostModel.find()
    }

    @Get('info')
    @ApiOperation({ summary: '按创建时间或阅读量顺序，查找所有文章信息（不要文章内容字段）' })
    async info(@Query() query: QueryOption) {
        if (query.orderBy === 'time') {
            return await PostModel.find({}, { content: 0 }).sort({ createdAt: query.ascOrDesc })
        }
        else {
            return await PostModel.find({}, { content: 0 }).sort({ viewCount: query.ascOrDesc })
        }
    }

    @Get('count')
    @ApiOperation({ summary: '所有文章数量' })
    async count() {
        return await PostModel.countDocuments()
    }

    @Get('tags')
    @ApiOperation({ summary: '查找所有分类标签,以及其对应的文章数量' })
    async tags() {
        const originArr = await PostModel.find({}, { tags: 1, _id: 0 }) // 查询出所有文章的 tags 字段
        let tempArr: string[] = []
        for (let i = 0; i < originArr.length; i++) {
            tempArr = tempArr.concat(originArr[i].tags)
        } // 用 contact 把所有文章的 tags 连接成一个数组
        let setArr = Array.from(new Set(tempArr)) // 数组去重
        let resultArr: object[] = []
        for (let i = 0; i < setArr.length; i++) {
            let name = setArr[i]
            let count = await PostModel.countDocuments({ tags: name })  // 对数组中的每一个 tag 查询其对应的文章数量
            resultArr.push({ name: name, count: count }) // 组装一个对象 push 进最终要返回的结果数组
        }
        return resultArr
    }

    @Post()
    @ApiOperation({ summary: '创建文章' })
    async create(@Body() createPostDto: PostDto) {
        const { title, content, tags } = createPostDto
        await PostModel.create({
            title: title,
            content: content,
            viewCount: 0, // 初始化阅读数为0
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

    @Get('tags/:tag')
    @ApiOperation({ summary: '根据标签名查找文章' })
    async category(@Param('tag') tag: string) {
        return await PostModel.find({ tags: tag })
    }

    @Put(':id/addview')
    @ApiOperation({ summary: '阅读数加1' })
    async viewAddOne(@Param('id') id: string) {
        await PostModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }) // 更新阅读数，用 $inc 操作符自增1
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
