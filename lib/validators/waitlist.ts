import { z } from 'zod';
import { WAITLIST_SOURCES } from '../database/schema';

export const joinWaitlistSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  source: z.enum(WAITLIST_SOURCES).optional(),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
