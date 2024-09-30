import { db } from "@/libs/database"
import Elysia from "elysia"
import { ip } from "elysia-ip"

export const HealthCheckRouter = new Elysia().use(ip()).get(
    "/",
    (req) => {
        return {
            client: req.ip,
            status: statusBuilder().then((data) => data),
            message: "Elysia is running",
        }
    },
    {
        detail: {
            summary: "Healthcheck",
            tags: ["Healthcheck"],
        },
    }
)

const statusBuilder = async () => {
    try {
        const dbCheck = await db.$queryRaw`SELECT 1`
        return {
            db: "OK",
            message: dbCheck,
        }
    } catch (error) {
        return {
            db: "Error",
            message: error,
        }
    }
}
