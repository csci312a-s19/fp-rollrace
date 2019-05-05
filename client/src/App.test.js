import React from 'react';
import App from './App';
import { mount } from 'enzyme';
import Settings from './MainMenu/Settings.js';
import Statistics from './MainMenu/Statistics.js';
import GameEngine from './Engine/GameEngine.js';

describe('Main Menu rendering tests', () => {
  let app;
  beforeEach(async () => {
    app = mount(<App />);
    app.setState({ mode: 'menu' });
  });

  test('Starts in main menu with 4 button buttons', () => {
    expect(app).toContainExactlyOneMatchingElement('.settings');
    expect(app).toContainExactlyOneMatchingElement('.stats');
    expect(app).toContainExactlyOneMatchingElement('.single');
    expect(app).toContainExactlyOneMatchingElement('.multi');
  });

  test('Clicking on settings opens settings menu', () => {
    const settingsButton = app.find('.settings');
    expect(settingsButton).toExist();
    settingsButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(Settings);
  });

  test('Clicking on statistics opens statistics menu', () => {
    const statsButton = app.find('.stats');
    expect(statsButton).toExist();
    statsButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(Statistics);
  });
  test('Clicking on play button opens game', () => {
    const playButton = app.find('.single');
    expect(playButton).toExist();
    playButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(GameEngine);
  });
});
