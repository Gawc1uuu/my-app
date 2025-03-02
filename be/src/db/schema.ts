import { numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from 'ulid'
import { pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
    "deposit",
    "credit",
]);

export const transactionSubTypeEnum = pgEnum("transaction_sub_type", [
    "reward",
    "purchase",
    "refund",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
    "pending",
    "completed",
    "failed",
]);


export const transactionsTable = pgTable("transactions", {
    transactionId: varchar('transaction_id').primaryKey().$defaultFn(ulid),
    userId: varchar('user_id').notNull(),
    type: transactionTypeEnum('type').notNull(),
    subType: transactionSubTypeEnum('sub_type').notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: transactionStatusEnum('status').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow()
});
