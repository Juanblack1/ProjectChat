import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Onboarding() {
  const [{userInfo}] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    router.replace(userInfo?.id ? "/" : "/login");
  }, [router, userInfo?.id]);

  return <div className="h-screen w-screen bg-panel-header-background text-white flex items-center justify-center">Redirecionando...</div>;
}

export default Onboarding;
