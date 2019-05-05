import React, { Component } from 'react';
import injectSheet from 'react-jss';
import styles from './PauseMenuStyles';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 20px;
  box-shadow: 0 9px #999;
  margin: 15px;
  width:80%;

 :hover {background-color: #3e8e41}
 :active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
`;

const StyledP = styled.p`
  text-align: center;
`;

class ChangeKeyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { currentKey: this.props.jumpKey };
  }

  // Give an update if the props change so that the user can see
  // which key they chose before going back to pause menu.
  componentWillReceiveProps(nextProps) {
    this.setState({ currentKey: nextProps.jumpKey });
  }

  render() {
    const { classes, showMenu, jumpKey } = this.props;
    return (
      <div className={classes.modalOverlay}>
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            <StyledP>Press New jumpKey</StyledP>
            <StyledP>
              {`Current Key: ${
                jumpKey === 32
                  ? 'SPACE'
                  : String.fromCharCode(this.state.currentKey).toUpperCase()
              }`}
            </StyledP>
            <StyledButton onClick={showMenu}>Previous Menu</StyledButton>
          </div>
        </div>
      </div>
    );
  }
}
export default injectSheet(styles)(ChangeKeyMenu);
