import { Navigate, Outlet } from "react-router-dom"
import { Login } from "../pages/Login"
import { getJWT } from "./local_storage/local_storage"



export const ProtectedRoutes = () => {
  return getJWT()?<Outlet/>:<Navigate to="/login" replace={true} />
}

export const RedirectFromLogin = () => {
    return getJWT()?<Navigate to="/" replace={true} />:<Login/>
}
