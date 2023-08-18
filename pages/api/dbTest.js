import { PrismaClient } from "@prisma/client";

export default async function handler(req,res){
    const prisma = new PrismaClient()
    try {
        const room =await prisma.room.findMany().finally(e => prisma.$disconnect())
        res.json(room)
    } catch(error) {
        if(error.code === "P2002"){
            res.status(406).json({error:error.meta.target})
        }
    }
    }