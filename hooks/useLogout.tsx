import { logoutUser } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./useStore";



export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  return { logout };
};
