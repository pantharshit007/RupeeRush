import {
  AuthType,
  Bank,
  PrismaClient,
  TransactionStatus,
  UserRole,
  TransactionType,
} from "@prisma/client";
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
      walletPin: await bcrypt.hash("123456", 10),
      walletBalance: {
        create: {
          balance: 2000_00,
          locked: 50_00,
        },
      },
      bankAccount: {
        create: {
          phoneNumber: "1111111111",
          bankName: Bank.HDFC,
          accountNumber: "1234567890",
          balance: 10_000_00,
          cardType: "American Express",
          cardHolder: "Alice",
          cardNumber: "4111111111111111",
          cardExpiry: "12/2026",
          cardCvv: "123",
          cardPinHash: await bcrypt.hash("123456", 10),
        },
      },
      upiId: "1111111111@hdfcbank",
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(),
            status: TransactionStatus.SUCCESS,
            amount: 200_00,
            provider: Bank.HDFC,
            type: TransactionType.DEPOSIT,
          },
        ],
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
      walletPin: await bcrypt.hash("654321", 10),
      walletBalance: {
        create: {
          balance: 5000_00,
          locked: 1000,
        },
      },
      bankAccount: {
        create: {
          phoneNumber: "2222222222",
          bankName: Bank.AXIS,
          accountNumber: "0987654321",
          balance: 10_000_00,
          cardType: "American Express",
          cardHolder: "Bob",
          cardNumber: "5555555555554444",
          cardExpiry: "12/2026",
          cardCvv: "123",
          cardPinHash: await bcrypt.hash("654321", 10),
        },
      },
      upiId: "2222222222@axisbank",
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(),
            status: TransactionStatus.FAILURE,
            amount: 50_00,
            provider: Bank.AXIS,
            type: TransactionType.DEPOSIT,
          },
        ],
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
