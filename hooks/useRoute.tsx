import { useRouter } from "next/navigation";

export function useAppRouter() {
  const router = useRouter();
  return router;
}