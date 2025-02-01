import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getEnumValues(enumName: string): Promise<string[]> {
  try {
    const result = await prisma.$queryRaw<
      { value: string }[]
    >`SELECT e.enumlabel AS value
       FROM pg_enum e
       JOIN pg_type t ON e.enumtypid = t.oid
       WHERE t.typname = ${enumName}`;
    
    return result.map(row => row.value);
  } catch (error) {
    console.error("Error fetching enum values:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
