import { Controller, Get, Post, Body, Put, Param } from "@nestjs/common";
import { ApiTags, ApiProperty, ApiOperation } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { TagsModel, Tags } from "./tags.model";


class TagDto {
    @ApiProperty({ description: '标签名', example: '默认标签名' })
    @IsNotEmpty({ message: '标签名不能为空' })
    name: string
}

@Controller('tags')
@ApiTags('文章分类标签')
export class TagsController {
    @Get('/')
    @ApiOperation({ summary: '列出所有标签' })
    async index() {
        return await TagsModel.find()
    }

    @Get(':id')
    @ApiOperation({ summary: '根据 id 查找标签' })
    async detail(@Param('id') id: string) {
        return await TagsModel.findById(id)
    }

    @Post()
    @ApiOperation({ summary: '创建新标签' })
    async create(@Body() createTagDto: TagDto) {
        const { name } = createTagDto
        const existedTag = await TagsModel.findOne({ name: name })
        if (existedTag) {
            return {
                msg: "该标签名已经存在，请重新输入标签名"
            }
        }
        await TagsModel.create(createTagDto)
        return { msg: '新标签创建成功' }
    }

    @Put(':id')
    @ApiOperation({ summary: '修改标签名' })
    async update(@Param('id') id: string, @Body() updateDto: TagDto) {
        const { name } = updateDto
        const existedTag = await TagsModel.findOne({ name: name })
        if (existedTag) {
            return {
                msg: "该标签名已经存在，请重新输入标签名"
            }
        }
        await TagsModel.findByIdAndUpdate(id, updateDto)
        return { msg: '标签名修改成功' }
    }
}