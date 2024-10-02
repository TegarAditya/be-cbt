import { ElysiaSwaggerConfig } from "@elysiajs/swagger"

export const swaggerConfig: ElysiaSwaggerConfig = {
    path: "/swagger",
    documentation: {
        info: {
            title: "Bupin's CBT API Documentation",
            version: "1.0.0",
            description: `API documentation for Bupin 4.0's computer-based tests. All parameter definitions and queries can be viewed and tested on this page.`,
        },
        tags: [
            {
                name: "Mapel",
                description: "Fetch Mapel Endpoint",
            },
            {
                name: "Healthcheck",
                description: "Healthcheck Endpoint",
            },
        ],
    },
}

export default swaggerConfig
