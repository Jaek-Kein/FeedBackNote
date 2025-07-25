import styled from "@emotion/styled";
import { useMusicStore } from "../store/useMusicStore";

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

interface MusicLoadProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function MusicLoadButton({
  handleFileChange,
  fileInputRef,
}: MusicLoadProps) {
  return (
    <LoadLabel style={{ backgroundColor: "red" }}>
      음악 추가
      <input
        type="file"
        accept=".mp3, .wav, .acc, .flac"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </LoadLabel>
  );
}

interface FnLoadProps {
  handleFnLoad: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function FnLoadButton({ handleFnLoad }: FnLoadProps) {
  return (
    <LoadLabel>
      불러오기
      <input
        type="file"
        accept=".fn"
        onChange={handleFnLoad}
        style={{ display: "none" }}
      />
    </LoadLabel>
  );
}

interface CommentProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function AddCommentButton({ audioRef }: CommentProps) {
  const { addComment } = useMusicStore();
  return (
    <Button
      onClick={() => addComment(audioRef.current?.currentTime ?? 0)}
      style={{ marginTop: "5px" }}
    >
      + 코멘트 추가
    </Button>
  );
}

interface saveProps {
    handleSave: () => void;
}

export function SaveButton({handleSave}:saveProps) {
  return <SystemButton onClick={handleSave}>저장하기</SystemButton>;
}
