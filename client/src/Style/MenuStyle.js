import styled from 'styled-components';

export const MenuTitle = styled.h1`
  font-family: 'Gugi', cursive;
  font-size: 600%;
  color: white;
`;

export const MenuBackground = styled.div`
  background-color: #323232;
  height: 100vh;
`;

export const MenuButton = styled.button`
  background-color: #008cba;
  font-size: 125%;
  border-radius: 15%;
  border: 2px solid #555555;
  font-family: monospace;
  &:hover {
    background-color: #02a8de;
  }
`;

export const MenuText = styled.h3`
  font-family: 'Gugi', cursive;
  margin-top: 2.5%;
  font-size: 200%;
  color: white;
`;

export const MainButton = styled.button`
  background-color: #008cba;
  font-size: 250%;
  border-radius: 15%;
  border: 2px solid #555555;
  font-family: monospace;
  &:hover {
    background-color: #02a8de;
  }
`;

export const ClearMainButton = styled.button`
  background-color: Transparent;
  border: none;
  font-size: 250%;
  color: #323232; /* this is the same as the menu background */
`;
