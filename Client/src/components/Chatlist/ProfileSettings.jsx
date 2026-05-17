import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { saveDemoProfile } from "@/utils/DemoData";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Avatar from "../common/Avatar";

function ProfileSettings({onClose}) {
  const [{userInfo}, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [status, setStatus] = useState(userInfo?.status || "");
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || "/default_avatar.png");

  const saveProfile = () => {
    const nextProfile = saveDemoProfile({
      ...userInfo,
      name: name.trim() || "Visitante Demo",
      status: status.trim(),
      profileImage,
    });

    dispatch({type: reducerCases.SET_USER_INFO, userInfo: nextProfile});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center text-white">
      <div className="bg-panel-header-background rounded-2xl w-[420px] max-w-[92vw] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Meu perfil</h2>
          <IoClose className="text-3xl cursor-pointer text-icon-lighter" onClick={onClose} />
        </div>

        <div className="flex justify-center mb-6">
          <Avatar type="xl" image={profileImage} setImage={setProfileImage} />
        </div>

        <label className="text-teal-light text-sm">Nome</label>
        <input
          className="bg-input-background text-white h-11 rounded-lg px-4 w-full mt-2 mb-5 focus:outline-none"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
        />

        <label className="text-teal-light text-sm">Recado</label>
        <input
          className="bg-input-background text-white h-11 rounded-lg px-4 w-full mt-2 mb-6 focus:outline-none"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          maxLength={80}
        />

        <button
          className="bg-icon-green hover:bg-teal-light text-black font-semibold rounded-lg w-full py-3"
          onClick={saveProfile}
        >
          Salvar perfil
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
