import styled from "styled-components";

export const Input = styled.input`
  font-family: var(--mono-font);
  font-size: 0.8rem;
  border: solid 1px #00000011;
  padding: 10px;
  border-radius: 5px;
  &::placeholder {
    color: #00000044;
  }
`;

export const Button = styled.button`
  padding: 10px;
  color: #fff;
  background: radial-gradient(67.36% 100% at 50% 0%, #4a4a4a 0%, #000000 100%);
  border: 1px solid #000000;
  box-shadow: inset 0px 2px 0px rgba(255, 255, 255, 0.27);
  border-radius: 5px;
`;
