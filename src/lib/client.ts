import { treaty } from '@elysia/eden'
import type { App } from '../app/api/[[...slugs]]/route'

export const client = treaty<App>(process.env.NEXT_PUBLIC_APP_URL!).api