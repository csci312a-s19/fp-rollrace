import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SVGText } from '../Style/EngineStyle.js';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minutes: this.props.startTime.minutes,
      seconds: this.props.startTime.seconds
    };

    this.tickInterval = undefined;
    this.tick = this.tick.bind(this);
  }

  /*
   * Each time tick is called the minutes and seconds (state) are updated
   * so that the timer is diplaying in a MM:SS format
   */
  tick() {
    if (this.props.resetTimer) {
      this.setState({
        minutes: this.props.startTime.minutes,
        seconds: this.props.startTime.seconds
      });
    }
    if (!this.props.paused && this.props.timerCanStart) {
      const { minutes, seconds } = this.state; // curr minutes and seconds
      let resMinutes; // store resulting minutes
      let resSeconds; // store resulting seconds
      let intMin = parseInt(minutes, 10);
      let intSec = parseInt(seconds, 10);

      --intSec;

      if (intSec < 0) {
        // the seconds was previously 0 so reset to 59
        intSec = 59;
      }

      if (intSec < 10) {
        // singe digit, seconds need 0 in 10's place
        resSeconds = `0${intSec}`;
      } else {
        resSeconds = `${intSec}`;
      }

      if (intMin === 0 && intSec === 0) {
        // stop ticking when there is no more time left
        clearInterval(this.tickInterval);
        this.setState({ minutes: '00', seconds: '00' }); //  render once more with 00:00 on time
        this.props.handleBoot(true); //Let game know that time is up and set booted state to true
        return;
      }

      if (intMin === 0) {
        // there are 00 minutes left
        resMinutes = '00';
      } else {
        // there is at least one minute
        if (intSec === 59) {
          // seconds was 0 and reset so minute is decremented
          --intMin;
        }

        if (intMin < 10) {
          // single digit, minutes needs 0 in tens place
          resMinutes = `0${intMin}`;
        } else {
          resMinutes = `${intMin}`;
        }
      }

      this.setState({ minutes: resMinutes, seconds: resSeconds });
    }
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  componentDidMount() {
    this.tickInterval = setInterval(this.tick, 1000); // update the timer once every second
  }

  render() {
    return (
      <SVGText fill={'white'} x={this.props.x + 105} y={this.props.y + 25}>
        {`${this.state.minutes}:${this.state.seconds}`}
      </SVGText>
    );
  }
}

Timer.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  startTime: PropTypes.object.isRequired,
  timerCanStart: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  resetTimer: PropTypes.bool.isRequired,
  handleBoot: PropTypes.func.isRequired
};

export default Timer;
