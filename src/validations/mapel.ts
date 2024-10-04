import { t } from "elysia"

export const listAllMapelQueryValidation = t.Object({
    type: t.String({
        enum: ["cbt", "pts", "pas", "all"],
        default: "cbt",
        description: "Type of mapel to be fetched",
    }),
    limit: t.Optional(
        t.Numeric({
            default: 25,
            maximum: 100,
        })
    ),
    page: t.Optional(
        t.Numeric({
            default: 1,
        })
    ),
    search: t.Optional(
        t.String({
            default: "",
            examples: ["MTK", "IPA", "BJTI"],
        })
    ),
})

export const getMapelByIdParamsValidation = t.Object({
    id: t.Numeric({
        description: "ID of the mapel",
    }),
})
