import './index.css';
import * as React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './routes/login';
import MainRoute from './routes/mainRoute';
import Error from './routes/error';
import Serials from './routes/serials';
import Serial from './routes/serial';
import Multitask from "./routes/multitask"


const router = createBrowserRouter([
    {
        path: "/",
        element: < MainRoute />,
        errorElement: <Error />,
        children: [
            {
                path: "serials/",
                element: <Serials />,
                index: true,
            },
            {
                path: "serials/:serial",
                element: <Serial />
            },
            {
                path: "multitask/",
                element: <Multitask />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
]);


function App() {
    return <RouterProvider router={router} />;
}

export default App;
