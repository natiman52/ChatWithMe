import React from 'react'
import { useRouter } from 'next/router'
import {BsFillSendFill} from "react-icons/bs"
import {IoMdArrowRoundBack} from "react-icons/io"
import { Circles } from "react-loader-spinner"
import axios from "axios"
import { useState,useEffect } from 'react'
import { io } from 'socket.io-client'
import { route } from 'next/dist/server/router'
let user;
let socket;
const HandleRequest = () => {
    const [Load,setLoad] = useState(false)
    const [Room,setRoom] = useState({})
    const router = useRouter()
    const [Message,setMessage] = useState('')
    const [New,setNew] =useState(false)
    useEffect(()=>{  
        if(socket) {
            socket.disconnect()
        }
        socket = io()    
        let New = router.query.new
        user = JSON.parse(window.sessionStorage.getItem('user'))
        let buddy = parseInt(router.query.slug)
        let getRoomBoolean = true
        const getRoom = async (id) => {
            console.log(`Room ${id}`)
            await axios.post("/api/getRoom/",{id}).then(e => {
                if(getRoomBoolean){
                    setLoad(true)
                    setRoom(e.data)
                }
            })     
        }
        const checkRoom =async (buddy) =>{
            setLoad(false)
            await axios({url:"/api/checkRoom/",method:"GET",params:{buddy:buddy,user:user.id}}).then(e => {
                if(e.data.length < 1){
                    setNew({id:buddy,username:router.query?.username})
                    setLoad(true)
                }else{
                    setNew(false)
                    getRoom(e.data[0].id)
                    socket.on(`Room ${e.data[0].id}`,(room) => {
                        console.log(room)
                        setRoom(room)
                    })
                }
            })
        }
    if(New){
        checkRoom(buddy)
    }else{
        setNew(false)
        setLoad(false)
        getRoom(buddy)
        socket.on(`Room ${ buddy }`,(room) => {
            setRoom(room)
        })
    }
        return () =>{
            getRoomBoolean = false
        }
    },[])

    const sendMessage =() => {
        if(!New) {
            console.log("not new")
            let Buddy =Room?.member?.filter(item => item.id != props.user.id && item.id )[0]
            socket.emit('clientSideMsg',{
                msg:Message,
                roomId:parseInt(router.query.slug),
                senderId:user.id,
                reciverId:Buddy.id
            })
            setRoom(prev => {
                return{
                    chats:[...prev.chats,{reciver:Buddy,sender:props.user,msg:Message}],
                    member:prev.member
                }
            })
        }else{
            setNew(false)
            console.log(socket)
            socket.emit('clientSideMsg',{
                msg:Message,
                senderId:user.id,
                reciverId:New.id
            })
            setRoom(prev => {
                return{
                    chats:[{reciver:New,sender:user,msg:Message}],
                    member:[
                        user,
                        New
                    ]
                }
            })
        }
        setMessage("")
    }
    if(!Load) {
        return(
        <div className="app__chatBoard ">
            <div className='fixed top-0 chatBoard-profile flex items-center'>
        <button onClick={router.back} className=''>
        <IoMdArrowRoundBack/>
        </button>
        <div className='px-5'>
            <h1 className='capitalize'>{Room?.member?.filter(item => item.id != user.id && item )[0].username || router.query?.username}</h1>
        </div>
            </div>
            <div className='w-full h-full flex--center'>
            <Circles  height="80" width="80" color="blue"/>
            </div>
            </div>
        ) 
    }
    return (
            <>
            <div className="app__chatBoard">
            <div className='fixed top-0 chatBoard-profile flex items-center'>
        <button onClick={router.back}>
        <IoMdArrowRoundBack/>
        </button>
        <div className='px-5'>
            <h1 className='capitalize'>{Room?.member?.filter(item => item.id != user.id && item )[0].username || router.query?.username}</h1>
        </div>
            </div>
                <div className="app__chatboard-msgContainer">
                    {
                    !New 
                    ?
                        Room?.chats?.map(chat => {
                            if(chat.sender.id == user.id){
                                return (
            <div key={chat.id} className=" app__chatboard-msgItem-User">
                <div className="flex__justify-between">
                <p>{chat.sender.username}</p>
                </div>
    
                <div className="msg-wrapper">
            <p>{chat.msg}</p>
                </div>
                <div className="flex--end">
                <p>{chat.reciver.username}</p>
                </div>
            </div>
                                )
                            }else{
                                return (
                                <div key={chat.id} className=" app__chatboard-msgItem-nonUser">
                                    <div className="flex__justify-between">
                                    <p>{chat.sender.username}</p>
                                    </div>
                        
                                    <div className="msg-wrapper">
                                <p>{chat.msg}</p>
                                    </div>
                                </div>
                                )
                            }
                        })
                        :
                        (
                            <div className="flex--center bg-myown" >
                                <div className="chatboard__initiat">
                                    <p>😄</p>
                                    <h1>Find your friends and start chatting</h1>
                                </div>
                            </div>
                        )
                    }


                </div>
           <div className="app_chatBoard-msgInput">
            <input onChange={e => setMessage(e.target.value)} type="text" value={Message} placeholder="hello"/>
            <button onClick={sendMessage}><BsFillSendFill/></button>
           </div>
            </div>
            </>
    )

}

export default HandleRequest
