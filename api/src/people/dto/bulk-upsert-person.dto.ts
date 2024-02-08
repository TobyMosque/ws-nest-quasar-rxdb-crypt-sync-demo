import { Person } from "../entities/person.entity";

export class BulkUpsertPersonDto {
  people: Person[];
}
