import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSlice } from "../redux/slice";

export const ProtectedRoute = () => {
     const { token } = useAppSlice();
     const location = useLocation();

     if (!token || token === null) {
          return <Navigate to="/sign-in" state={{ from: location }} replace />;
     }
     return <Outlet />;
};
