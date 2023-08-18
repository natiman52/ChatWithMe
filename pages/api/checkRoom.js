import { PrismaClient } from "@prisma/client";
import axios from "axios";

export default async function handler(req,res){
        const prisma = new PrismaClient()
        const {buddy,user} =req.query
        const room = await prisma.room.findMany({
                where:{
                    member:{
                        every:{
                            id:{in: [parseInt(buddy) ,parseInt(user)]}
                        }
                    }
                },
                include:{
                    member:true,
                    chats:{
                        orderBy:[
                            {
                                id:"asc"
                            }
                        ],
                        include:{
                            sender:true,
                            reciver:true,
                        }
                    }
                }
            })
 
            if(room){
                prisma.$disconnect()
                res.status(200).json(room)
            }else{
                prisma.$disconnect()
                res.status(400).json({error:"sorry something went wrong"})
            }
}