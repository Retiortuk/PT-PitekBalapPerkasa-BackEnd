import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

const AdminRoute = ({ children }) => {
    const {user} = useAuth();

    // 1. buat kalo tidak ada user belum login lempar ke halaman login
    if(!user) {
        return <Navigate to="/login" />
    }

    // 2. kalo ada user tapi jenis akun nya bukan admin
    if (user.jenisAkun!== 'Admin') {
        return <Navigate to="/dashboard"  />
    }

    return children;
}

export default AdminRoute;