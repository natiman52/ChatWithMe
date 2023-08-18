import { PrismaClient } from "@prisma/client";
import axios from "axios";

export default async function handler(req,res){
    if(req.method === "POST"){
        const prisma = new PrismaClient()
            const user = await prisma.room.findUnique({
                where:{
                    id:req.body.id,
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
 
            if(user){
                prisma.$disconnect()
                res.status(200).json(user)
            }else{
                prisma.$disconnect()
                res.status(400).json({error:"sorry something went wrong"})
            }
    }
}