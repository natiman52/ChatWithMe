import {useState} from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Circles } from "react-loader-spinner"
import SignUp from "../SignUp"
export default function Login(props){
    const [Loading,setLoading] = useState(false)
    const [username,setUsername] =useState()
    const [password,setPassword] =useState()
    const [ErrorLogin,setErrorLogin] =useState(false)

    const signIn =  async () => {
        if (username && password){
            setLoading(true)
            await axios.post('https://chat-with-me-five.vercel.app/api/userfetch',{username,password}).then(e => {
                props.setuser(e.data)
                setLoading(false)
                sessionStorage.setItem('user',JSON.stringify(e.data))
            }).catch(e => {
                setErrorLogin(true)
                setLoading(false)
            })
        }
    }
    return (

        <>
        <motion.div 
        animate={{y:[-100,0],opacity:[0,1],animationDelay:0.4}}
        className="Login__centeralwrapper">
            <div className="LoginForm__container">
                <div className=" flex justify-center border-b-2 border-solid border-gray-300 p-3">
                <h1 className="text-4xl">Login</h1>
                </div>
                {
                    ErrorLogin && (
                <motion.div animate={{opacity:[0,1],animationDelay:0.4}} className="py-2 px-5 mt-1 rounded bg-red-200">
                        <p className="text-red-600 font-semibold text-lg">Sorry wrong Password or Username</p>
                </motion.div>
                    )
                }
    <div className="mb-8 mt-9">
      <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="username">
        UserName
      </label>
      <input onChange={e => setUsername(e.target.value)} className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="User Name"/>
    </div>
    <div className="mt-9 mb-9">
      <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input onChange={e => setPassword(e.target.value)} className=" bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="****"/>
    </div>
    <div className="flex items-center justify-center">
      {
          Loading
                        ?
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        <Circles color="white" height="20" width="20"/>
      </button>
                        :
        <button onClick={signIn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Sign In
      </button>

                    }
    </div>
    <div className="flex items-center justify-center my-5">
        <p className="mr-2 text-lg font-thin">Does not have an account? </p>
        <p className="text-lg font-semibold hover:text-blue-500 cursor-pointer" onClick={(e) => props.setToggle(prev => !prev) }>Sign up</p>
    </div>
            </div>
        </motion.div>
        </>
    )
}