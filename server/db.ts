import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, serviceRecords, InsertServiceRecord } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Service Record queries
export async function createServiceRecord(record: InsertServiceRecord) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create service record: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(serviceRecords).values(record);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create service record:", error);
    throw error;
  }
}

export async function getServiceRecordsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get service records: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(serviceRecords)
      .where(eq(serviceRecords.userId, userId))
      .orderBy(desc(serviceRecords.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get service records:", error);
    return [];
  }
}

export async function getServiceRecordById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get service record: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(serviceRecords)
      .where(eq(serviceRecords.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get service record:", error);
    return undefined;
  }
}

export async function updateServiceRecord(id: number, record: Partial<InsertServiceRecord>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update service record: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(serviceRecords)
      .set(record)
      .where(eq(serviceRecords.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update service record:", error);
    throw error;
  }
}

export async function deleteServiceRecord(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete service record: database not available");
    return undefined;
  }

  try {
    const result = await db
      .delete(serviceRecords)
      .where(eq(serviceRecords.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete service record:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
