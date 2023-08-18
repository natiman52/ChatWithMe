import { data } from "autoprefixer"
import axios from "axios"
import { useState,useEffect } from "react"
import {BsFillSendFill} from "react-icons/bs"
import {io} from "socket.io-client"
import { Circles } from "react-loader-spinner"
let socket;
export default function(props){
    const [Load,setLoad] = useState(false)
    const [Room,setRoom] = useState({})
    const [Message,setMessage] = useState("")
    const [New,setNew] =useState(false)
    useEffect(()=>{
        const getRoom =async (id) => {
            await axios.post("/api/getRoom/",{id}).then(e => {
                setLoad(true)
                setRoom(e.data)
            })
        }
        const checkRoom =async (buddy) =>{
            setLoad(false)
            await axios({url:"/api/checkRoom/",method:"GET",params:{buddy:buddy.id,user:props.user.id}}).then(e => {
                if(e.data.length < 1){
                    setNew(buddy)
                    setLoad(true)
                }else{
                    setNew(false)
                    getRoom(e.data[0].id)
                }
            })
        }
        if(props?.new){
            checkRoom(props?.new)
        }else{
            setNew(false)
            setLoad(false)
            getRoom(props?.partner)
        }
            if(socket) {
                socket.disconnect()
                }
            socket = io()
            console.log(socket.id)
            socket.on(`Room ${props.partner}`,(room) => {
                console.log(room)
                setRoom(room)
            })
    },[props.partner,props.new])
    const sendMessage =() => {
        if(!New) {
            let Buddy =Room?.member?.filter(item => item.id != props.user.id && item.id )[0]
            socket.emit('clientSideMsg',{
                msg:Message,
                roomId:props.partner,
                senderId:props.user.id,
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
            console.log("test")
            socket.emit('clientSideMsg',{
                msg:Message,
                senderId:props.user.id,
                reciverId:New.id
            })
            setRoom(prev => {
                return{
                    chats:[{reciver:New,sender:props.user,msg:Message}],
                    member:[
                        props.user,
                        New
                    ]
                }
            })
        }
        setMessage("")
    }
        if(!Load) {
            return <div className="app__chatBoard flex--center"><Circles  height="80" width="80" color="blue"/></div>
        }
        return (
                <>
                <div className="app__chatBoard">
                    <div className="app__chatboard-msgContainer">
                        {
                        !New 
                        ?
                            Room?.chats?.map(chat => {
                                if(chat.sender.id == props.user.id){
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
                <input onKeyDown={e => { 
                    if(e.code == "Enter"){
                        sendMessage()
                    }
                }} onChange={e => setMessage(e.target.value)} type="text" placeholder="hi" value={Message}/>
                <button onClick={sendMessage}><BsFillSendFill/></button>
               </div>
                </div>
                </>
        )

}