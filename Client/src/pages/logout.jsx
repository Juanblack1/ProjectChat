import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { clearDemoData } from "@/utils/DemoData";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Logout() {
  const [, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      clearDemoData();

      if (firebaseAuth) {
        await signOut(firebaseAuth);
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
