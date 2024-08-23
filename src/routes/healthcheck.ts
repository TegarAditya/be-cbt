import Elysia from "elysia"
import { ip } from "elysia-ip"

export const HealthCheckRouter = new Elysia().use(ip()).get("/", (req) => {
    return {
        client: req.ip,
        status: "ok",
        message: "Elysia is running",
    }
})
