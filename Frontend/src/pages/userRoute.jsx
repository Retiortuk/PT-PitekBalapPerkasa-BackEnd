import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const userRoute = ({ children }) => {
    const user = { useAuth }

    if (!user) {
        return <Navigate to="/login"  />
    }
    if (user.jenisAkun == 'Admin') {
        return <Navigate to="/admin" /> 
    }

    return children
}

export default userRoute;