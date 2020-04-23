import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserModel } from './user.model'
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/constant';

class UserDto {
    @ApiProperty({ description: '用户名', example: 'admin' })
    name: string
    @ApiProperty({ description: '密码', example: 'admin' })
    password: string
    @ApiProperty({ description: '再次输入的密码', example: 'admin' })
    repassword: string
}

@Controller('users')
@ApiTags('用户账号')
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
}
