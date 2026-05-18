import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { hasDemoSession, startDemoSession } from "@/utils/DemoData";
import { firebaseAuth, isFirebaseConfigured } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsShieldLockFill, BsWindowSidebar } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

function login() {
  const router = useRouter()

  const [{userInfo, newUser}, dispatch] = useStateProvider();

  useEffect(() => {
    if (IS_DEMO_MODE) {
      if (hasDemoSession()) {
        router.replace("/");
      }
      return;
    }

    if(userInfo?.id && !newUser) router.push("/")
  }, [dispatch, router, userInfo, newUser])

  const handleLogin = async () => {
    if (IS_DEMO_MODE) {
      const demoProfile = startDemoSession();
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: demoProfile,
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
  <div className="min-h-screen w-screen bg-[#0b141a] flex items-center justify-center px-6 py-8 md:py-0 relative overflow-auto md:overflow-hidden">
    <div className="absolute inset-0 bg-chat-background opacity-[0.04]" />
    <div className="absolute -top-24 right-24 h-[420px] w-[420px] rounded-full bg-icon-green/20 blur-3xl" />
    <div className="absolute -bottom-24 left-16 h-[360px] w-[360px] rounded-full bg-teal-light/10 blur-3xl" />
    <div className="relative z-10 grid md:grid-cols-[1.05fr_0.95fr] max-w-6xl w-full rounded-3xl overflow-hidden border border-conversation-border shadow-2xl bg-search-input-container-background/95">
      <div className="p-6 md:p-14 flex flex-col justify-between md:min-h-[620px]">
        <div>
          <div className="flex items-center gap-3 text-white mb-8 md:mb-12">
            <div className="h-12 w-12 rounded-2xl bg-icon-green flex items-center justify-center shadow-lg">
              <Image src="/favicon.png" alt="ProjectChat" height={30} width={30} />
            </div>
            <div>
              <div className="text-2xl font-semibold">ProjectChat</div>
              <div className="text-secondary text-sm">Web demo</div>
            </div>
          </div>
          <h1 className="text-primary-strong text-4xl md:text-5xl font-light leading-tight mb-5">Converse como no produto real.</h1>
          <p className="text-secondary text-lg leading-relaxed max-w-xl">
            A demo publica abre um ambiente preenchido com contatos, historico, busca, anexos e perfil editavel sem usar contas reais.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <div className="rounded-2xl bg-panel-header-background border border-conversation-border p-4">
              <BsWindowSidebar className="text-icon-green text-xl mb-3" />
              <div className="text-primary-strong font-semibold">Interface completa</div>
              <div className="text-secondary text-sm mt-1">Sidebar, filtros, conversas e chamadas demo.</div>
            </div>
            <div className="rounded-2xl bg-panel-header-background border border-conversation-border p-4">
              <BsShieldLockFill className="text-teal-light text-xl mb-3" />
              <div className="text-primary-strong font-semibold">Sem dados privados</div>
              <div className="text-secondary text-sm mt-1">Tudo fica no localStorage do navegador.</div>
            </div>
          </div>
        </div>
        <div className="text-secondary text-xs mt-8 md:mt-10">Backend real, Socket.IO e Firebase ficam fora desta demo publica por seguranca.</div>
      </div>
      <div className="bg-panel-header-background p-6 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-conversation-border">
        <div className="bg-[#0b141a] rounded-3xl border border-conversation-border p-6 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-conversation-border pb-5 mb-5">
            <Image src="/whatsapp.gif" alt="ProjectChat preview" height={96} width={96} />
            <div>
              <div className="text-primary-strong text-xl font-semibold">ProjectChat Web</div>
              <div className="text-secondary text-sm">Ambiente demo pronto</div>
            </div>
          </div>
          <div className="space-y-3 mb-8">
            <div className="bg-incoming-background rounded-xl rounded-tl-sm px-4 py-3 text-primary-strong text-sm max-w-[82%]">A demo agora parece uma conversa real.</div>
            <div className="bg-outgoing-background rounded-xl rounded-tr-sm px-4 py-3 text-primary-strong text-sm ml-auto max-w-[82%]">Pode testar sem login externo.</div>
            <div className="bg-incoming-background rounded-xl rounded-tl-sm px-4 py-3 text-primary-strong text-sm max-w-[82%]">Mensagens, perfil e anexos ficam locais.</div>
          </div>
          <button className="flex items-center justify-center gap-4 bg-icon-green hover:bg-teal-light text-search-input-container-background p-4 rounded-xl w-full font-semibold transition-colors" onClick={handleLogin}>
            {!IS_DEMO_MODE && <FcGoogle className="text-3xl"/>}
            <span>{IS_DEMO_MODE ? "Entrar no ProjectChat Demo" : "Login with Google"}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default login;
