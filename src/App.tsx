import styled from "@emotion/styled";
import MusicCommentApp from "./Components/MusicCommentApp";
import { GlobalStyles } from "./Style/Style";
import { Global } from "@emotion/react";
import Playlist from "./Components/PlayList";

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
    background-color: #ffffff46;
    height: 90%;

    @media (max-width: 480px) {
        width: 95%;
        height: fit-content;
    }
`;

function App() {
    return (
        <>
            <Global styles={GlobalStyles} />
            <Wrapper>
                <Container style={{ width: "20vw" }}></Container>
                <Container>
                    <MusicCommentApp />
                </Container>
                <Container style={{width:"25vw"}}>
                    <Playlist />
                </Container>
            </Wrapper>
        </>
    );
}

export default App;
