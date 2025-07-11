/** @jsxImportSource @emotion/react */
import { useMusicStore } from '../store/useMusicStore';
import CuetoJsonParser from './CuetoJsonParser';

export default function Playlist() {
    const {playlist, setPlaylist} = useMusicStore();

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
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>CUE 파일 업로드</h2>
      <input type="file" accept=".cue" onChange={handleCueUpload} />

      <ul style={{ marginTop: "20px" }}>
        {playlist.map((track, index) => (
          <li key={index}>
            🎵 <strong>{track.title}</strong> — {track.performer}
          </li>
        ))}
      </ul>
    </div>
  );
}
