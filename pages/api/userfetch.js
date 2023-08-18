import { PrismaClient } from "@prisma/client";
import axios from "axios";



export default async function handler(req,res){
    if(req.method === "POST"){
        const prisma = new PrismaClient()
            const user = await prisma.user.findUnique({
                where:{
                    username:req.body.username,
                    password:req.body.password
                },
                include:{
                    room:{
                        include:{
                            member:true,
                            chats:true
                        }
                    }
                }
            }).finally(e => prisma.$disconnect())
 
            if(user){
                res.status(200).json(user)
            }else{
                res.status(400).json({error:"no user with that cridantail"})
            }
    }
}