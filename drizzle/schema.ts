import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// Service Records table for storing Goldwing service records
export const serviceRecords = mysqlTable("service_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  brand: varchar("brand", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  serialNo: varchar("serialNo", { length: 100 }).notNull(),
  useInPlace: varchar("useInPlace", { length: 100 }),
  purchaseLocation: varchar("purchaseLocation", { length: 20 }).notNull(),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  inTime: varchar("inTime", { length: 10 }),
  outTime: varchar("outTime", { length: 10 }),
  coffeeChecked: int("coffeeChecked").default(0).notNull(),
  waterChecked: int("waterChecked").default(0).notNull(),
  descalingChecked: int("descalingChecked").default(0).notNull(),
  milkCleanChecked: int("milkCleanChecked").default(0).notNull(),
  technicalIssues: text("technicalIssues"),
  repairedBy: varchar("repairedBy", { length: 100 }),
  serviceCharges: int("serviceCharges").default(0).notNull(),
  partsJson: text("partsJson"), // JSON string of parts array
  totalAmount: int("totalAmount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceRecord = typeof serviceRecords.$inferSelect;
export type InsertServiceRecord = typeof serviceRecords.$inferInsert;