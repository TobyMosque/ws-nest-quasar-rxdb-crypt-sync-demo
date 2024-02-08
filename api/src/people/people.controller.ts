import { Controller, Get, Body, Param, Put, Query, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { FindAllPersonDto } from './dto/find-all-person.dto';
import { Person } from './entities/person.entity';
import { BulkUpsertPersonDto } from './dto/bulk-upsert-person.dto';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  findAll(@Query() dto: FindAllPersonDto): Promise<Person[]> {
    dto.limit = +dto.limit
    return this.peopleService.findAll(dto);
  }

  @Put(':id')
  upsert(@Param('id') id: string, @Body() dto: Person) {
    return this.peopleService.upsert(id, dto);
  }

  @Post()
  bulkUpsert(@Body() dto: BulkUpsertPersonDto) {
    return this.peopleService.bulkUpsert(dto.people);
  }
}
