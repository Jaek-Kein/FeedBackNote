import styled from "@emotion/styled";
import MusicCommentApp from "./Components/MusicCommentApp";
import { GlobalStyles } from "./Style/Style";
import { Global } from "@emotion/react";
import Playlist from "./Components/PlayList";
import { useRef } from "react";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    margin: 0;
    padding: 20px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    background-color: black;

    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 20px;
`;

const Container = styled.div`
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff20;
    height: 90%;

    @media (max-width: 480px) {
        width: 95%;
        height: fit-content;
    }
`;

const PanelBox = styled.div`
    border-radius: 0 15px 15px 0;
    background: linear-gradient(to top, #0000003c 85%, #ffffff00 20%);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 480px) {
        width: 95%;
        height: fit-content;
    }
`;

function App() {
    const audioRef = useRef<HTMLAudioElement>(null);
    return (
        <>
            <Global styles={GlobalStyles} />
            <Wrapper>
                <Container style={{ width: "20vw" }}>
                    <PanelBox style={{ background: "#0000003c" }}></PanelBox>
                </Container>
                <Container
                    style={{
                        background:
                            "linear-gradient(to bottom, #451aa9 20%, #ffffff20 35%)",
                    }}
                >
                    <PanelBox>
                        <MusicCommentApp audioRef={audioRef} />
                    </PanelBox>
                </Container>
                <Container style={{ width: "25vw" }}>
                    <PanelBox style={{ background: "#0000003c" }}>
                        <Playlist audioRef={audioRef}/>
                    </PanelBox>
                </Container>
            </Wrapper>
        </>
    );
}

export default App;
