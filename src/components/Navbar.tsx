import { logo } from "../assets"
import { ToastContainer } from 'react-toastify';
import { Link } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
const Navbar = () => {
    return (
        <>
            <div className="py-4 flex justify-between items-center">
                <Link to={"/"}>  <img src={logo} alt="Logo" className="h-12 w-12" /></Link>

                <Link to={"/favourite"} className="bg-blue-500 rounded-full px-4 py-1.5 text-white">Favourites</Link>
            </div>
            <ToastContainer /></>

    )
}

export default Navbar