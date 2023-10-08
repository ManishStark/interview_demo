import { Outlet } from "react-router-dom"
import { Navbar } from "./components"

const App = () => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="w-11/12 mx-auto ">
        <Navbar />
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App