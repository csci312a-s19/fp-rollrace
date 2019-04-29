import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Time = styled.div`
  margin: 0 auto;
  text-align: center;
  width: 800px;
`;

const MINUTES = '05';
const SECONDS = '00';

const START_TIME = {
  minutes: MINUTES,
  seconds: SECONDS
};

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, START_TIME, {
      guest: this.props.guest,
      map: this.props.mapName,
      multi: this.props.multi,
      pause: this.props.pause
    });

    this.timer = undefined;

    this.tick = this.tick.bind(this);
  }

  tick() {
    if (!this.state.pause) {
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
    if (nextProps.pause !== this.props.pause && !this.props.multi) {
      //Perform some operation
      this.setState({ pause: nextProps.pause });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000); // update the timer once every second
  }

  render() {
    return <Time>{`${this.state.minutes}:${this.state.seconds}`}</Time>;
  }
}

Timer.propTypes = {
  guest: PropTypes.object,
  mapName: PropTypes.string,
  multi: PropTypes.bool.isRequired,
  pause: PropTypes.bool.isRequired
};

export default Timer;
