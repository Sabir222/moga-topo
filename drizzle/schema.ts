import {
  pgTable,
  uuid,
  text,
  jsonb,
  real,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["client", "admin"])
export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected",
  "completed",
])

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  role: roleEnum("role").default("client"),
  monthlyQuota: integer("monthly_quota").default(5),
  usedQuota: integer("used_quota").default(0),
})

export const requests = pgTable("requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id),
  status: statusEnum("status").default("pending"),
  geojson: jsonb("geojson"),
  area: real("area"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const requestFiles = pgTable("request_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").references(() => requests.id),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
})
