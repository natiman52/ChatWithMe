import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";


export default async function SocketHandler(req,res){
    if(res.socket.server.io){
        console.log("already set up")
    }else{
        const prisma = new PrismaClient()
        console.log("setting up server")
        const io = new Server(res.socket.server)
        res.socket.server.io = io
        io.on("connection",socket => {
            socket.on('clientSideMsg',async (props) => {
                const updatedRoom = await prisma.room.upsert({
                    where:{
                        id:props.roomId || -1
                    },
                    create:{
                        member:{
                            connect:[
                                {
                                    id:props.senderId
                                },
                                {
                                    id:props.reciverId
                                }
                            ]
                        },
                        chats:{
                            create:{
                                    sender:{
                                        connect:{
                                            id:props.senderId,
                                        }
                                    },
                                    reciver:{
                                        connect:{
                                            id:props.reciverId
                                        }
                                    },
                                    msg:props.msg
                                    
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
                    },
                    update:{
                        chats:{
                            create:[
                                {
                                    sender:{
                                        connect:{
                                            id:props.senderId
                                        }
                                    },
                                    reciver:{
                                        connect:{
                                            id:props.reciverId
                                        }
                                    },
                                    msg:props.msg
                                }
                            ]
                        }
                    }
                }).finally(() => prisma.$disconnect())

                console.log(props.reciverId)
                io.emit(`User Refresh`,updatedRoom)
                socket.broadcast.emit(`Room ${props.roomId}`,updatedRoom)
            })
        })
    }
    res.end()
}