import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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