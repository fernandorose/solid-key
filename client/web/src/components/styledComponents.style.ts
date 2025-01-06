import styled from "styled-components";

export const Input = styled.input`
  font-family: var(--mono-font);
  font-size: 0.8rem;
  border: solid 1px #00000011;
  padding: 10px;
  border-radius: 5px;
  transition: 300ms;
  &:focus {
    border: solid 1px var(--accent-color);
    box-shadow: 0 5px 10px rgb(241, 241, 241);
  }
  &::placeholder {
    color: #00000044;
  }
`;

export const Button = styled.button`
  padding: 10px;
  color: #fff;
  background: #000;
  border: 1px solid #000000;
  //box-shadow: inset 0px 2px 0px rgba(255, 255, 255, 0.46);
  border-radius: 5px;
  transition: 300ms;
`;

export const Logout = styled.button`
  width: 100%;
  padding: 5px;
  color: #fff;
  background: var(--alert-color);
  border: 1px solid var(--alert-color);
  border-radius: 5px;
  transition: 300ms;
  font-family: var(--mono-font-2);
  font-size: 0.85rem;
`;
