import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      number: "1111111111",
      email: "alice@example.com",
      password: await bcrypt.hash("alice123", 10),
      name: "Alice",
      Balance: {
        create: {
          amount: 20000,
          locked: 5000,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "token_1111",
          provider: "HDFC Bank",
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      number: "2222222222",
      email: "bob@example.com",
      password: await bcrypt.hash("bob", 10),
      name: "Bob",
      Balance: {
        create: {
          amount: 5000,
          locked: 1000,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 5000,
          token: "token_2222",
          provider: "ICICI Bank",
        },
      },
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { email: "merchant@example.com" },
    update: {},
    create: {
      email: "merchant@example.com",
      name: "Jethalal",
      auth_type: "Google",
    },
  });

  console.log({ user1, user2, merchant });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("> Failed to Seed DB:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
