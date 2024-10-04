export type MapelType = "cbt" | "pts" | "pas" | "all"
export type MapelIdType = "id" | "id_ujian" | "id_referrer"
export type SubjectType = keyof typeof SubjectEnum

export enum SubjectEnum {
    // Language subjects
    BahasaIndonesia = "bahasa-indonesia" | "INDO",
    BahasaInggris = "bahasa-inggris" | "ING",
    BahasaArab = "bahasa-arab" | "BA" | "BARAB",
    BahasaJawaTengah = "bahasa-jawa-tengah" | "BJTE",
    BahasaJawaTimur = "bahasa-jawa-timur" | "BJTI",
    BahasaSunda = "bahasa-sunda" | "SUNDA",

    // Religious studies
    AkidahAkhlak = "akidah-akhlak" | "AA",
    Fikih = "fikih" | "FIQ",
    PAIBP = "paibp" | "PAIBP" | "PAI",
    Qurdis = "qurdis" | "QURDIS" | "QURAN",
    SKI = "ski" | "SKI",

    // Sciences
    Biologi = "biologi" | "BIO",
    Fisika = "fisika" | "FIS",
    Kimia = "kimia" | "KIM",
    IPA = "ipa" | "IPA",
    IPAS = "ipas" | "IPAS",
    Informatika = "informatika" | "INF",

    // Mathematics
    Matematika = "matematika" | "MTK",
    MatematikaPeminatan = "matematika-peminatan" | "MTKP",

    // Social sciences
    IPS = "ips" | "IPS",
    Geografi = "geografi" | "GEO",
    Ekonomi = "ekonomi" | "EK" | "EKO",
    Antropologi = "antropologi" | "ANT" | "ANTRO",
    Sosiologi = "sosiologi" | "SOS",
    Sejarah = "sejarah" | "SEJ" | "SEJARAH",
    SejarahIndonesia = "sejarah-indonesia" | "S.IND",

    // Arts
    SeniBudaya = "seni-budaya" | "SB" | "SENBUD" | "SENIBUDAYA",
    SeniMusik = "seni-musik" | "SM" | "SENMUS" | "SENIMUSIK",
    SeniRupa = "seni-rupa" | "SR" | "SENRUP" | "SENIRUPA",

    // Physical education
    Penjas = "penjas" | "PJOK" | "PENJAS",

    // Vocational and practical subjects
    PKWU = "pkwu" | "PKWU",
    Prakarya = "prakarya" | "PRA",
    PendidikanPancasila = "pendidikan-pancasila" | "PPKN" | "PP",

    // Miscellaneous
    BK = "bk" | "BK",
    BTQ = "btq" | "BTQ"
}
