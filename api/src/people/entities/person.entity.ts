import { Person as PersonEntity } from '@prisma/client'

export class Person implements PersonEntity {
  personId: string
  firstName: string
  lastName: string
  gender: string
  email: string
  isDeleted: boolean
  updatedAt: Date
}
