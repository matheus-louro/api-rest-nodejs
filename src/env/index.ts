import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
}
else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3000)
})

export const env = envSchema.parse(process.env)