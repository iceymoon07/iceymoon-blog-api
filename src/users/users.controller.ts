import { Controller, Get, Post, Body, Delete, Param, Req, Res } from '@nestjs/common';
import { UserModel } from './user.model'
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/constant';
import { Request, Response } from 'express';

class UserDto {
    @ApiProperty({ description: '用户名', example: 'admin' })
    name: string
    @ApiProperty({ description: '密码', example: 'admin' })
    password: string
    @ApiProperty({ description: '再次输入的密码', example: 'admin' })
    repassword: string
}

class LoginDto {
    @ApiProperty({ description: '用户名' })
    name: string
    @ApiProperty({ description: '密码' })
    password: string
}

@Controller('users')
@ApiTags('用户注册登录')
export class UsersController {
    @Get('/')
    @ApiOperation({ summary: '列出所有用户信息' })
    async index() {
        return await UserModel.find()
    }

    @Post()
    @ApiOperation({ summary: '新用户注册' })
    async create(@Body() createUserDto: UserDto) {
        const { name, password, repassword } = createUserDto
        const existedUser = await UserModel.findOne({ name: name })
        if (password !== repassword) {
            return {
                msg: "两次输入的密码不一致"
            }
        }
        if (existedUser) {
            return {
                msg: "该用户名已被注册"
            }
        }
        await UserModel.create({
            name: name,
            password: password,
            role: USER_ROLE.NORMAL
        })
        return {
            msg: "注册成功"
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除用户' })
    async remove(@Param('id') id: string) {
        await UserModel.findByIdAndDelete(id)
        return {
            msg: '用户删除成功'
        }
    }

    @Post('login')
    @ApiOperation({ summary: '登录' })
    async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
        const { name, password } = loginDto
        const user = await UserModel.findOne({ name: name, password: password })
        if (user) {
            req.session.name = name
            res.send({
                msg: '登录成功'
            })
        } else {
            res.status(404).send({
                message: '账号或密码错误'
            })
        }
    }

    @Get('logout')
    @ApiOperation({ summary: '注销' })
    async logout(@Req() req: Request) {
        req.session.destroy((err) => { })
        return {
            msg: '已注销'
        }
    }

    @Get('islogin')
    @ApiOperation({ summary: '是否已登录' })
    async isLogin(@Req() req: Request) {
        return req.session.name === 'admin'
    }
}
