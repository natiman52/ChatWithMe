import { Circles } from "react-loader-spinner"
export default function Loader(){
    return (
        <>
        <div className="Login__centeralwrapper">
        <Circles
  height="80"
  width="80"
  color="blue"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>
        </div>
        </>
    )
}