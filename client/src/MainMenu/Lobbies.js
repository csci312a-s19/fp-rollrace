import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MainButton } from '../Style/MenuStyle.js';
import request from 'request-promise-native';
import styled from 'styled-components';

/*
 * class: Lobbies
 *
 * props: chosen (call back)
 *
 * This class servers as an interface into the available
 * lobbies for multiplayer. When the component is mounted
 * there is a request made to /api/lobbies/ that will give
 * list of available lobbies in cards. When a lobby is clicked on
 * the chosen prop will be called with a value of the lobby name
 * this implies that the names of each lobby will be
 *
 */

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  display: inline-block;
  margin-left: 10%;
  height: 200px;
  margin-top: 20px;
  color: white;
  background-color: #808080;

  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Background = styled.div`
  background-color: #2f2f2f;
  margin: 0px;
  height: 100vh;
`;

const Container = styled.div`
  padding: 2px 16px;
`;

const Div = styled.div`
  // margin-top: 10%;
  // margin-left: 25%;
  // margin-right: 25%;
  padding-top: 10%;
  padding-right: 25%;
  padding-left: 25%;
  justify-content: center;
`;

class Lobbies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobbies: undefined /* To be filled in after request to server is made */,
      maps: undefined
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.goToMenu();
  }

  componentDidMount() {
    const optionsL = {
      /* request to be sent to for active lobbies */
      url: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://rollrace.herokuapp.com'
      }/api/lobbies/`,
      json: true
    };

    const optionsM = {
      /* request to be sent to for active lobbies */
      url: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://rollrace.herokuapp.com'
      }/api/maps/`,
      json: true
    };

    request
      .get(options)
      .then(resp => {
        /* sucessful GET request */
        if (resp.length !== 0) {
          /* there are lobbies to show */
          this.setState({ lobbies: resp });
        }
      })
      .catch(err => {
        /* failed GET request */
        console.log(err);
      });
  }

  render() {
    const { lobbies } = this.state;
    let cards = undefined;
    if (lobbies !== undefined) {
      cards = lobbies.map(lobby => {
        return (
          <Card
            key={lobby.lName}
            onClick={() => {
              this.props.chosen(`/${lobby.lName.toLowerCase()}`);
            }}
          >
            <Container>
              <h4>
                <b>{lobby.lName}</b>
              </h4>
              <p>{`Number of Players: ${lobby.nPlayers}`}</p>
            </Container>
          </Card>
        );
      });
    } else {
      cards = (
        <div>
          <h1>404</h1>
          <p>Sorry, we are having a tough time getting this for you :(</p>
        </div>
      );
    }
    return (
      <Background>
        <Div>{cards}</Div>
        <MainButton className="tomenu" onClick={this.handleClick}>
          {' '}
          Go To Menu{' '}
        </MainButton>
      </Background>
    );
  }
}

Lobbies.propTypes = {
  chosen: PropTypes.func.isRequired
};

export default Lobbies;
