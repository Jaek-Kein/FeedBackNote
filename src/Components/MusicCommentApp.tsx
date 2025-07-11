/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import MusicPlayer from "./MusicPlayer";
import { formatTime } from "./Common";
import { useMusicStore } from "../store/useMusicStore";
import { IoMdTime } from "react-icons/io";

const Container = styled.div`
    width: 1000px;
    height: fit-content;
    padding: 30px 50px;
    display: grid;

    font-family: Pretendard;
    @media (max-width: 480px) {
        width: 100%;
        height: fit-content;
        padding: 10px 20px;
    }
`;

const TopBar = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;

    @media (max-width: 480px) {
        display: grid;
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
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;

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
    user-select: none;
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
    line-height: 40px;
`;

const CommentList = styled.div`
    display: flex;
    border-radius: 20px;
    flex-direction: column;

    height: fit-content;
    min-height: 500px;
`;

const CommentShell = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    width: 100%;
    border-radius: 20px 20px 0 0;
    box-sizing: border-box;
    align-items: center;
    justify-items: center;
    gap: 20px;
`;

const Time = styled.div`
    padding: 10px 5px;
    box-sizing: border-box;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;

    font-size: 1rem;
`;

const TitleContainer = styled.div``;

const CommentTop = styled.div`
    padding: 10px 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;

    font-size: 1rem;
`;

const CommentContainer = styled.div`
    overflow-y: scroll;
    height: fit-content;
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
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    resize: none;
    border: none;
    outline: none;
    overflow: hidden;
    min-height: 2rem;
    height: 2rem;
    width: 100%;
    background-color: transparent;
    color: white;

    font-size: 18px;
    line-height: 22px;
    font-family: Pretendard;
    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

const Delete = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-left: 10px;
    color: #f07c7c;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        color: red;
    }
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    text-justify: center;
`;

interface Props {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicCommentApp({ audioRef }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        audioSrc,
        audioFile,
        comments,
        playlist,
        setAudio,
        setComments,
        updateComment,
        deleteComment,
        addComment,
        setPlaylist,
    } = useMusicStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setAudio(reader.result as string, file);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!audioFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            const saveData = {
                audio: reader.result,
                comments,
                playlist: playlist,
            };
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
        reader.readAsDataURL(audioFile);
    };

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = JSON.parse(reader.result as string);
            if (result.audio)
                setAudio(result.audio, new File([], "fromLoadedData")); // File 없이도 처리 가능
            if (result.comments) setComments(result.comments);
            if (result.playlist) setPlaylist(result.playlist);
        };
        reader.readAsText(file);
    };

    const handleTimeClick = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    useEffect(() => {
        // 댓글이 변경될 때마다 실행
        const textareas = document.querySelectorAll("textarea");

        textareas.forEach((el) => {
            el.style.height = "auto"; // 초기화
            el.style.height = el.scrollHeight + "px"; // 내용 기반 높이 설정
        });
    }, [comments]);

    return (
        <>
            <Container>
                <TopBar>
                    <TitleContainer>
                        <Title> 피드백 기록지 </Title>
                    </TitleContainer>
                    <div>
                        <Buttons>
                            <SystemButton onClick={handleSave}>
                                저장하기
                            </SystemButton>
                            <div>
                                <LoadLabel
                                    style={{
                                        backgroundColor: "blue",
                                        userSelect: "none",
                                    }}
                                >
                                    불러오기
                                    <input
                                        type="file"
                                        accept=".fn"
                                        onChange={handleLoad}
                                        style={{ display: "none" }}
                                    />
                                </LoadLabel>
                            </div>
                        </Buttons>
                    </div>
                </TopBar>

                {!audioSrc && ( //오디오 소스 없으면 input 있으면 플레이어 랜더링
                    <input
                        type="file"
                        accept=".mp3, .wav, .acc, .flac"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ padding: "10px 10px" }}
                    />
                )}

                {audioSrc && (
                    <>
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
                    </>
                )}

                <CommentList>
                    <CommentShell
                        style={{
                            fontSize: "1.2rem",
                        }}
                    >
                        <CommentTop style={{ justifySelf: "left" }}>
                            코멘트
                        </CommentTop>
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
                                    onChange={(e) =>
                                        updateComment(i, e.target.value)
                                    }
                                    value={c.text}
                                >
                                    {c.text}
                                </Comments>
                                <Time onClick={() => handleTimeClick(c.time)}>
                                    {formatTime(c.time)}
                                </Time>
                                <Delete onClick={() => deleteComment(i)}>
                                    X
                                </Delete>
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
