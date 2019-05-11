import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Form, Input } from 'reactstrap';
import styled from 'styled-components';
import {
  MenuBackground,
  MenuTitle,
  MainButton,
  MenuText
} from '../Style/MenuStyle.js';

const SettingsOption = styled.div`
  padding-top: 5%;
  padding-bottom: 5%;
  background-color: #323232;
  margin-left: 2%;
  margin-right: 2%;
`;

const ColorLabel = styled.div`
  display: inline-block;
  width: 30%;
  text-align: left;
  color: white;
`;

const LabeledSlider = props => {
  return (
    <div>
      <ColorLabel>{props.label}:</ColorLabel>
      <input
        type="range"
        min="0"
        max="255"
        step="1"
        value={props.value}
        onChange={event => props.valueChange(parseInt(event.target.value, 10))}
      />
    </div>
  );
};

LabeledSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  valueChange: PropTypes.func.isRequired
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      red: this.findColor(0),
      green: this.findColor(1),
      blue: this.findColor(2),
      nickName: 'dog'
    };
    this.handleClick = this.handleClick.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.selectName = this.selectName.bind(this);
    this.findColor = this.findColor.bind(this);
  }
  //uses playercolor prop passed down from app to find
  //corresponding red,green,blue values for the sliders
  findColor(i) {
    const color = this.props.playerColor;
    const rgb = color.match(/\d+/g);
    return rgb[i];
  }

  //handles go to menu button
  handleClick() {
    this.props.goToMenu();
  }

  //updates nickname state everytime something is typed
  selectName(event) {
    this.setState({ nickName: event.target.value });
  }

  //passes down nickname and color that are chosen when clicked on
  //save settings
  saveSettings() {
    const color = `rgb(${this.state.red},${this.state.green},${
      this.state.blue
    })`;
    this.props.selectedColor(color);
    if (this.state.nickName === null) {
      this.setState({ nickName: ' ' });
    }
    this.props.selectedName(this.state.nickName);
  }
  componentDidMount() {
    const tempName = this.props.playerName;
    this.setState({ nickName: tempName });
  }

  render() {
    return (
      <MenuBackground>
        <MenuTitle> Settings </MenuTitle>
        <MainButton className="tomenu" onClick={this.handleClick}>
          {'<-'} Main Menu
        </MainButton>
        <Row>
          <SettingsOption>
            <MenuText> Choose Your Color </MenuText>
            <svg height="100" width="100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="white"
                strokeWidth="1"
                fill={`rgb(${this.state.red},${this.state.green},${
                  this.state.blue
                })`}
              />
            </svg>
            <LabeledSlider
              label="Red"
              value={this.state.red}
              valueChange={value => {
                this.setState({ red: value });
              }}
            />
            <LabeledSlider
              label="Green"
              value={this.state.green}
              valueChange={value => {
                this.setState({ green: value });
              }}
            />
            <LabeledSlider
              label="Blue"
              value={this.state.blue}
              valueChange={value => {
                this.setState({ blue: value });
              }}
            />
          </SettingsOption>
          <SettingsOption>
            <MenuText> Choose Your Nickname </MenuText>
            <Form>
              <Input
                type="text"
                onChange={this.selectName}
                maxLength="13"
                defaultValue={this.props.playerName}
              />
            </Form>
          </SettingsOption>
        </Row>
        <MainButton className="savesettings" onClick={this.saveSettings}>
          {' '}
          Save Settings{' '}
        </MainButton>
      </MenuBackground>
    );
  }
}

Settings.propTypes = {
  playerName: PropTypes.string.isRequired,
  playerColor: PropTypes.string.isRequired,
  selectedColor: PropTypes.func.isRequired,
  selectedName: PropTypes.func.isRequired,
  goToMenu: PropTypes.func.isRequired
};

export default Settings;
