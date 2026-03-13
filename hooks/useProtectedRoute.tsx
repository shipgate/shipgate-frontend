import { logoutUser } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useStore";

type Role = "Customer" | "SuperAdmin" | "Courier" | "Admin" | "OperationsStaff";

export const useProtectedRoute = (role: Role) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== role) {
      dispatch(logoutUser());
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, token, user, role]);

  return isAuthenticated;
};
