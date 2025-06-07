import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const skips = pgTable("skips", {
  id: serial("id").primaryKey(),
  size: integer("size").notNull(),
  hire_period_days: integer("hire_period_days").notNull(),
  transport_cost: decimal("transport_cost", { precision: 10, scale: 2 }),
  per_tonne_cost: decimal("per_tonne_cost", { precision: 10, scale: 2 }),
  price_before_vat: decimal("price_before_vat", { precision: 10, scale: 2 }).notNull(),
  vat: decimal("vat", { precision: 5, scale: 2 }).notNull(),
  postcode: text("postcode").notNull(),
  area: text("area").notNull(),
  forbidden: boolean("forbidden").notNull().default(false),
  allowed_on_road: boolean("allowed_on_road").notNull().default(true),
  allows_heavy_waste: boolean("allows_heavy_waste").notNull().default(true),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSkipSchema = createInsertSchema(skips).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSkip = z.infer<typeof insertSkipSchema>;
export type Skip = typeof skips.$inferSelect;
