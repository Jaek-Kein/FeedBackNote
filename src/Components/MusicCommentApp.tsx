/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import MusicPlayer from "./MusicPlayer";
import { formatTime } from "./Common";
import { useMusicStore } from "../store/useMusicStore";
import { IoMdTime } from "react-icons/io";
import Toast from "./Toast";
import {
  AddCommentButton,
  FnLoadButton,
  MusicLoadButton,
  SaveButton,
} from "./Buttons";

const Container = styled.div`
  width: 1000px;
  padding: 30px 50px;
  display: grid;
  font-family: Pretendard;
  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 20px;
  }
`;

const TopBar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  @media (max-width: 480px) {
    grid-template-columns: none;
    grid-template-rows: auto auto;
    align-items: center;
    justify-items: center;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`;

const FileTitle = styled.textarea`
  padding: 10px 5px;
  background-color: transparent;
  color: white;
  width: 200%;
  max-height: 2.5rem;
  font-size: 18px;
  word-wrap: break-word;
  overflow: hidden;
  resize: none;
  border: none;
  outline: none;
  font-family: Pretendard;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  height: 650px;
`;

const CommentShell = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid #d3d3d328;
`;

const Time = styled.div`
  width: 10rem;
  padding: 10px 5px;
  color: white;
  display: flex;
  justify-content: center;
`;

const CommentTop = styled.div`
  padding: 10px 5px;
  color: white;
`;

const CommentContainer = styled.div`
  overflow-y: scroll;
  max-height: 60vh;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffffff25;
    border-radius: 20px;
  }
`;

const Comments = styled.textarea`
  padding: 10px 5px;
  background-color: transparent;
  color: white;
  width: 100%;
  min-height: 2rem;
  font-size: 18px;
  resize: none;
  border: none;
  outline: none;
  font-family: Pretendard;
`;

const Delete = styled.div`
  color: #f07c7c;
  padding-left: 10px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  align-items: center;
`;

interface Props {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicCommentApp({ audioRef }: Props) {
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    audioSrc,
    comments,
    playlist,
    updateComment,
    deleteComment,
    addSession,
  } = useMusicStore();
  const sessionName = useMusicStore((state) =>
    state.currentIndex !== null ? state.sessions[state.currentIndex]?.name : ""
  );
  const updateSessionName = useMusicStore((state) => state.updateSessionName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE = 1 * 1024 * 1024 * 1024;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setShowToast(true);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addSession({
        name: file.name,
        audioSrc: reader.result as string,
        comments: [],
        playlist: [],
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!audioSrc) return;

    const saveData = { audio: audioSrc, comments, playlist };
    const blob = new Blob([JSON.stringify(saveData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cleanFileName = sessionName.replace(/\.[^/.]+$/, "");
    a.download = (cleanFileName || "music_comments") + ".fn";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result as string);
        if (result.audio && result.comments && result.playlist) {
          addSession({
            name: file.name,
            audioSrc: result.audio,
            comments: result.comments,
            playlist: result.playlist,
          });
        }
      } catch {
        alert("파일 형식이 잘못되었습니다.");
      }
    };
    reader.readAsText(file);
  };

  const handleTimeClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((el) => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    });
  }, [comments]);

  return (
    <>
      <Container>
        <TopBar>
          <div>
            <Title>FeedBackNote</Title>
            <FileTitle
              placeholder="파일명을 입력해주세요"
              maxLength={25}
              value={sessionName}
              onChange={(e) => updateSessionName(e.target.value)}
            />
          </div>
          <Buttons>
            <MusicLoadButton
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
            />
            <SaveButton handleSave={handleSave} />
            <FnLoadButton handleFnLoad={handleLoad} />
          </Buttons>
        </TopBar>

        {audioSrc && <audio key={audioSrc} ref={audioRef} src={audioSrc} />}

        <CommentList>
          <CommentShell style={{ fontSize: "1.2rem" }}>
            <CommentTop style={{ justifySelf: "left" }}>코멘트</CommentTop>
            <Time>
              <IoMdTime size="1.2rem" />
            </Time>
            <div style={{ width: "40px" }}></div>
          </CommentShell>
          <CommentContainer>
            {comments.map((c, i) => (
              <CommentShell key={i}>
                <Comments
                  placeholder="코멘트를 입력해주세요"
                  onChange={(e) => updateComment(i, e.target.value)}
                  value={c.text}
                  maxLength={1000}
                />
                <Time onClick={() => handleTimeClick(c.time)}>
                  {formatTime(c.time)}
                </Time>
                <Delete onClick={() => deleteComment(i)}>X</Delete>
              </CommentShell>
            ))}
          </CommentContainer>
          <AddCommentButton audioRef={audioRef} />
        </CommentList>
      </Container>

      <MusicPlayer audioRef={audioRef} key={audioSrc} />
      <Toast
        message="파일 사이즈가 너무 큽니다"
        visible={showToast}
        onhide={() => setShowToast(false)}
      />
    </>
  );
}
