import { OpenAPIV3 } from "openapi-types"

export const healthcheckResponse: OpenAPIV3.ResponsesObject = {
    200: {
        description: "Success",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                        },
                        message: {
                            type: "string",
                        },
                        client: {
                            type: "string",
                        },
                        status: {
                            type: "object",
                            properties: {
                                db: {
                                    type: "string",
                                },
                            },
                            required: ["db"],
                        },
                    },
                    example: {
                        success: true,
                        message: "Elysia is running",
                        client: "",
                        status: {
                            db: "OK",
                        },
                    },
                    required: ["success", "message", "status"],
                },
            },
        },
    },
}
