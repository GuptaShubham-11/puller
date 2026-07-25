import { z } from "zod";

export const connectRepositorySchema = z.object({
    repoUrl: z.string().url(),
    token: z.string().min(10),
});

export type ConnectRepositoryInput =
    z.infer<typeof connectRepositorySchema>;