import { getSubjectEnumArray } from "@/utils"
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
            maximum: 1000,
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
    mapel: t.Optional(
        t.String({
            enum: getSubjectEnumArray(),
            description: "Name of the mapel",
        })
    ),
    kelas: t.Optional(
        t.Numeric({
            minimum: 1,
            maximum: 12,
            description: "Class of the mapel",
        })
    ),
    level: t.Optional(
        t.String({
            enum: ["sd", "smp", "sma", "fallback"],
            description: "Level (jenjang) of the mapel",
        })
    )
})

export const listMapelSubjectByKelasQueryValidation = t.Object({
    type: t.String({
        enum: ["cbt", "pts", "pas", "all"],
        default: "pts",
        description: "Type of mapel to be fetched",
    }),
    kelas: t.Numeric({
        minimum: 1,
        maximum: 12,
        default: 1,
        description: "Class of the mapel",
    }),
    level: t.String({
        enum: ["sd", "smp", "sma"],
        default: "sd",
        description: "Level (jenjang) of the mapel",
    }),
})

export const getMapelByIdQueryValidation = t.Object({
    level: t.String({
        enum: ["sd", "smp", "sma", "fallback"],
        description: "Level (jenjang) of the mapel",
    }),
    noscan: t.Optional(
        t.Boolean({
            default: false,
            description: "Whether the ID is from scan or not. If true, the ID will be treated as a IdUjian. If false, the ID will be treated as a normal ID.",
        })
    ),
})

export const getMapelByIdParamsValidation = t.Object({
    id: t.Numeric({
        description: "ID of the mapel",
    }),
})
