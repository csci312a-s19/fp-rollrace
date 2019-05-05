import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Text = styled.text`
  margin-top: 10px
  font-size: 30px;
`;

export default function CurrBestTime(props) {
  return (
    <Text x={props.x + 700} y={props.y + 25}>{`Current Best: ${
      props.score
    } sec`}</Text>
  );
}

CurrBestTime.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired
};
