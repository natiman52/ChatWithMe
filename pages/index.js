import axios from "axios"
import { useEffect,useState } from "react"
import { io } from "socket.io-client"
import UserRecent from "../components/UserRecent";
import ChatBoard from "../components/ChatBoard";
import Navbar from "../components/Navbar";
import React from "react";
import Login from "../components/Login";
import Loader from "../components/Loader";
import SignUp from "../components/SignUp";
import Head from "next/head";
let socket;

export default function Home() {
  const [Toggle,setToggle] =useState(true)
  const [Partner,setPartner] =React.useState()
  const [User,setUser] =React.useState(false)
  const [slide,setSlide] = useState(true)
  const [New,setNew] = React.useState()
  const [begin,setBegin] =React.useState(false)
  React.useEffect(() => {
    const test =async () => {
      await axios('/api/socket')
    }
    test()
    setUser(JSON.parse(window.sessionStorage.getItem('user')))
  },[])
const UpdateState = (value) => {
  setUser(value)
}
const setChat = (room) => {
  setBegin(true)
  setPartner(room.id)
}
const setNewChat = (props) =>{
  setBegin(true)
  setNew(props.user)
}
  return (
<>
<Head>
    <title>ChatWithMe</title>
    <link rel="icon" href="/image/chats.png" />
</Head>
{
  User === false
  ?
  <Loader />
  :
  (
    User?
    (
    <div>
      <Navbar setuser={setUser}/>
      <div className="app__mainContainer">
      <div className='app__side'>
      <UserRecent  setNewChat={setNewChat} setChat={setChat} user={User}/>
      </div>
      <div className="app__main">
        {
          begin
          ? (
            <ChatBoard new={New} partner={Partner} user={User}/>
          ):(
            <div className="flex--center bg-myown" >
            <div className="chatboard__initiat">
                <p>😄</p>
                <h1>Find your friends and start chatting</h1>
            </div>
        </div>
          )
        }
      </div>
    </div>
      </div>
    )
    :
    <>
    {
      Toggle 
      ?
      <Login Toggle={Toggle} setToggle={setToggle} setuser={UpdateState}/>
      :
      <SignUp setToggle={setToggle} setuser={UpdateState}/>
    }
    </>
  )
}
</>


  )
}

