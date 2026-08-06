import { pgTable, serial, integer, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { beneficiaries } from './beneficiary';

export const deliveryHistory = pgTable('delivery_history', {
  id: serial('id').primaryKey(),
  beneficiaryId: integer('beneficiary_id').notNull().references(() => beneficiaries.id, { onDelete: 'cascade' }),
  deliveredAt: timestamp('delivered_at').defaultNow().notNull(),
  referenceMonth: varchar('reference_month', { length: 10 }).notNull(), // Ex: "2026-08"
  basketsQuantity: integer('baskets_quantity').default(1).notNull(),
  description: text('description'),
  deliveredBy: varchar('delivered_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    beneficiaryIdx: index('delivery_history_beneficiary_idx').on(table.beneficiaryId),
    referenceMonthIdx: index('delivery_history_month_idx').on(table.referenceMonth),
  };
});

export const deliveryHistoryRelations = relations(deliveryHistory, ({ one }) => ({
  beneficiary: one(beneficiaries, {
    fields: [deliveryHistory.beneficiaryId],
    references: [beneficiaries.id],
  }),
}));

export type DeliveryRecord = typeof deliveryHistory.$inferSelect;
export type NewDeliveryRecord = typeof deliveryHistory.$inferInsert;
