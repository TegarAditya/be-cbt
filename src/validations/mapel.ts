import { t } from "elysia"

export const listAllMapelQueryValidation = t.Object({
    type: t.String({ enum: ["cbt", "pts", "pas", "all"] }),
})

export const getMapelByIdParamsValidation = t.Object({
    id: t.Numeric(),
})
