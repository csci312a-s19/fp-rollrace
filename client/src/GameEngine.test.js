import React from 'react';
import { mount } from 'enzyme';
import App from './App.js';
import GameEngine from './GameEngine.js';
//import ChangeKeyMenu from './menus/ChangeKeyMenu.js';
import Timer from './Timer.js';
//import Map from './Map.js';
//import Tutorial from './Tutorial.js';
//import GameOverMenu from './menus/GameOverMenu.js';
//import PauseMenu from './menus/PauseMenu.js';

describe('Game Engine Menu Rendering Tests', () => {
  let app, game;

  beforeEach(async () => {
    app = mount(<App />);
    app.setState({ mode: 'game' });
    game = app.find(GameEngine);
  });

  test('Game exists', () => {
    expect(app).toContainExactlyOneMatchingElement(GameEngine);
  });

  test('Pause, tutorial, and icon exist', () => {
    expect(game).toContainExactlyOneMatchingElement(Timer);
    expect(game).toContainExactlyOneMatchingElement('.tutorial');
    expect(game).toContainExactlyOneMatchingElement('.pauseButton');
  });

  test('Pause button and resume works', () => {
    const pauseButton = game.find('.pauseButton');
    expect(pauseButton).toExist();

    /*
    //jest.useFakeTimers();
    jest.runOnlyPendingTimers();
    //setTimeout(() => {
      pauseButton.simulate('click');
      expect(game).toContainExactlyOneMatchingElement(PauseMenu);
      const menu = game.find(PauseMenu);
      expect(menu).toContainMatchingElements(2, '.resume');
      const resume = menu.find(".resume");
      resume.simulate('click');
      expect(game).not.toContainExactlyOneMatchingElement(PauseMenu);
      done();
    //}, 5000);

    jest.runAllTimers(3001);
    jest.useRealTimers();
    */
  });
});
