import React, { Component } from 'react';
import PropTypes from 'prop-types';
import request from 'request-promise-native';
import styled from 'styled-components';

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;

  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Container = styled.div`
  padding: 2px 16px;
`;

class Lobbies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobbies: undefined /* To be filled in after request to server is made */
    };
  }

  componentDidMount() {
    const options = {
      /* request to be sent to for active lobbies */
      url: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://rollrace.herokuapp.com'
      }/api/lobbies/`,
      json: true
    };

    request
      .get(options)
      .then(resp => {
        /* sucessful GET request */
        this.setState({ lobbies: resp });
      })
      .catch(err => {
        /* failed GET request */
        console.log(err);
      });
  }

  render() {
    // const { lobbies } = this.state;
    // const cards = lobbies.map((lobby) => {
    // 	return (
    // 		<Card>
    // 			<Container>
    // 				<h4><b>lobby.lName</b></h4>
    // 				<p>{`Number of Players: ${lobby.nPlayers}`}</p>
    // 			</Container>
    // 		</Card>
    // 	)
    // });
    return <p>Lobbies are here</p>;
  }
}

export default Lobbies;
