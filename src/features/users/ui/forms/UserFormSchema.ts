import { z } from 'zod';

export const userFormSchema = z.object({
    email: z.string().trim().email('Use a valid email.'),
    name: z.string().trim().min(2, 'Name must have at least 2 characters.').max(100, 'Name cannot exceed 100 characters.')
});

export type UserFormValues = z.infer<typeof userFormSchema>;
