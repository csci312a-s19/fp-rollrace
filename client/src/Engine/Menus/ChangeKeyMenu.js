import React, { Component } from 'react';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import StyledModal from './StyledModal.js';
import StyledButton from './StyledButton.js';
import PropTypes from 'prop-types';

const StyledP = styled.p`
  text-align: center;
  color: white;
  font-family: 'Gugi', cursive;
`;

class ChangeKeyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { currentKey: this.props.jumpKey };
  }

  // Give an update if the props change so that the user can see
  // which key they chose before going back to pause menu.

  static getDerivedStateFromProps(props, state) {
    if (props.jumpKey !== state.currentKey) {
      return {
        currentKey: props.jumpKey
      };
    }
    return null;
  }

  render() {
    const { showMenu, jumpKey, showModal } = this.props;
    return (
      <ModalProvider>
        <StyledModal isOpen={showModal}>
          <StyledP>Press New jumpKey</StyledP>
          <StyledP>
            {`Current Key: ${
              jumpKey === 32
                ? 'SPACE'
                : String.fromCharCode(this.state.currentKey).toUpperCase()
            }`}
          </StyledP>
          <StyledButton onClick={showMenu}>Back</StyledButton>
        </StyledModal>
      </ModalProvider>
    );
  }
}

ChangeKeyMenu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  jumpKey: PropTypes.number.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default ChangeKeyMenu;
