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
            email: "hanako@flower",
            age: 28
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
            email: "sachiko@happy",
            age: 17
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
            email: "jiro@change",
            age: 6
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
            email: "mami@mumemo",
            age: 41
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
            email: "ichiro@base.ball",
            age: 52
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
            email: "kumi@co",
            age: 63
        }
    });
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

