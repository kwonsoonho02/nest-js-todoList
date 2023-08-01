import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/users.entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModeul } from './module/users.module';
import { AuthModeul } from './module/auth.moule';

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
          models: [User],
          synchronize: true,
          autoLoadModels: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModeul,
    AuthModeul,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
