import { PrismaClient } from "@prisma/client";
import axios from "axios";

export default async function handler(req,res){
    if(req.method === "POST"){
        const prisma = new PrismaClient()
        try{
            const user = await prisma.user.create({
                data:{
                    username:req.body.username,
                    password:req.body.password,
                },
                include:{
                    room:{
                        include:{
                            member:true,
                            chats:true
                        }
                    },
                },
            }).finally(e => prisma.$disconnect())
            if(user){
                res.status(200).json(user)
            }else{
                res.status(406).json({error:"no user with that cridantail"})
            }
        } catch(error){
            res.status(406).json({error:error.meta.target})        
        }
    }
}