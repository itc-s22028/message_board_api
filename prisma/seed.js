const {PrismaClient} = require("@prisma/client");
const scrypt = require("../util/scrypt");
const prisma = new PrismaClient();
const main = async () => {
    let salt;
    // 1人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "taro"},
        update: {},
        create: {
            name: "taro",
            password: scrypt.calcHash("yamada", salt),
            salt,
        }
    });
    // 2人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "hanako"},
        update: {},
        create: {
            name: "hanako",
            password: scrypt.calcHash("flower", salt),
            salt,
        }
    });
    // 3人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "sachiko"},
        update: {},
        create: {
            name: "sachiko",
            password: scrypt.calcHash("happy", salt),
            salt,
        }
    });
    // 4人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "jiro"},
        update: {},
        create: {
            name: "jiro",
            password: scrypt.calcHash("change", salt),
            salt,
        }
    });
    // 5人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "mami"},
        update: {},
        create: {
            name: "mami",
            password: scrypt.calcHash("mumemo", salt),
            salt,
        }
    });
    // 6人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "ichiro"},
        update: {},
        create: {
            name: "ichiro",
            password: scrypt.calcHash("baseball", salt),
            salt,
        }
    });
    // 7人目
    salt = scrypt.generateSalt();
    await prisma.user.upsert({
        where: {name: "kumi"},
        update: {},
        create: {
            name: "kumi",
            password: scrypt.calcHash("co", salt),
            salt,
        }
    });
};

main()