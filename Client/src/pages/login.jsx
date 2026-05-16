import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_USER } from "@/utils/DemoData";
import { firebaseAuth, isFirebaseConfigured } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function login() {
  const router = useRouter()

  const [{userInfo, newUser}, dispatch] = useStateProvider();

  useEffect(() => {
    if(userInfo?.id && !newUser) router.push("/")
  }, [userInfo, newUser])

  const handleLogin = async () => {
    if (IS_DEMO_MODE) {
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: DEMO_USER,
      });
      dispatch({
        type: reducerCases.SET_NEW_USER,
        newUser: false,
      });
      router.push("/");
      return;
    }

    if (!isFirebaseConfigured) {
      console.error("Firebase config is missing. Set NEXT_PUBLIC_FIREBASE_* variables or enable demo mode.");
      return;
    }

    const provider = new GoogleAuthProvider()
    const {user:{displayName:name,email, photoURL:profileImage}} = await signInWithPopup(firebaseAuth, provider);
    try {
      if(email){
        const {data} = await axios.post(CHECK_USER_ROUTE, {email});

        if(!data.status){
          dispatch({
            type:reducerCases.SET_NEW_USER,
            newUser:true,
          })
          dispatch({
            type:reducerCases.SET_USER_INFO,
            userInfo:{
              name,
              email,
              profileImage,
              status:"",
            }
          })
          router.push("/onboarding")
        }
        else {
          const {id,name,email,profilePicture:profileImage, status} = data.data;
          dispatch({
            type:reducerCases.SET_USER_INFO,
            userInfo:{
              id, name, email, profileImage, status
            }
          })
          router.push("/")
        }
      }
    } catch(err){
      console.log(err)
    }
  };
  return (
  <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
    <div className="flex items-center justify-center gap-2 text-white">
      <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300} />
      <span className="text-7xl">Whatsapp</span>
    </div>
    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={handleLogin}>
      <FcGoogle className="text-4xl"/>
        <span className="text-white text-2l">{IS_DEMO_MODE ? "Entrar no demo" : "Login with Google"}</span>
    </button>
  </div>
);
}

export default login;
