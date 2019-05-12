import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuTitle, MenuButton } from '../Style/MenuStyle.js';

import request from 'request-promise-native';
import styled from 'styled-components';

/*
 * class: Lobbies
 *
 * props: chosen (call back)
 *
 * This class serves as an interface into the available
 * lobbies for multiplayer. When the component is mounted
 * there is a request made to /api/lobbies/ that will give
 * list of available lobbies in cards. When a lobby is clicked on
 * the chosen prop will be called with a value of the lobby name
 * this implies that the names of each lobby will be
 *
 */

const Background = styled.div`
  background-color: #323232;
  height: 100%;
`;

const Img = styled.img`
  width: 100%;
  heigh: 50%;
`;

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 2.5%;
  display: inline-block;
  margin-left: 10%;
  height: 80%;
  margin-bottom: 10%;
  color: white;
  background-color: #808080;

  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

const Container = styled.div`
  padding: 2px 16px;
`;

const Div = styled.div`
  padding-top: 2.5%;
  padding-right: 25%;
  padding-left: 25%;
  justify-content: center;
  overflow-y: auto;
  height: 80vh;
`;

class Lobbies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobbies: undefined /* To be filled in after request to server is made */
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.goToMenu();
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
    const maps = ['maps/easy.png', 'maps/medium.png', 'maps/hard.png'];
    if (lobbies !== undefined) {
      cards = lobbies.map((lobby, i) => {
        return (
          <Card
            key={lobby.lName}
            onClick={() => {
              this.props.chosen(lobby.lName, i);
            }}
          >
            <Img alt={'Game maps that can be played in multi'} src={maps[i]} />
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
        <MenuButton className="tomenu" onClick={this.handleClick}>
          {'<-'} Main Menu{' '}
        </MenuButton>
        <MenuTitle> Lobbies </MenuTitle>
        <Div>{cards}</Div>
      </Background>
    );
  }
}

Lobbies.propTypes = {
  chosen: PropTypes.func.isRequired
};

export default Lobbies;
