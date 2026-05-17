import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import CapturePhoto from "./CapturePhoto";
import ContextMenu from "./ContextMenu";
import PhotoLibrary from "./PhotoLibrary";
import PhotoPicker from "./PhotoPicker";

function Avatar({type,image, setImage}) {
  const imageSrc = image || "/default_avatar.png";
  const canEdit = typeof setImage === "function";
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x:0,
    y:0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)
  const [showCapturePhoto, setShowCapturePhoto] = useState(false)

  const showContextMenu = (e) => {
    if (!canEdit) return;
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCordinates({
      x:e.pageX,
      y:e.pageY,
    });
  }

  useEffect(()=> {
    if(grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      };
    };
  }, [grabPhoto]);

  useEffect(() => {
    const handleOutsideClickPhoto = (event) => {
      if(event.target.id !== "photo-picker" ) {
          setGrabPhoto(false)
      }
    }
    document.addEventListener("click", handleOutsideClickPhoto);
    return () => {
      document.removeEventListener("click", handleOutsideClickPhoto);
    }
  }, []);

  const contextMenuOptions = [
    {name:"Tirar Foto",callback:()=>{
      setShowCapturePhoto(true)
    }},
    {name:"Escolher Da Biblioteca",callback:()=>{
      setShowPhotoLibrary(true)
    }},
    {name:"Enviar Foto",callback:()=>{
      setGrabPhoto(true);
    }},
    {name:"Remover Foto",callback:()=>{
      setImage('/default_avatar.png')
    }},
  ]

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function(event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src)
    }, 100);
  }
  
  return (
  <>
    <div className="flex items-center justify-center">
      {
        type ==="sm" && (
          <div className="relative h-10 w-10">
        <Image src={imageSrc} alt="avatar" className="rounded-full" fill sizes="40px" />
          </div>
      )}
      {
        type ==="lg" && (
          <div className="relative h-14 w-14">
        <Image src={imageSrc} alt="avatar" className="rounded-full" fill sizes="56px" />
          </div>
      )}
      {
        type === "xl" && (
          <div className="relative cursor-pointer z-0"
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          >
            {canEdit && <div className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
              ${hover?"visible": "hidden"}
              `}
              id="context-opener"
              onClick={e=>showContextMenu(e)}
              >
              <FaCamera 
                className="text-2xl" 
                id="context-opener"
                onClick={e=>showContextMenu(e)}
              />
              <span
              id="context-opener"
              onClick={e=>showContextMenu(e)}
              >Altere sua foto de perfil</span>
            </div>}
            <div className="relative flex items-center justify-center h-60 w-60">
            <Image src={imageSrc} alt="avatar" className="rounded-full" fill sizes="240px" />
            </div>
          </div>
      )}
    </div>
    {
      canEdit && isContextMenuVisible && <ContextMenu
      options={contextMenuOptions}
      cordinates={contextMenuCordinates}
      contextMenu={isContextMenuVisible}
      setContextMenu={setIsContextMenuVisible}
      />
    }
    {canEdit && showCapturePhoto && <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />}
    {canEdit && showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLibrary} />}
    {canEdit && grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
  </>
  );
}

export default Avatar;
