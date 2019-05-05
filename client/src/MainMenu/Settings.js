import React, { Component } from 'react';
import PropTypes from 'prop-types';
import settings from './buttonSVGs/settings.svg';
import return2menu from './buttonSVGs/return2menu.svg';
import styled from 'styled-components';

const ColorLabel = styled.div`
  display: inline-block;
  width: 50px;
  text-align: left;
  margin: auto;
`;
const StyledButton = styled.img`
  display: block;
  margin: auto;
  float: right;
`;
const StyledCircle = styled.circle`
  margin: auto;
  display: center;
`;

function LabeledSlider(props) {
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
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { red: 0, green: 0, blue: 0 };
    this.handleClick = this.handleClick.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.makeColor = this.makeColor.bind(this);
  }
  handleClick() {
    this.props.goToMenu();
  }

  selectColor() {
    const color = `rgb(${this.state.red},${this.state.green},${
      this.state.blue
    })`;
    this.props.selectedColor(color);
  }

  makeColor() {
    const color = `rgb(${this.state.red},${this.state.green},${
      this.state.blue
    })`;
    return color;
  }

  render() {
    return (
      <div>
        <img src={settings} className="settingslogo" alt="settings" />
        <div>
          <svg height="100" width="100">
            <StyledCircle
              cx="50"
              cy="50"
              r="40"
              stroke="black"
              stroke-width="1"
              fill={this.makeColor()}
            />
          </svg>
          <StyledButton
            src={return2menu}
            height="50"
            className="2menubutton"
            alt="2menu"
            onClick={this.handleClick}
          />
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
          <button onClick={this.selectColor}> Select Color </button>
        </div>
      </div>
    );
  }
}
LabeledSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  valueChange: PropTypes.func.isRequired
};

Settings.propTypes = {
  goToMenu: PropTypes.func.isRequired
};

export default Settings;
