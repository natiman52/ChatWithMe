import { useState } from "react"
import { motion } from "framer-motion"
import { Circles } from "react-loader-spinner"
import axios from "axios"
export default function SignUp(props){
    const [misMatchError,setMisMatchError] =useState(false)
    const [SignUpForm,setSignUpForm] =useState({username:"",password1:"",password2:""})
    const [SignUpEror,setSignUpError] =useState(false)
    const [Loading ,setLoading] =useState(false)
    const SignUp = async () => {
        if(SignUpForm.username != "" && SignUpForm.password1 != ""){
            if(SignUpForm.password1 === SignUpForm.password2){
                setLoading(true)
                setMisMatchError(false)
                await axios.post('/api/createuser',{username:SignUpForm.username,password:SignUpForm.password1}).then(e => {
                    setLoading(false)
                    props.setuser(e.data)
                    sessionStorage.setItem("user",JSON.stringify(e.data))
                }).catch(e => {
                    setLoading(false)
                    setSignUpError(true)
                })
            }else{
                setMisMatchError(true)
            }
        }
    }
    const EditSignUpForm = (e,type) => {
        switch(type) {
            case "username":
                setSignUpForm(prevData =>{
                    return {username:e.target.value,password1:prevData.password1,password2:prevData.password2}
                })
            case "password1":
                setSignUpForm(prevData => {
                    return {username:prevData.username,password1:e.target.value,password2:prevData.password2}
                })
            case "password2":
                setSignUpForm(prevData => {
                    return {username:prevData.username,password1:prevData.password1,password2:e.target.value}
                })   
        }
    }
    return (
        <motion.div
        animate={{y:[-100,0],opacity:[0,1]}}
         className="Login__centeralwrapper">
            <div className="LoginForm__container">
                <div className=" pb-4 flex justify-center border-b-2 border-solid border-gray-300">
                <h1 className="text-4xl">Sign Up</h1>
                </div>
                {
            SignUpEror && (
        <motion.div animate={{opacity:[0,1],animationDelay:0.4}} className="py-2 px-5 mt-1 rounded bg-red-200">
                <p className="text-red-600 font-semibold text-lg">Sorry UserName already taken</p>
        </motion.div>
            )
        }
                <div className="mt-5 mb-8 mt-8">
                <label htmlFor="username" className=" text-xl  font-bold mb-3">UserName</label>
                <input onChange={e => EditSignUpForm(e,"username")} id="username" placeholder="User Name" className={` text-gray-700 rounded bg-gray-100 w-full focus:outline-none px-3 py-2 `} type="text" />
                </div>
                <div className="mt-9">
                <label htmlFor="password1" className="text-xl font-bold mb-3">Password</label>
                <input onChange={e => EditSignUpForm(e,'password1')} id="password1" placeholder="Password" className={misMatchError ?`border-2 border-solid border-red-600 text-gray-700 rounded bg-gray-100 w-full focus:outline-none px-3 py-2 `:`text-gray-700 rounded bg-gray-100 w-full focus:outline-none px-3 py-2 `} type="password" />

                </div>
                <div className="my-9">
                    <label className="text-xl font-bold mb-3" htmlFor="password2">Confirm Password</label>
                    <input onChange={e => EditSignUpForm(e,"password2")} id="password2" placeholder="Confirm Password" className={misMatchError ?`border-2 border-solid border-red-600 text-gray-700 rounded bg-gray-100 w-full focus:outline-none px-3 py-2 `:`text-gray-700 rounded bg-gray-100 w-full focus:outline-none px-3 py-2 `} type="password" />
                    {
                        misMatchError && (
                            <p className="px-3 py-2 text-sm font-extrabold text-red-600">Passwords did not match</p>
                        )
                    }
                </div>
                
    <div className="flex items-center justify-center">
            {
                Loading?(
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            <Circles color="white" height="20" width="20"/>
            </button>
                )
                :(
                <button onClick={SignUp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Sign Up
                </button>
                )

            }
    </div>
<div className="flex items-center justify-center my-5">
    <p className="mr-2 text-lg font-thin">Does have an account? </p>
    <p className="text-lg font-semibold hover:text-blue-500 cursor-pointer" onClick={(e) => props.setToggle(prev => !prev) }>Sign In</p>
</div>
            </div>
        </motion.div>
    )
}