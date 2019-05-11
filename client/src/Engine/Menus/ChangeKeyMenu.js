import React, { Component } from 'react';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import PropTypes from 'prop-types';
import { StyledModal, ModalStyledButton } from '../../Style/ModalStyle.js';

const StyledP = styled.p`
  text-align: center;
  color: white;
  font-family: 'Gugi', cursive;
`;

class ChangeKeyMenu extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      jumpKey: undefined
    };
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    document.body.addEventListener('keypress', e => this.handleKeyChange(e));
  }

  handleExit() {
    const newKey = this.state.jumpKey;
    this.props.goBack(newKey);
  }

  handleKeyChange(event) {
    if (this._isMounted) {
      this.setState({ jumpKey: event.keyCode });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('keypress', e => this.handleKeyChange(e));
    this._isMounted = false;
  }

  render() {
    const { showModal, currentKey } = this.props;
    const { jumpKey } = this.state;
    return (
      <ModalProvider>
        <StyledModal isOpen={showModal}>
          <StyledP>Press New jumpKey</StyledP>
          <StyledP>
            {`Current Key: ${
              currentKey === 32
                ? 'SPACE'
                : String.fromCharCode(currentKey).toUpperCase()
            }`}
          </StyledP>
          {jumpKey && (
            <StyledP>
              {`Selected Key: ${
                jumpKey === 32
                  ? 'SPACE'
                  : String.fromCharCode(jumpKey).toUpperCase()
              }`}
            </StyledP>
          )}
          <ModalStyledButton onClick={this.handleExit}>Back</ModalStyledButton>
        </StyledModal>
      </ModalProvider>
    );
  }
}

ChangeKeyMenu.propTypes = {
  goBack: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default ChangeKeyMenu;
