import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { clearDemoData, endDemoSession } from "@/utils/DemoData";
import { supabase } from "@/utils/SupabaseConfig";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Logout() {
  const [, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      if (IS_DEMO_MODE) {
        clearDemoData();
        endDemoSession();
      } else if (supabase) {
        await supabase.auth.signOut();
      }

      dispatch({type: reducerCases.SET_USER_INFO, userInfo: undefined});
      dispatch({type: reducerCases.SET_MESSAGES, messages: []});
      router.replace("/login");
    };

    logout();
  }, [dispatch, router]);

  return <div className="h-screen w-screen bg-panel-header-background text-white flex items-center justify-center">Saindo...</div>;
}

export default Logout;
