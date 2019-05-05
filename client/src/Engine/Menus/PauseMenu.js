import React, { Component } from 'react';
import injectSheet from 'react-jss';
import styles from './PauseMenuStyles';
import styled from 'styled-components';

// adapted css styling from w3schools buttons
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

const RestartButton = styled(StyledButton)`
  background-color: #d10808;
`;

class PauseMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { gameDone: this.props.gameOver };
  }

  //update child component through setState when parent props changes
  componentWillReceiveProps(nextProps) {
    this.setState({ gameDone: nextProps.gameOver });
  }

  render() {
    const { resume, classes, restart, changeKey, goToMenu } = this.props;
    const { gameDone } = this.state;

    // This is ensures that the resume button and changeKey are not rendered when the
    // game is done
    const resumeButton = !gameDone && (
      <StyledButton onClick={resume}>Resume</StyledButton>
    );
    const changekeyButton = !gameDone && (
      <StyledButton onClick={changeKey}> Change Key</StyledButton>
    );
    return (
      <div className={classes.modalOverlay}>
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            {resumeButton}
            <RestartButton onClick={restart}>Restart</RestartButton>
            {changekeyButton}
            <StyledButton onClick={goToMenu}>Main Menu</StyledButton>
          </div>
        </div>
      </div>
    );
  }
}
export default injectSheet(styles)(PauseMenu);
