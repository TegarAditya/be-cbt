import { healthcheckResponse } from "@/docs/healthcheck"
import { db } from "@/libs/database"
import Elysia from "elysia"
import { ip } from "elysia-ip"

export const HealthCheckRouter = new Elysia().use(ip()).get(
    "/",
    async (req) => {
        return {
            client: req.ip,
            message: "Elysia is running",
            status: await statusBuilder(),
        }
    },
    {
        detail: {
            summary: "Healthcheck",
            description: "Check the health of the service",
            tags: ["Healthcheck"],
            responses: healthcheckResponse,
        },
    }
)

const statusBuilder = async () => {
    try {
        const dbCheck = await db.$queryRaw`SELECT 1`
        if (dbCheck)
            return {
                db: "OK",
            }
    } catch (error) {
        return {
            db: "Error",
            message: error,
        }
    }
}

export default HealthCheckRouter
