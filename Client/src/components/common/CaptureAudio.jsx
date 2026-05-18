import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { addDemoMessage, createDemoMessage, readFileAsDataUrl } from "@/utils/DemoData";
import { sendMessage as sendSupabaseMessage } from "@/utils/SupabaseChat";
import { useI18n } from "@/utils/useI18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({hide}) {

  const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
  const { t } = useI18n();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);
  const [recordingError, setRecordingError] = useState("");
  

  const audioRef = useRef();
  const mediaRecorderRef = useRef();
  const waveFormRef = useRef();
  const audioChunksRef = useRef([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const handleStartRecording = useCallback(() => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setRecordingError("");
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm"});
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);
        setRenderedAudio(new File([blob], "recording.webm", { type: blob.type }));

        waveForm.load(audioURL);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    }).catch((error) => {
      console.log("Error accessing microphone:", error);
      setRecordingError(t("audio.microphonePermission"));
      setIsRecording(false);
    });
  }, [t, waveForm]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor:"#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true
    });
    setWaveForm(wavesurfer)

    wavesurfer.on("finish", () => {
      setIsPlaying(false)
  });

    return () => {
      wavesurfer.destroy()
    };
  }, []);

  useEffect(() => {
    if(waveForm) handleStartRecording();
  }, [handleStartRecording, waveForm])

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime)
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };
  
  const handleStopRecording = () => {
    if(mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();
    }
  };

  const sendRecording = async () =>{
    try{
      if (!renderedAudio) return;

      if (IS_DEMO_MODE) {
        const audioUrl = await readFileAsDataUrl(renderedAudio);
        const newMessage = createDemoMessage({
          contactId: currentChatUser.id,
          type: "audio",
          message: audioUrl,
        });
        addDemoMessage(currentChatUser.id, newMessage);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
        hide(false)
        return;
      }

      const audioUrl = await readFileAsDataUrl(renderedAudio);
      const newMessage = await sendSupabaseMessage({
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: audioUrl,
        type: "audio",
      });
      if(newMessage) {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
      }
      hide(false)
    } catch(err){
      console.log(err)
    }
  };

  const formatTime = (time) => {
    if(isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2,"0")
    }`;
  }

  return( 
  <div className="flex text-2x1 w-full justify-end items-center">
    <div className="pt-1">
    <FaTrash
    className="text-panel-header-icon"
    onClick={() => hide()}
    />
    </div>
    <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
      {
        isRecording?(
        <div className="text-red-500 animate-pulse 2-60 text-center">
          {t("audio.recording")} <span>{recordingDuration}s</span>
        </div>)
        :(
        <div>
          {
            recordedAudio &&
            <>
            {
              !isPlaying?
              <FaPlay onClick={handlePlayRecording} />
              :
              <FaStop onClick={handlePauseRecording} />
            }
            </>
          }
        </div>  
      )}
      <div className="w-60" ref={waveFormRef} hidden={isRecording}/>
      {
        recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
      )}
      {
        recordedAudio && !isPlaying && (<span>{formatTime(totalDuration)}</span>)
      }
      {
        recordingError && <span className="text-sm text-red-400">{recordingError}</span>
      }
      <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {
          !isRecording ? 
          (<FaMicrophone className="text-red-500" 
          onClick={handleStartRecording}
          />) 
          : 
          (<FaPauseCircle className="text-red-500"
          onClick={handleStopRecording}  
          />)
        }
      </div>
      <div>
        {
          !isRecording && (
            <MdSend 
            className="text-panel-header-icon cursor-pointer mr-4"
            title={t("common.send")}
            onClick={sendRecording}
            />
          )
        }
      </div>
    </div>
  );
}

export default CaptureAudio;
