import { PrismaClient, Prisma } from '@prisma/client';
import { v4 as uid } from 'uuid';
import { faker } from '@faker-js/faker';

const people: Prisma.PersonCreateInput[] = [];

const _date = new Date();
function comb({ date }: { date?: Date } = {}): string {
  if (!date) {
    _date.setTime(_date.getTime() + 1);
    date = _date;
  }
  const uuid = uid();
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
  return uuid.replace(uuid.slice(0, 13), comb);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const prisma = new PrismaClient();
async function main() {
  const person = await prisma.person.findFirst();
  if (!!person) {
    return
  }
  
  for (let i = 0; i < 800; i++) {
    await delay(10)

    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const email = faker.internet.email({ firstName, lastName }).toLowerCase().replace(/ /, a => '.').replace(/\W/, a => '_');
    const updatedAt = new Date()

    people.push({
      personId: comb({ date: updatedAt }),
      firstName,
      lastName,
      gender,
      email,
      updatedAt: new Date(),
      isDeleted: false
    })
  }

  await prisma.$transaction(people.map(data => prisma.person.create({ data })))
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });