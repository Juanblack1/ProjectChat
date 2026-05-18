import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { saveDemoProfile } from "@/utils/DemoData";
import { updateProfile } from "@/utils/SupabaseChat";
import { translateAuthError } from "@/utils/I18n";
import { useI18n } from "@/utils/useI18n";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Avatar from "../common/Avatar";

function ProfileSettings({onClose}) {
  const [{userInfo}, dispatch] = useStateProvider();
  const { t, language } = useI18n();
  const [name, setName] = useState(userInfo?.name || "");
  const [status, setStatus] = useState(userInfo?.status || "");
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || "/default_avatar.png");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setError("");
    setSaving(true);

    try {
      const profile = {
        ...userInfo,
        name: name.trim() || t("common.user"),
        status: status.trim(),
        profileImage,
      };
      const nextProfile = IS_DEMO_MODE
        ? saveDemoProfile(profile)
        : await updateProfile(userInfo?.id, profile);

      dispatch({type: reducerCases.SET_USER_INFO, userInfo: nextProfile});
      onClose();
    } catch (err) {
      setError(translateAuthError(err, language) || t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm flex items-center justify-center text-white">
      <div className="bg-panel-header-background rounded-3xl w-[440px] max-w-[92vw] p-6 shadow-2xl border border-conversation-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{t("profile.title")}</h2>
            <p className="text-secondary text-sm mt-1">{t("profile.description")}</p>
          </div>
          <IoClose className="text-3xl cursor-pointer text-icon-lighter" onClick={onClose} />
        </div>

        <div className="flex justify-center mb-6">
          <Avatar type="xl" image={profileImage} setImage={setProfileImage} />
        </div>

        <label className="text-teal-light text-sm">{t("profile.name")}</label>
        <input
          className="bg-input-background text-white h-11 rounded-lg px-4 w-full mt-2 mb-5 focus:outline-none focus:ring-1 focus:ring-icon-green/60"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
        />

        <label className="text-teal-light text-sm">{t("profile.about")}</label>
        <input
          className="bg-input-background text-white h-11 rounded-lg px-4 w-full mt-2 mb-6 focus:outline-none focus:ring-1 focus:ring-icon-green/60"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          placeholder={t("common.available")}
          maxLength={80}
        />

        {error && <div className="text-red-300 text-sm bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3 mb-4">{error}</div>}

        <button
          className="bg-icon-green hover:bg-teal-light text-black font-semibold rounded-lg w-full py-3 transition-colors disabled:opacity-60"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? t("common.saving") : t("profile.save")}
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
