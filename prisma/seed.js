const scrypt = require("../util/scrypt");
import { PrismaClient } from '@prisma/client';
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
        where: {name: "mumi"},
        update: {},
        create: {
            name: "mumi",
            password: scrypt.calcHash("co", salt),
            salt,

        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
