import { toast } from "react-toastify";

export const errorToast = (message: string) => toast(message);
export const successToast = (message: string) =>
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
  });