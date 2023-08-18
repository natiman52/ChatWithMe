import Link from "next/link"
import {useEffect,useState} from "react"
import axios from "axios"
import { Circles } from "react-loader-spinner"
import { io } from "socket.io-client";
let socket;
export default function UserRecent(props) {
    const [Room,setRoom] = useState(false)
    const [Loading,setLoading] =useState(true)
    const [Users ,setUsers] = useState()
    const [Search,setSearch] =useState()
    const setSearchValue = async (e) =>{
        setSearch(e.target.value)
        if(e.target.value){
            setLoading(true)
            await axios({
                url:"/api/getUsers",
                method:"GET",
                params:{
                    username:e.target.value,
                }
            }).then(e =>{
                setUsers(e.data)
                setLoading(false)
            }).catch(e =>{
                console.log("error")
            })
        }else {
            setUsers(undefined)
        }
    }
    useEffect( () =>{
        let boolean = true
        const apiCall = async   () =>{
            setLoading(true)
            await axios.post("/api/getRoomByUser",{id:props.user.id}).then(e =>{
                setRoom(e.data)
                setLoading(false)
            }).catch(e =>{
                setLoading(false)
            })
        }
           apiCall()
        if(socket){
            socket.disconnect()
        }
        socket =io()
        console.log(props.user.id)
        socket.on(`User Refresh`,(updatedRoom) =>{
            console.log("User Test")
            setRoom(prev => {
                let rooms = prev?.map(e => {
                    if (e?.id == updatedRoom.id){
                        return;
                    }else{
                        return e
                    }
                })
                return [ updatedRoom, ...rooms ]
            })
        })
        return () =>{
            boolean = false
        }
    },[])
    return (
        <div className="w-full">
        <div className="userRecent__search-container">
            <label htmlFor="search">
        <input id="search" onChange={setSearchValue} type="text" placeholder="Search"/>
            </label>
        </div>
        <>
        <div className="userRecent-usercard-container">
            {   !Loading 
            ?
                !Search 
                ?
                (
                    Room?.map(item => (
                        item?.member?.map(member => {
                            if(member.id != props.user.id){
                                return (
                                    <div key={member.id} onClick={e => props.setChat(item)} className="userRecent-usercard-item">
                                        <h1 className="app__constant-username capitalize">{member.username}</h1>
                                        {item.chats.length >= 1 
                                        ?
                                        <p> {item.chats[item.chats.length - 1].msg }</p>
                                        :
                                        <></>
                                        }
                                        </div>
        
                                    )
                            }
                        })
                    ))
                )
                :
                (
                <>
                {
                    Users.length < 1 
                    ?
                    <div className="flex justify-center">
                        <p className="text-lg font-semibold">No User with That Name</p>
                    </div>
                    :
                    Users?.map(item => (
                    <div key={item.id} onClick={e => props.setNewChat({user:item}) } className=" userRecent-usercard-item">
                    <h1 className="app__constant-username capitalize">{item.username}</h1>
                    </div>
                    ))
                }
                </>
                )
                :
                    <div className="flex justify-center items-center"><Circles color="blue" height="40" width="40" /></div>
            }
        </div>
        <div className="userRecent-usercard-containerMb">
        {   !Loading 
        ?
            !Search
            ?
           Room?.map(item => (
                    item?.member?.map(member => {
                        if(member.id != props.user.id){
                            return (
                                    <Link key={member.id} href={`/chatBoard/${item.id}`}>
                                        <div className="userRecent-usercard-item">
                                    <h1 className="app__constant-username capitalize">{member.username}</h1>
                                    {item.chats.length > 0
                                    ?
                                    <p>{item?.chats[item.chats.length - 1].msg}</p>
                                    :
                                    <></>
                                    }
                                        </div>
                                    </Link> 
                            )
                        }
                    })
                ))      
                :
                <>
                        {
                    Users.length < 1 
                    ?
                    <div className="flex justify-center">
                        <p className="text-lg font-semibold">No User with That Name</p>
                    </div>
                    :
                    Users?.map(item => (
                        <Link key={item.id} href={`/chatBoard/${item.id}?new=true&username=${item.username}`}>
                    <div key={item.id} className="userRecent-usercard-item">
                    <h1 className="app__constant-username capitalize">{item.username}</h1>
                    </div>
                        </Link>
                    ))
                }
                </>
                :
                <div className="flex justify-center items-center py-5">
                    <Circles color="blue" height="40" width="40" />
                    </div>
            }
        </div>
        </>
    </div>
    )
}