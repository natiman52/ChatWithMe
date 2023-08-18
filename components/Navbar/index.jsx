import {RiLogoutBoxLine} from "react-icons/ri"

export default function Navbar(props){
    const LogOut = () =>    {
        window.sessionStorage.clear()
    }
    return (
        <>
        <div className="chatBoard-profile flex justify-between items-center">
        <div className="flex">
<h1 className="text-2xl font-semibold">ChatWithMe</h1>
        </div>
        <div>
            <p onClick={LogOut} className="px-2 py-2 hover:bg-gray-500 rounded-full" title="Log Out">
        <RiLogoutBoxLine/>
            </p>
        </div>
        </div>
        </>
    )
}