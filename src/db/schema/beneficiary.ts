import { pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { deliveryHistory } from './delivery_history';

export const beneficiaries = pgTable('beneficiaries', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  document: varchar('document', { length: 25 }).unique(), // CPF / RG
  phone: varchar('phone', { length: 50 }),
  birthDate: varchar('birth_date', { length: 20 }), // Ex: YYYY-MM-DD
  street: varchar('street', { length: 255 }).notNull(),
  number: varchar('number', { length: 50 }).notNull(),
  neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 10 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  complement: varchar('complement', { length: 255 }),
  referencePoint: text('reference_point'),
  status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // 'ACTIVE' | 'INACTIVE'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    documentIdx: index('beneficiaries_document_idx').on(table.document),
    neighborhoodIdx: index('beneficiaries_neighborhood_idx').on(table.neighborhood),
    statusIdx: index('beneficiaries_status_idx').on(table.status),
  };
});

export const beneficiariesRelations = relations(beneficiaries, ({ many }) => ({
  deliveries: many(deliveryHistory),
}));

export type Beneficiary = typeof beneficiaries.$inferSelect;
export type NewBeneficiary = typeof beneficiaries.$inferInsert;
