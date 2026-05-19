import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { getAiMessages, isAiContact } from "@/utils/AiContact";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { getDemoConversation, getDemoProfile, hasDemoSession } from "@/utils/DemoData";
import { supabase } from "@/utils/SupabaseConfig";
import { ensureProfile, getConversationMessages, markConversationRead, subscribeToMessages, updateLastSeen } from "@/utils/SupabaseChat";
import { useI18n } from "@/utils/useI18n";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chat from "./Chat/Chat";
import SearchMessages from "./Chat/SearchMessages";
import ChatList from "./Chatlist/ChatList";
import LoadingScreen from "./common/LoadingScreen";
import Empty from "./Empty";

function Main() {
  const router = useRouter();
  const [{userInfo, currentChatUser, messagesSearch}, dispatch] = useStateProvider()
  const { t } = useI18n();
  const currentChatUserId = currentChatUser?.id;
  const currentChatUserIsAi = isAiContact(currentChatUser);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if(redirectLogin) router.push("/login")
  }, [redirectLogin, router])

  useEffect(() => {
    let active = true;

    const loadAuth = async () => {
    if (IS_DEMO_MODE) {
      if (!hasDemoSession()) {
        setRedirectLogin(true);
        setAuthChecked(true);
        return;
      }

      dispatch({ type: reducerCases.SET_USER_INFO, userInfo: getDemoProfile() });
      setAuthChecked(true);
      return;
    }

    if (!supabase) {
      setRedirectLogin(true);
      setAuthChecked(true);
      return;
    }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session?.user) {
        setRedirectLogin(true);
        setAuthChecked(true);
        return;
      }

      try {
        const profile = await ensureProfile(data.session.user);
        if (!active) return;
        dispatch({ type: reducerCases.SET_USER_INFO, userInfo: profile });
      } catch (error) {
        console.error(error);
        setRedirectLogin(true);
      } finally {
        if (active) setAuthChecked(true);
      }
    };

    loadAuth();

    if (!IS_DEMO_MODE && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) {
          dispatch({type: reducerCases.SET_USER_INFO, userInfo: undefined});
          router.push("/login");
          return;
        }

        const profile = await ensureProfile(session.user);
        dispatch({ type: reducerCases.SET_USER_INFO, userInfo: profile });
      });

      return () => {
        active = false;
        listener.subscription?.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, [dispatch, router]);

  useEffect(() => {
    if (IS_DEMO_MODE || !userInfo?.id) return;

    updateLastSeen(userInfo.id);
    const interval = setInterval(() => updateLastSeen(userInfo.id), 45000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") updateLastSeen(userInfo.id);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userInfo?.id]);

  useEffect(() => {
    let unsubscribe = () => {};

    const getMessages = async () => {
      dispatch({type: reducerCases.SET_MESSAGES_LOADING, messagesLoading: true});
      if (currentChatUserIsAi) {
        dispatch({
          type: reducerCases.SET_MESSAGES,
          messages: getAiMessages(userInfo.id, {welcome: t("contacts.aiWelcome")}),
        });
        return;
      }

      if (IS_DEMO_MODE) {
        dispatch({
          type: reducerCases.SET_MESSAGES,
          messages: getDemoConversation(currentChatUserId),
        });
        return;
      }

      try {
        const messages = await getConversationMessages(userInfo.id, currentChatUserId);
        dispatch({
          type:reducerCases.SET_MESSAGES, messages
        });
        await markConversationRead(userInfo.id, currentChatUserId);

        unsubscribe = subscribeToMessages(userInfo.id, currentChatUserId, (newMessage) => {
          dispatch({type: reducerCases.ADD_MESSAGE, newMessage});
        });
      } catch (error) {
        console.error(error);
        dispatch({type: reducerCases.SET_MESSAGES, messages: []});
      }
    };

    if(currentChatUserId && userInfo?.id){
      getMessages();
    }

    return () => unsubscribe();
  }, [currentChatUserId, currentChatUserIsAi, dispatch, t, userInfo?.id])

  if (!authChecked) {
    return <LoadingScreen />;
  }

  return (
  <>
  <div className="grid grid-cols-1 md:grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden bg-search-input-container-background">
    <div className={`${currentChatUser ? "hidden md:block" : "block"}`}>
      <ChatList  />
    </div>
    {
      currentChatUser ?( 
      <div className={messagesSearch ? "grid grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}>
      <Chat />
      {
        messagesSearch && <SearchMessages  />
      }
      </div> 
      ): (
      <div className="hidden md:block">
        <Empty />
      </div>
      )
    }
  </div>
  </>
  );
}

export default Main;
