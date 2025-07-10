import { css } from "@emotion/react";

export const GlobalStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Chiron+Sung+HK:ital,wght@0,200..900;1,200..900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Dongle&display=swap");
  
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    max-width: 100vw;
    max-height: 100vh;
  }

  input:focus,
  textarea:focus,
  button:focus,
  select:focus,
  a:focus {
    outline: none;
    box-shadow: none;
  }

  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
`;