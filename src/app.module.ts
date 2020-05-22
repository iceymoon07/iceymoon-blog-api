import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthLoginMiddleware } from './middlewares/authlogin.middleware';

@Module({
  imports: [PostsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthLoginMiddleware)
      .forRoutes(
        { path: 'posts/:id', method: RequestMethod.DELETE },
        { path: 'posts', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.PUT }
      )
  }
}
