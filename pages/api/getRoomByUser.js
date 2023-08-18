import { PrismaClient } from "@prisma/client";

export default async function Handler(req,res){
    const prisma =new PrismaClient()
    const room = await prisma.room.findMany({
        where:{
            member:{
                some:{
                    id:req.body.id,
                }
            }
        },
        orderBy:{
            chats:{
                _count:"desc"
            }
        }
        ,
        include:{
            member:true,
            chats:{
                orderBy:{
                    id:"asc"
                }
            },
        },

    })
    if(room){
        prisma.$disconnect()
        res.status(201).json(room)
    }else{
        prisma.$disconnect()
        res.status(401)
    }
} 