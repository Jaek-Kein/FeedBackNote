import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { formatTime } from "./Common";
import { FaVolumeHigh} from "react-icons/fa6";

const Wrapper = styled.div`
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 10px;
    padding: 0 50px;
    height: 70px;
    background-color: transparent;
    justify-self: center;
    margin: 10px 0;
    border-radius: 10px;

    box-sizing: border-box;

    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-items: center;
    gap: 20px;
`;

const Play = styled.button`
    border-radius: 50px;
    width: fit-content;
    aspect-ratio: 1;
    background-color: #ffffff;
    border: 2px outset white;

    &:active {
        transform: scale(0.95);
    }
`;

const TimeArea = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
    width: 100%;
    gap: 7px;
`;

const Timestamp = styled.input<{ progress: number }>`
    height: 10px;
    width: 100%;
    pointer-events: auto;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;

    &::-webkit-slider-runnable-track {
        height: 100%;
        width: 100%;
        border-radius: 20px;
        background: ${({ progress }) =>
            `linear-gradient(to right, #ffffff ${progress}%, #00000000 ${progress}%)`};
        background-color: #ffffff55;
        backdrop-filter: blur(20px);
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 20px;
        width: 2px;
        background: transparent;
        background-color: transparent;
        border-radius: 20px;
    }
`;

const TimeAndVolume = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-items: center;
`;

const TimeShow = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: white;
`;

const VolumeContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const Volume = styled.input<{ volume: number }>`
    width: 15%;
    height: 10px;
    justify-self: flex-end;
    margin: 0 5px;

    pointer-events: auto;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;

    &::-webkit-slider-runnable-track {
        height: 100%;
        width: 100%;
        border-radius: 20px;
        background: ${({ volume }) =>
            `linear-gradient(to right, #ffffff  ${volume * 100}%, #00000000 ${
                volume * 100
            }%)`};
        background-color: #ffffff55;
        backdrop-filter: blur(20px);
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 20px;
        width: 2px;
        background: transparent;
        background-color: transparent;
        border-radius: 20px;
    }
`;

interface Props {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayer: React.FC<Props> = ({ audioRef }) => {
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioPlayHandler = async () => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        if (!audio.paused) {
            audio.pause();
        } else {
            try {
                await audio.play();
            } catch (error) {
                console.log("재생 실패 또는 중단:", error);
            }
        }
    };

    const volumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setProgress(0);
            setCurrentTime(0);
        };

        const handleTimeUpdate = () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            setProgress(progress);
            setCurrentTime(audio.currentTime);
            console.log("시간 업데이트됨")
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata); // ✅ duration 확보
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };

        console.log(" 실행됨 ")
    }, [audioRef]);

    return (
        <Wrapper>
            <Play onClick={audioPlayHandler}> ▶/⏸ </Play>
            <TimeArea>
                <Timestamp
                    type="range"
                    min={0}
                    max={audioRef.current?.duration || 0}
                    value={currentTime || 0}
                    step={0.01}
                    progress={progress}
                    onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        if (audioRef.current) {
                            audioRef.current.currentTime = newTime;
                        }
                    }}
                />
                <TimeAndVolume>
                    <TimeShow>
                        {formatTime(currentTime)} /{" "}
                        {audioRef.current
                            ? formatTime(audioRef.current.duration)
                            : "0: 00"}
                    </TimeShow>
                    <VolumeContainer>
                        <FaVolumeHigh color="#ffffff" size="18px" />
                        <Volume
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            volume={volume}
                            onChange={volumeHandler}
                        />
                    </VolumeContainer>
                </TimeAndVolume>
            </TimeArea>
        </Wrapper>
    );
};

export default MusicPlayer;
