import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Person } from './entities/person.entity';
import { FindAllPersonDto } from './dto/find-all-person.dto';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}
 
  async findAll(dto: FindAllPersonDto): Promise<Person[]> {
    const params: Prisma.PersonFindManyArgs = {}
    if (dto.limit) {
      params.take = dto.limit
    }
    if (dto.minUpdatedAt) {
      params.where = {
        updatedAt: {
          gt: dto.minUpdatedAt
        }
      }
    }
    const people = await this.prisma.person.findMany(params)
    return people
  }

  upsert(id: string, dto: Person) {
    const update: Prisma.PersonUpsertArgs['update'] = JSON.parse(JSON.stringify(dto))
    const create: Prisma.PersonUpsertArgs['create'] = JSON.parse(JSON.stringify(dto))
    delete update.personId

    return this.prisma.person.upsert({
      where: {
        personId: id
      },
      create: create,
      update: update
    })
  }

  async bulkUpsert(dtos: Person[]) {
    const upserts = dtos.map(dto => this.upsert(dto.personId, dto))
    await this.prisma.$transaction(upserts)
  }
}
