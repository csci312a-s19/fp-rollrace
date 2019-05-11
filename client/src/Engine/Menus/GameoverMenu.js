import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { StyledModal, ModalStyledButton } from '../../Style/ModalStyle.js';

const StyledP = styled.p`
  text-align: center;
  color: white;
  font-family: 'Gugi', cursive;
`;

export default function GameoverMenu(props) {
  return (
    <ModalProvider>
      <StyledModal isOpen={props.showModal}>
        <StyledP>Game Over!</StyledP>
        {/* only show the current score if the player actually completed the game */}
        {!props.wasBooted && <StyledP>{`Score: ${props.score} sec`}</StyledP>}

        {/* only show the highscore if the player has one on file for the map */}
        {props.highscore !== -1 && (
          <StyledP>{`Highscore: ${props.highscore} sec`}</StyledP>
        )}
        <ModalStyledButton onClick={props.restart}>Restart</ModalStyledButton>
        <ModalStyledButton onClick={props.exitToMenu}>
          Main Menu
        </ModalStyledButton>
      </StyledModal>
    </ModalProvider>
  );
}

GameoverMenu.propTypes = {
  score: PropTypes.number,
  restart: PropTypes.func.isRequired,
  exitToMenu: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired
};
