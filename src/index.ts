import { Elysia } from "elysia"
import swagger from "@elysiajs/swagger"
import cors from "@elysiajs/cors"
import { rateLimit } from "elysia-rate-limit"
import ApiRoutes from "@/routes/api"
import HealthCheckRouter from "@/routes/healthcheck"
import swaggerConfig from "@/config/swagger"

const app = new Elysia()
    .use(swagger(swaggerConfig))
    .use(cors())
    // .use(rateLimit({ max: 60, duration: 60000 }))

app.group("/api", (app) => app.use(ApiRoutes))

app.group("/healthcheck", (app) => app.use(HealthCheckRouter))

app.listen({
    port: process.env.PORT || 3000,
    reusePort: true,
})

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
