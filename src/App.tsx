import {useLocation, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import PrivateRoute from "./app/routing/PrivateRoute.tsx";
import Kanban from "./pages/Kanban";
import ResetPassword from "./pages/ResetPassword.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import AnimatedStripes from "./components/ui/effects/AnimatedStripes.tsx";
import CheckEmail from "./pages/CheckEmail.tsx";

function App() {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div className="relative min-h-screen overflow-hidden">

            {isHomePage && (<AnimatedStripes/>)}

            <div className="relative z-10">
                <Layout>
                    <Routes>
                        {/* PUBLIC ROUTES */}
                        <Route index element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/check-email" element={<CheckEmail/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>

                        {/* PRIVATE ROUTES (PrivateRoute + Outlet) */}
                        <Route element={<PrivateRoute/>}>
                            <Route path="/projects" element={<Projects/>}/>
                            <Route path="/project/:projectId" element={<Kanban/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                        </Route>
                    </Routes>
                </Layout>
            </div>
        </div>
    );
}

export default App;