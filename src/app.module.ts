import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'Home1@#$',
        database: 'usersmanagement',
        autoLoadEntities: true,
        synchronize: true,
      }
    )
  ],
})
export class AppModule { }
