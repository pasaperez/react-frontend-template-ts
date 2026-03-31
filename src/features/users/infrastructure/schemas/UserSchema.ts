import { z } from 'zod';

export const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export const usersListSchema = z.object({ items: z.array(userSchema) });
