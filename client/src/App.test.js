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

  test('Starts in main menu with 3 button buttons', () => {
    expect(app).toContainExactlyOneMatchingElement('img[alt="play"]');
    expect(app).toContainExactlyOneMatchingElement('img[alt="settings"]');
    expect(app).toContainExactlyOneMatchingElement('img[alt="stats"]');
  });

  test('Clicking on settings opens settings menu', () => {
    const settingsButton = app.find('img[alt="settings"]');
    expect(settingsButton).toExist();
    settingsButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(Settings);
  });

  test('Clicking on statistics opens statistics menu', () => {
    const statsButton = app.find('img[alt="stats"]');
    expect(statsButton).toExist();
    statsButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(Statistics);
  });
  test('Clicking on play button opens game', () => {
    const playButton = app.find('img[alt="play"]');
    expect(playButton).toExist();
    playButton.simulate('click');
    expect(app).toContainExactlyOneMatchingElement(GameEngine);
  });
});
