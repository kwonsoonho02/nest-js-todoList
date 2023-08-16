import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/users.entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './module/users.module';
import { AuthModule } from './module/auth.module';
import { UserController } from './controllers/users.controller';
import { TodoController } from './controllers/todos.controller';
import { JwtService } from '@nestjs/jwt';
import { TodoModule } from './module/todos.module';
import { AuthGuard } from './guard/auth.guard';
import { Todo } from './entities/todos.entities';
import { RefreshGuard } from './guard/refresh.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USER:', configService.get('DB_USER'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
        console.log('DB_DATABASE:', configService.get('DB_DATABASE'));

        return {
          dialect: 'mariadb',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          models: [User, Todo],
          synchronize: true,
          autoLoadModels: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),

    UserModule,
    TodoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, AuthGuard, RefreshGuard],
})
export class AppModule {}
