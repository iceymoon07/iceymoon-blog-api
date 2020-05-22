import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthLoginMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        if (req.session.name === 'admin') {
            next()
        }
        else {
            res.status(403).send({
                message: '请先登录'
            })
        }
    }
}