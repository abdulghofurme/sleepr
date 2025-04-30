import { z } from "zod";

export const configSchema = z.object({
	MONGODB_URI: z.string().url(),
})