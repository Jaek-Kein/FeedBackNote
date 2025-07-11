/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useMusicStore } from "../store/useMusicStore";

const Wrapper = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    font-family: Pretendard;
`;
const Title = styled.h2`
    color: white;
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    height: 650px;
    transform: translateY(10px);

    &::-webkit-scrollbar {
        width: 8px;
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: #ffffff25;
        border-radius: 20px;
    }
`;

const SessionButton = styled.button<{ selected: boolean }>`
    font-family: Pretendard;
    font-size: 16px;
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    background-color: ${({ selected }) =>
        selected ? "#33ff004f" : "transparent"};
    margin-right: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    height: 30px;
    color: white;
    border: none;
    margin-bottom: 5px;
    border-bottom: 1px solid gray;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;
export default function SessionList() {
    const { sessions, currentIndex, switchSession } = useMusicStore();

    return (
        <Wrapper>
            <Title>세션 목록</Title>
            <Container>
                {sessions.map((session, i) => (
                    <SessionButton
                        key={i}
                        onClick={() => switchSession(i)}
                        selected={i === currentIndex}
                    >
                        {session.name}
                    </SessionButton>
                ))}
            </Container>
        </Wrapper>
    );
}
