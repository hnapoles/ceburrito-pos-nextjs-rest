import { z } from 'zod';

export const OrganizationZodSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectID (optional)

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
  memberOfOrganizationId: z.string(),
  memberOfOrganizationName: z
    .string()
    .min(6, 'Must be at least 6 characters')
    .max(255, 'Must not exceed 255 characters'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),

  createdBy: z.string(),
  updatedBy: z.string(),
});

export type OrganizationBase = z.infer<typeof OrganizationZodSchema>;

export interface IGetOrganizationResults {
  count: number;
  data: OrganizationBase[];
}

export const storeColorClasses: Record<string, string> = {
  slate: 'bg-slate-500',
  gray: 'bg-gray-500',
  zinc: 'bg-zinc-500',
  neutral: 'bg-neutral-500',
  stone: 'bg-stone-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
};

/*
export default function ColorSelect({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(storeColorClasses).map((colorKey) => (
          <SelectItem key={colorKey} value={colorKey}>
            <div className={`flex items-center gap-2`}>
              <span className={`h-5 w-5 rounded-full ${storeColorClasses[colorKey]}`} />
              {colorKey}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
*/
