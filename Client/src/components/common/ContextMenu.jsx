import { useCallback, useEffect, useRef, useState } from "react";

function ContextMenu({options,cordinates,contextMenu,setContextMenu}) {
  const contextMenuRef = useRef(null);
  const [position, setPosition] = useState(cordinates);

  const handleOutsideClick = useCallback((event) => {
    if (event.target.id !== "context-opener") {
      if (contextMenuRef.current && 
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu(false);
      }
    }
  }, [setContextMenu]);

  useEffect(() => {
    if (!contextMenu || !contextMenuRef.current) return;

    const margin = 8;
    const rect = contextMenuRef.current.getBoundingClientRect();
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const nextX = Math.min(Math.max(cordinates.x, margin), maxX);
    const nextY = Math.min(Math.max(cordinates.y, margin), maxY);

    setPosition({
      x: Number.isFinite(nextX) ? nextX : margin,
      y: Number.isFinite(nextY) ? nextY : margin,
    });
  }, [contextMenu, cordinates]);

  useEffect(() => {
    if (contextMenu) {
      document.addEventListener("click", handleOutsideClick);

      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [contextMenu, handleOutsideClick]);

  const handleClick = (e, callback) =>{
    e.stopPropagation();
    setContextMenu(false)
    callback();
  }
  return ( 
  <div 
  className="bg-dropdown-background fixed py-2 z-[1000] min-w-48 rounded-lg shadow-xl border border-conversation-border overflow-hidden"
  ref={contextMenuRef}
  style={{
    top: position.y,
    left: position.x,
  }}
  >
    <ul>
      {
        options.map(({name,callback})=> (
          <li key={name} onClick={(e)=>handleClick(e,callback)}
          className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
          >
            <span className="text-white">
              {name}
            </span>
          </li>
        ))
      }
    </ul>
  </div>
  )
}

export default ContextMenu;
