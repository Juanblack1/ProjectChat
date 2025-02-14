import { PrismaClient } from "@prisma/client";

let prismaInstance = null;

function getPrismaInstace() {
    if(!prismaInstance){
        prismaInstance = new PrismaClient()
    }
    return prismaInstance
}


export default getPrismaInstace;