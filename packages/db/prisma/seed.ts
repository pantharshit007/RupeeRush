import { AuthType, Bank, PrismaClient, TransactionStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      phoneNumber: "1111111111",
      email: "alice@example.com",
      password: await bcrypt.hash("alice123", 10),
      name: "Alice",
      role: UserRole.USER,
      emailVerified: new Date(),
      isTwoFactorEnabled: false,
      walletPin: await bcrypt.hash("1234", 10),
      walletBalance: {
        create: {
          balance: 20000,
          locked: 5000,
        },
      },
      bankAccount: {
        create: {
          phoneNumber: "1111111111",
          bankName: Bank.HDFC,
          accountNumber: "1234567890",
          balance: 20000,
          cardNumber: "4111111111111111",
          cardExpiryMonth: 12,
          cardExpiryYear: 2025,
          cardPinHash: await bcrypt.hash("1234", 10),
        },
      },
      upiId: "1111111111@hdfcbank",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: TransactionStatus.SUCCESS,
          amount: 20000,
          token: "token_1111",
          provider: Bank.HDFC,
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      phoneNumber: "2222222222",
      email: "bob@example.com",
      password: await bcrypt.hash("bob123", 10),
      name: "Bob",
      role: UserRole.USER,
      emailVerified: new Date(),
      isTwoFactorEnabled: false,
      walletPin: await bcrypt.hash("5678", 10),
      walletBalance: {
        create: {
          balance: 5000,
          locked: 1000,
        },
      },
      bankAccount: {
        create: {
          phoneNumber: "2222222222",
          bankName: Bank.AXIS,
          accountNumber: "0987654321",
          balance: 5000,
          cardNumber: "5555555555554444",
          cardExpiryMonth: 6,
          cardExpiryYear: 2026,
          cardPinHash: await bcrypt.hash("5678", 10),
        },
      },
      upiId: "2222222222@axisbank",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: TransactionStatus.FAILURE,
          amount: 5000,
          token: "token_2222",
          provider: Bank.AXIS,
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
      auth_type: AuthType.google,
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
