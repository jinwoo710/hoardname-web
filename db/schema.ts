import {
  integer,
  sqliteTable,
  text,
  primaryKey,
  real,
} from 'drizzle-orm/sqlite-core';
import dayjs from 'dayjs';

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  nickname: text('nickname'),
  openKakaotalkUrl: text('openKakaotalkUrl'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(
    () => new Date()
  ),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const boardgames = sqliteTable('boardgames', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  originalName: text('originalName').notNull(),
  ownerId: text('ownerId'),
  inStorage: integer('inStorage', { mode: 'boolean' }).notNull().default(true),
  bggId: text('bggId'),
  weight: real('weight'),
  bestWith: text('bestWith'),
  recommendedWith: text('recommendedWith'),
  minPlayers: integer('minPlayers'),
  maxPlayers: integer('maxPlayers'),
  thumbnailUrl: text('thumbnailUrl'),
  imageUrl: text('imageUrl'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).$defaultFn(() => dayjs().toDate()),
});

export const shop = sqliteTable('shop', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  originalName: text('originalName').notNull(),
  ownerId: text('ownerId'),
  bggId: text('bggId'),
  thumbnailUrl: text('thumbnailUrl'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).$defaultFn(() => dayjs().toDate()),
  price: integer('price').notNull(),
  memo: text('memo'),
  isDeleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  isOnSale: integer('onSale', { mode: 'boolean' }).notNull().default(true),
});
