// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

import { createRoot } from "react-dom/client";
import App from "./App";
import ActivityPage from "./pages/ActivityPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from "./pages/SignUpPage";
import { AuthContextProvider } from "./lib/AuthContext";

// if (name) { 
//   createRoot(document.getElementById("root")).render(<h1>Hello {name}</h1>);
// } else {
//   createRoot(document.getElementById("root")).render(<h1>Hello World</h1>); 
// }
createRoot(document.getElementById("root"))
    .render(
         <>
            {/* <ActivityPage /> */}
            <App></App>
            
        </>
    );