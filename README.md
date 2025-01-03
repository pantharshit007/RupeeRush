<h1 align="center">Rupee₹ush</h1>

A comprehensive, feature-rich payment platform inspired by Paytm, Venmo, and PayPal, combining seamless transactions with monorepo architecture using TypeScript.

---

## **✨ Features**

- **User Management**:

  - Secure user registration, authentication, and two-factor authentication.
  - Role-based user access.

- **Transaction Services**:

  - P2P (Peer-to-Peer) payments.
  - B2B (Business-to-Business) transactions.
  - Wallet transactions with integrated provider support.

- **Wallet System**:

  - UPI support for secure and efficient payments.
  - Wallet lock and failed attempt tracking for enhanced security.

- **Banking Services**:

  - Manage bank accounts, including balance checks and card details.
  - Smooth deposit and withdrawal processes.

- **Webhook Management**:
  - Reliable processing of webhooks with retry mechanisms.

---

## **⚙️ Tech Stack**

| Component    | Technology                 |
| ------------ | -------------------------- |
| **Frontend** | Next.js, Vite              |
| **Backend**  | Next.js, Node.js (Express) |
| **Bank BE**  | Cloudflare Workers (Hono)  |
| **Database** | PostgreSQL                 |
| **Styles**   | Tailwind CSS               |

---

## **📂Folder Structure**

```plaintext
RupeeRush
├── apps
│   ├── user-app      # User-facing Next.js application
│   ├── webhook       # Node.js + Express for handling webhooks
│   ├── bank-api      # Bank API built with Hono worker on Cloudflare
│   ├── bank-page     # Bank user interface built with Vite
├── packages
│   ├── db
│   ├── eslint-config
│   ├── typescript-config
│   ├── zod-schema
│   ├── store
│   ├── ui
├── turbo.json
├── .lintstagedrc.js
├── .eslintignore
├── package.json
├── README.md
```

---

## **💾 Database Design**

### **ER Diagram**

Er Diagram of B2B Transaction can be found [here](https://claude.site/artifacts/f9363611-1200-485c-8531-41fda91c7aa8).

Er Diagram of Database:
![db_er_diagram](https://github.com/user-attachments/assets/885e69e3-6e96-4131-8121-cd7a03b97246)

### **Key Models**

1. **User**

   - Stores user information, including email, phone number, and roles.
   - Includes relationships with wallets, bank accounts, and transactions.

2. **Transactions**

   - Tracks P2P, B2B, and Wallet transactions.
   - Maintains sender and receiver details while ensuring integrity even if a user is deleted.

3. **Bank Account**

   - Manages user bank details, card data, and account balance.

4. **Wallet Balance**
   - Handles wallet balance and locked funds for transactions in progress.

---

## **Installation**

### **Prerequisites**

- Node.js (v18+ recommended)
- PostgreSQL (v14+ recommended)
- Npm

### **Setup**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pantharshit007/RupeeRush.git
   cd RupeeRush
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the respective folder and update the environment variables.

   ```bash
   cd app/user-app
   cp .env.example .env
   ```

   ```bash
   cd app/webhook
   cp .env.example .env
   ```

   ```bash
   cd app/bank-page
   cp .dev.vars.example .dev.vars
   ```

   ```bash
   cd app/bank-api
   cp .env.example .env
   ```

   > [!IMPORTANT]
   > If you want to run all 4 apps then mark `USE_ADAPTER` `false` for `app/webhook`

   > by default if you run `npm i` it will not pick up `USE_ADAPTER` from `.env` file, so the `flag` wouldn't be active and prisma client wouldn't work with `hono`, so after installation uncomment the line from `prisma/schema.prisma` and then from root run `npm run db:generate` to generate prisma client and seed the db.

   > Reason for all this at the bottom.

4. **Set up the database**:

   ```bash
   npm run db:docker #or use your own db
   npm run db:push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## **Usage**

### **Local Development**

- **Frontend**: Access the Next.js app at `http://localhost:3000`.
- **Webhook**: Start the webhook service locally and test it with your events at port `4000`.
- **Bank API**: Deploy or test locally using Cloudflare Workers at port `5000`.
- **Bank Page**: Start the bank page locally using Vite.
- **Database**: Start the database locally using Docker (but currently hono is not working with local db setup need to fix this).

> [!NOTE]
> First of all `user-app` and `webhook` works fine with docker db but the problem is with `bank-api` it doesn't work with local db, so i have to fix that, for now we have to use prostgres prod db.

> I am using `USE_ADAPTER` flag to enable/disable the prisma adapter for neon, because sending prisma client along with driver adapter was causing my next middleware to go over 1MB limit (1.01MB) it's issue from there end since my middleware was within 200KB limit, but oh well this was the reason for which I had to disable it.

---

## **Security Considerations**

- Two-factor authentication for sensitive actions.
- All sensitive data (e.g., card PINs) is hashed before storage.

---

## **Future Enhancements**

- **Notifications**: Add email notifications for transactions.
- **Merchant Integrations**: Allow businesses to integrate with the platform.

---

## **Contributing**

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Create a pull request.

---

## **License**

This project is licensed under the MIT License.

---
