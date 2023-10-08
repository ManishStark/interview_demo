import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { Home, Favourite } from "./pages"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "favourite",
                element: <Favourite />
            }
        ]
    }
])
export default router;