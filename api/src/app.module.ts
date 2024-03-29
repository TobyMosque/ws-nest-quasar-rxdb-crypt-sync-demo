import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [PeopleModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
