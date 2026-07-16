import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (synchronized from Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Agents table (belongs to a user)
export const agents = pgTable('agents', {
  id: text('id').primaryKey(), // We can keep string IDs like "agent-1" or generate UUIDs
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  status: text('status').notNull(), // WORKING, WAKING, SLEEPING, etc.
  instruction: text('instruction').notNull(),
  budget: integer('budget').notNull(),
  avatarBg: text('avatar_bg').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tasks table (belongs to a user)
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(), // String ID like "task-1" or UUID
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  agentId: text('agent_id').notNull(), // References an agent id string
  priority: text('priority').notNull(), // HIGH, MEDIUM, LOW, etc.
  status: text('status').notNull(), // TO_DO, IN_PROGRESS, REVIEW, DONE
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
  tasks: many(tasks),
}));

export const agentsRelations = relations(agents, ({ one }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));
