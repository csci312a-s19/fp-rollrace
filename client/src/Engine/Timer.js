import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Text = styled.text`
  margin-top: 10px
  font-size: 30px;
`;

const MINUTES = '00';
const SECONDS = '45';

const START_TIME = {
  minutes: MINUTES,
  seconds: SECONDS
};

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, START_TIME, {
      multi: this.props.multi,
      pause: this.props.pause,
      timerCanStart: this.props.timerCanStart,
      restart: this.props.restart
    });

    this.timer = undefined;

    this.tick = this.tick.bind(this);
  }

  tick() {
    //console.log(this.state.restart);
    if (this.state.restart === true) {
      this.setState({ minutes: MINUTES, seconds: SECONDS });
    }
    if (!this.state.pause && this.state.timerCanStart === true) {
      /*
  			function: tick()

  			Each time tick is called the minutes and seconds (state) are updated
  			so that the timer is diplaying in a MM:SS fomrat
  		*/
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
        clearInterval(this.timer);
        this.setState({ minutes: '00', seconds: '00' }); //  render once more with 00:00 on time
        this.props.boot(true); //Let game know that time is up
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

  //Use this method to handle props that are being updated in the parent class
  componentWillReceiveProps(nextProps) {
    const { timerCanStart } = nextProps;
    this.setState({ timerCanStart });
    if (nextProps.pause !== this.props.pause && !this.props.multi) {
      //Perform some operation
      this.setState({ pause: nextProps.pause });
    }
    if (nextProps.restart !== this.props.restart) {
      //Perform some operation
      this.setState({ restart: nextProps.restart });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000); // update the timer once every second
  }

  render() {
    return (
      <Text x={this.props.x + 60} y={this.props.y + 25}>{`${
        this.state.minutes
      }:${this.state.seconds}`}</Text>
    );
  }
}

Timer.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  multi: PropTypes.bool.isRequired,
  pause: PropTypes.bool.isRequired,
  boot: PropTypes.func.isRequired
};

export default Timer;
