import styled from "@emotion/styled";
import MusicCommentApp from "./Components/MusicCommentApp";
import { GlobalStyles } from "./Style/Style";
import { Global } from "@emotion/react";


const Wrapper = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E9e5e3;
`;

const Container = styled.div`
  width: 50%;
  height: 98%;
  border-radius: 10px;
  box-shadow: 0px 5px 20px gray;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`

function App(){
  return (
  <>
  <Global styles={GlobalStyles} />
    <Wrapper>
      <Container>
        <MusicCommentApp />
      </Container>
    </Wrapper>
  </>
  );
}


export default App;
