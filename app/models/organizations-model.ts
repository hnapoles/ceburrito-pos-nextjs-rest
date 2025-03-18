import { z } from 'zod';

export const OrganizationZodSchema = z.object({
  id: z.string().optional(), // MongoDB ObjectID (optional)

  name: z
    .string()
    .min(6, 'Name must be at least 6 characters')
    .max(32, 'Name must not exceed 32 characters'),
  type: z.string().min(3, 'Type must be at least 3 characters'),

  color: z.string().optional(),
  imageUrl: z.string().optional(),

  owner: z
    .string()
    .min(6, 'Owner must be at least 6 characters')
    .max(32, 'Owner must not exceed 32 characters'),
  operator: z
    .string()
    .min(6, 'Operator must be at least 6 characters')
    .max(32, 'Operator must not exceed 32 characters'),

  addressLine1: z
    .string()
    .min(6, 'Address Line 1 must be at least 6 characters')
    .max(255, 'Address Line 1 must not exceed 255 characters'),
  addressLine2: z
    .string()
    .min(6, 'Address Line 2 must be at least 6 characters')
    .max(255, 'Address Line 2 must not exceed 255 characters'),
  addressLine3: z
    .string()
    .min(6, 'Address Line 3 must be at least 6 characters')
    .max(255, 'Address Line 3 must not exceed 255 characters'),

  nonVatRegTin: z.string().optional(),
  vatRegTin: z.string().optional(),
  birMinNumber: z.string().optional(),

  systemNameLine1: z
    .string()
    .min(6, 'System Name Line 1 must be at least 6 characters')
    .max(255, 'System Name Line 1 must not exceed 255 characters'),
  systemNameLine2: z
    .string()
    .min(6, 'System Name Line 2 must be at least 6 characters')
    .max(255, 'System Name Line 2 must not exceed 255 characters'),
  systemNameLine3: z
    .string()
    .min(6, 'System Name Line 3 must be at least 6 characters')
    .max(255, 'System Name Line 3 must not exceed 255 characters'),

  techAddressLine1: z
    .string()
    .min(6, 'Tech Address Line 1 must be at least 6 characters')
    .max(255, 'Tech Address Line 1 must not exceed 255 characters'),
  techNonVatRegTin: z.string().optional(),
  techVatRegTin: z.string().optional(),
  techAccredNumber: z.string().optional(),
  techAccredDateIssued: z.string().optional(),
  techAccredValidUntil: z.string().optional(),

  status: z
    .string()
    .min(3, 'Status must be at least 3 characters')
    .max(32, 'Status must not exceed 32 characters'),

  activeAt: z.string().datetime().optional(),
  disabledAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional(),

  pubKey: z.string().optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),

  createdBy: z.string(),
  updatedBy: z.string(),
});

export type OrganizationBase = z.infer<typeof OrganizationZodSchema>;
