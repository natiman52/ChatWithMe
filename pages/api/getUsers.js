import { PrismaClient } from "@prisma/client";
export default async function Handler(req,res){
    const prisma =new PrismaClient()
    const {username} = req.query
    const users = await prisma.user.findMany({
        where:{
          username:{
            contains:username
          }
        }
    })
    prisma.$disconnect()
    res.status(200).json(users)

}