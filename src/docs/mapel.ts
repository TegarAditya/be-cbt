import { OpenAPIV3 } from "openapi-types"

export const listMapelResponse: OpenAPIV3.ResponsesObject = {
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
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "number",
                                    },
                                    nama: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                    example: {
                        success: true,
                        message: "Success",
                        data: [
                            {
                                id: 688,
                                nama: "PTS-9-IPS-KURTILAS",
                            },
                        ],
                    },
                    required: ["success", "message"],
                },
            },
        },
    },
}

export const detailMapelResponse: OpenAPIV3.ResponsesObject = {
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
                        data: {
                            type: "object",
                            properties: {
                                id_mapel: {
                                    type: "number",
                                },
                                nama: {
                                    type: "string",
                                },
                                soal: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            nomor: {
                                                type: "number",
                                            },
                                            soal: {
                                                type: "string",
                                            },
                                            jawaban: {
                                                type: "string",
                                            },
                                            pembahasan: {
                                                type: "string",
                                            },
                                            pilA: {
                                                type: "string",
                                            },
                                            pilB: {
                                                type: "string",
                                            },
                                            pilC: {
                                                type: "string",
                                            },
                                            pilD: {
                                                type: "string",
                                            },
                                            pilE: {
                                                type: "string",
                                            },
                                            file: {
                                                type: "string",
                                            },
                                            file1: {
                                                type: "string",
                                            },
                                            fileA: {
                                                type: "string",
                                            },
                                            fileB: {
                                                type: "string",
                                            },
                                            fileC: {
                                                type: "string",
                                            },
                                            fileD: {
                                                type: "string",
                                            },
                                            fileE: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    example: {
                        success: true,
                        message: "Success",
                        data: {
                            id_mapel: 612,
                            nama: "PTS-SMP-8-IPS-K13",
                            soal: [
                                {
                                    nomor: 1,
                                    soal: "Pihak yang melakukan kegiatan untuk menghasilkan barang dan jasa guna memenuhi kepentingan orang lain disebut dengan..",
                                    jawaban: "pilC",
                                    pembahasan: "",
                                    pilA: "Distribusi ",
                                    pilB: "Konsumen",
                                    pilC: "Produsen ",
                                    pilD: "Rumah tangga pemerintah ",
                                    pilE: "",
                                    file: null,
                                    file1: "",
                                    fileA: "",
                                    fileB: "",
                                    fileC: "",
                                    fileD: "",
                                    fileE: "",
                                },
                            ],
                        },
                    },
                    required: ["success", "message"],
                },
            },
        },
    },
    404: {
        description: "Not Found",
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
                    },
                    example: {
                        success: false,
                        message: "Not Found",
                    },
                },
            },
        },
    },
}
