/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import MusicPlayer from "./MusicPlayer";
import { formatTime } from "./Common";
import { useMusicStore } from "../store/useMusicStore";
import { IoMdTime } from "react-icons/io";

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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const SystemButton = styled(Button)`
  background-color: #28a745;
  height: 40px;
  padding: 0rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #1e7e34;
  }
`;

const LoadLabel = styled.label`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0rem 1rem;
  height: 40px;
  background-color: #007bff;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    audioSrc,
    comments,
    playlist,
    updateComment,
    deleteComment,
    addComment,
    addSession,
  } = useMusicStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    a.download = "music_comments.fn";
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
          <Title>피드백 기록지</Title>
          <Buttons>
            <SystemButton onClick={handleSave}>저장하기</SystemButton>
            <LoadLabel>
              불러오기
              <input
                type="file"
                accept=".fn"
                onChange={handleLoad}
                style={{ display: "none" }}
              />
            </LoadLabel>
          </Buttons>
        </TopBar>

        {!audioSrc && (
          <input
            type="file"
            accept=".mp3, .wav, .acc, .flac"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ padding: "10px 10px" }}
          />
        )}

        {audioSrc && (
          <audio
            key={audioSrc}
            ref={audioRef}
            src={audioSrc}
            style={{
              width: "100%",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          />
        )}

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
                />
                <Time onClick={() => handleTimeClick(c.time)}>
                  {formatTime(c.time)}
                </Time>
                <Delete onClick={() => deleteComment(i)}>X</Delete>
              </CommentShell>
            ))}
          </CommentContainer>
          <Button
            onClick={() =>
              addComment(audioRef.current?.currentTime ?? 0)
            }
            style={{ marginTop: "5px" }}
          >
            + 코멘트 추가
          </Button>
        </CommentList>
      </Container>

      <MusicPlayer audioRef={audioRef} key={audioSrc} />
    </>
  );
}
