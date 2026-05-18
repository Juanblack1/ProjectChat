import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { hasDemoSession, startDemoSession } from "@/utils/DemoData";
import { isSupabaseConfigured, supabase } from "@/utils/SupabaseConfig";
import { ensureProfile } from "@/utils/SupabaseChat";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsShieldLockFill, BsWindowSidebar } from "react-icons/bs";

const PENDING_SIGNUP_PROFILE_KEY = "projectchat:pending-signup-profile";

function Login() {
  const router = useRouter()

  const [{userInfo, newUser}, dispatch] = useStateProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (IS_DEMO_MODE) {
      if (hasDemoSession()) {
        router.replace("/");
      }
      return;
    }

    if(userInfo?.id && !newUser) router.push("/")
  }, [dispatch, router, userInfo, newUser])

  useEffect(() => {
    if (IS_DEMO_MODE || !supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("reset");
        setError("");
        setInfo("Digite uma nova senha para concluir a recuperacao da conta.");
      }

      if (event === "SIGNED_IN" && typeof window !== "undefined") {
        const authFlow = new URLSearchParams(window.location.search).get("authFlow");
        if (authFlow === "signup") {
          const pendingProfile = JSON.parse(window.localStorage.getItem(PENDING_SIGNUP_PROFILE_KEY) || "{}");
          setEmail(session?.user?.email || pendingProfile.email || "");
          setName(pendingProfile.name || session?.user?.email?.split("@")[0] || "");
          setAuthMode("completeSignup");
          setError("");
          setInfo("Email confirmado. Crie sua senha para concluir o cadastro.");
        }
      }
    });

    return () => listener.subscription?.unsubscribe();
  }, []);

  const resetFeedback = () => {
    setError("");
    setInfo("");
  };

  const getRedirectUrl = (authFlow) => {
    if (typeof window === "undefined") return undefined;
    const redirectUrl = new URL(`${window.location.origin}/login`);
    if (authFlow) redirectUrl.searchParams.set("authFlow", authFlow);
    return redirectUrl.toString();
  };

  const goToSignin = async () => {
    resetFeedback();
    setNewPassword("");
    setConfirmPassword("");
    if (!IS_DEMO_MODE && supabase && ["reset", "completeSignup"].includes(authMode)) {
      await supabase.auth.signOut();
    }
    setAuthMode("signin");
  };

  const handleLogin = async (event) => {
    event?.preventDefault();

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

    if (!isSupabaseConfigured) {
      setError("Servico de autenticacao indisponivel. Tente novamente em instantes.");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (authMode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getRedirectUrl(),
        });
        if (resetError) throw resetError;
        setInfo("Enviamos um link de recuperacao para o seu email.");
        return;
      }

      if (authMode === "signup") {
        const normalizedEmail = email.trim();
        const displayName = name.trim() || normalizedEmail.split("@")[0];
        const { error: signUpError } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: getRedirectUrl("signup"),
            data: { name: displayName },
          },
        });
        if (signUpError) throw signUpError;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PENDING_SIGNUP_PROFILE_KEY, JSON.stringify({ email: normalizedEmail, name: displayName }));
        }
        setPassword("");
        setInfo("Enviamos um link de verificacao para o seu email.");
        return;
      }

      if (["reset", "completeSignup"].includes(authMode)) {
        if (newPassword.length < 6) {
          setError("A nova senha precisa ter pelo menos 6 caracteres.");
          return;
        }
        if (newPassword !== confirmPassword) {
          setError("As senhas nao conferem.");
          return;
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
        if (updateError) throw updateError;
        if (authMode === "completeSignup") {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          const profile = await ensureProfile(sessionData.session?.user, { name: name.trim() });
          if (typeof window !== "undefined") window.localStorage.removeItem(PENDING_SIGNUP_PROFILE_KEY);
          dispatch({type: reducerCases.SET_USER_INFO, userInfo: profile});
          dispatch({type: reducerCases.SET_NEW_USER, newUser: false});
          router.push("/");
          return;
        }

        await supabase.auth.signOut();
        setNewPassword("");
        setConfirmPassword("");
        setAuthMode("signin");
        setInfo("Senha atualizada. Entre novamente com sua nova senha.");
        return;
      }

      const authResult = await supabase.auth.signInWithPassword({ email, password });

      if (authResult.error) throw authResult.error;

      const authUser = authResult.data.session?.user;
      if (authUser) {
        const profile = await ensureProfile(authUser, { name: name.trim() });
        dispatch({type: reducerCases.SET_USER_INFO, userInfo: profile});
        dispatch({type: reducerCases.SET_NEW_USER, newUser: false});
        router.push("/");
        return;
      }

      setInfo("Verifique seu email para continuar.");
    } catch(err){
      setError(err.message || "Nao foi possivel autenticar.");
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="min-h-screen w-screen bg-[#0b141a] flex items-start md:items-center justify-center px-6 py-8 md:py-0 relative overflow-auto md:overflow-hidden">
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
              <div className="text-secondary text-sm">Chat em tempo real</div>
            </div>
          </div>
          <h1 className="text-primary-strong text-4xl md:text-5xl font-light leading-tight mb-5">Comunicacao em tempo real para equipes.</h1>
          <p className="text-secondary text-lg leading-relaxed max-w-xl">
            {IS_DEMO_MODE
              ? "Acesse um ambiente local para conhecer a experiencia do ProjectChat."
              : "Acesse suas conversas, contatos e mensagens em um ambiente seguro e sincronizado."}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <div className="rounded-2xl bg-panel-header-background border border-conversation-border p-4">
              <BsWindowSidebar className="text-icon-green text-xl mb-3" />
              <div className="text-primary-strong font-semibold">Conversas organizadas</div>
              <div className="text-secondary text-sm mt-1">Contatos, busca, filtros e anexos em uma unica area de trabalho.</div>
            </div>
            <div className="rounded-2xl bg-panel-header-background border border-conversation-border p-4">
              <BsShieldLockFill className="text-teal-light text-xl mb-3" />
              <div className="text-primary-strong font-semibold">Acesso seguro</div>
              <div className="text-secondary text-sm mt-1">Login por email e senha com sessao protegida.</div>
            </div>
          </div>
        </div>
        <div className="text-secondary text-xs mt-8 md:mt-10">
          Mensagens sincronizadas em tempo real entre usuarios autorizados.
        </div>
      </div>
      <div className="bg-panel-header-background p-6 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-conversation-border">
        <div className="bg-[#0b141a] rounded-3xl border border-conversation-border p-6 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-conversation-border pb-5 mb-5">
            <Image src="/whatsapp.gif" alt="ProjectChat preview" height={96} width={96} />
            <div>
              <div className="text-primary-strong text-xl font-semibold">ProjectChat Web</div>
              <div className="text-secondary text-sm">Acesso profissional</div>
            </div>
          </div>
          <form className="space-y-3 mt-6" onSubmit={handleLogin}>
            {!IS_DEMO_MODE && ["signup", "completeSignup"].includes(authMode) && (
              <input
                className="bg-input-background text-white h-12 rounded-xl px-4 w-full focus:outline-none focus:ring-1 focus:ring-icon-green/60 placeholder:text-secondary"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}
            {!IS_DEMO_MODE && !["reset", "completeSignup"].includes(authMode) && (
              <>
                <input
                  className="bg-input-background text-white h-12 rounded-xl px-4 w-full focus:outline-none focus:ring-1 focus:ring-icon-green/60 placeholder:text-secondary"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {authMode === "signin" && (
                  <input
                    className="bg-input-background text-white h-12 rounded-xl px-4 w-full focus:outline-none focus:ring-1 focus:ring-icon-green/60 placeholder:text-secondary"
                    placeholder="Senha"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                )}
              </>
            )}
            {!IS_DEMO_MODE && authMode === "completeSignup" && email && (
              <div className="text-secondary text-sm bg-search-input-container-background rounded-xl px-4 py-3">
                Email confirmado: <span className="text-primary-strong">{email}</span>
              </div>
            )}
            {!IS_DEMO_MODE && ["reset", "completeSignup"].includes(authMode) && (
              <>
                <input
                  className="bg-input-background text-white h-12 rounded-xl px-4 w-full focus:outline-none focus:ring-1 focus:ring-icon-green/60 placeholder:text-secondary"
                  placeholder="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={6}
                  required
                />
                <input
                  className="bg-input-background text-white h-12 rounded-xl px-4 w-full focus:outline-none focus:ring-1 focus:ring-icon-green/60 placeholder:text-secondary"
                  placeholder="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </>
            )}
            {info && <div className="text-teal-light text-sm bg-icon-green/10 border border-icon-green/20 rounded-xl px-4 py-3">{info}</div>}
            {error && <div className="text-red-300 text-sm bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}
            <button
              className="flex items-center justify-center gap-4 bg-icon-green hover:bg-teal-light text-search-input-container-background p-4 rounded-xl w-full font-semibold transition-colors disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              <span>{IS_DEMO_MODE ? "Entrar no ProjectChat" : loading ? "Processando..." : authMode === "signup" ? "Enviar link de verificacao" : authMode === "forgot" ? "Enviar link" : authMode === "reset" ? "Atualizar senha" : authMode === "completeSignup" ? "Concluir cadastro" : "Entrar"}</span>
            </button>
          </form>
          {!IS_DEMO_MODE && (
            <div className="flex flex-col gap-2 mt-4 text-sm">
              {authMode === "signin" && (
                <>
                  <button type="button" className="text-secondary hover:text-primary-strong" onClick={() => { resetFeedback(); setAuthMode("forgot"); }}>
                    Esqueci minha senha
                  </button>
                  <button type="button" className="text-secondary hover:text-primary-strong" onClick={() => { resetFeedback(); setAuthMode("signup"); }}>
                    Criar uma nova conta
                  </button>
                </>
              )}
              {authMode !== "signin" && (
                <button type="button" className="text-secondary hover:text-primary-strong" onClick={goToSignin}>
                  Voltar para entrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;
