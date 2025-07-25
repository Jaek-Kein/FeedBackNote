/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useMusicStore } from "../store/useMusicStore";
import CuetoJsonParser from "./CuetoJsonParser";

const Wrapper = styled.div`
  padding: 30px 50px;
  width: 100%;
`;
const Title = styled.h2`
  color: white;
`;
const MusicList = styled.ul`
  height: 600px;
  overflow-y: scroll;
  
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffffff25;
    border-radius: 20px;
  }
`;
const MusicWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  color: white;
  gap: 20px;
  box-sizing: border-box;
  border-bottom: 2px solid #ffffff42;
  margin-bottom: 2.5px;
  padding-bottom: 2.5px;
`;
const MusicIndex = styled.div`
  width: 3em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 20px;
`;
const MusicInfo = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: 5px;
`;
const MusicTitle = styled.div`
  font-size: 18px;
`;
const MusicAuthor = styled.div`
  font-size: 14px;
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

const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function Playlist({ audioRef }: Props) {
  const { playlist, setPlaylist } = useMusicStore();

  const handleCueUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const cueText = reader.result as string;
      const parsedTracks = CuetoJsonParser(cueText);
      setPlaylist(parsedTracks);
    };
    reader.readAsText(file, "utf-8");
  };

  const PlaylistClickHandler = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  return (
    <Wrapper>
      <TitleBar>
        <Title>플레이리스트</Title>
        <LoadLabel>
          세트리 불러오기
          <input
            type="file"
            accept=".cue"
            onChange={handleCueUpload}
            style={{ display: "none" }}
          />
        </LoadLabel>
      </TitleBar>
      <MusicList style={{ marginTop: "20px" }}>
        {playlist.map((track, index) => (
          <MusicWrapper onClick={() => PlaylistClickHandler(track.time)}>
            <MusicIndex>{index + 1}</MusicIndex>
            <MusicInfo key={index}>
              <MusicTitle>{track.title}</MusicTitle>
              <MusicAuthor>{track.performer}</MusicAuthor>
            </MusicInfo>
          </MusicWrapper>
        ))}
      </MusicList>
    </Wrapper>
  );
}
