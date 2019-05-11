import React from 'react';
import Settings from './Settings.js';
import { mount } from 'enzyme';

describe('MapChooser tests', () => {
  const settingsProps = {
    playerColor: 'rgb(120,110,100)',
    playerName: 'guest'
  };
  const goToMenu = jest.fn();
  const selectedName = jest.fn();
  const selectedColor = jest.fn();
  let comp;
  beforeEach(() => {
    comp = mount(
      <Settings
        {...settingsProps}
        goToMenu={goToMenu}
        selectedName={selectedName}
        selectedColor={selectedColor}
      />
    );
  });

  test('Settings contains a go to menu and a save settings button', () => {
    expect(comp.find('.tomenu').exists()).toEqual(true);
    expect(comp.find('.savesettings').exists()).toEqual(true);
  });

  test('Clicking on go to menu opens main menu', () => {
    const gotomenubutton = comp
      .find('.tomenu')
      .filterWhere(n => n.name() === 'button');
    gotomenubutton.simulate('click');
    expect(goToMenu).toHaveBeenCalledTimes(1);
  });
  test('Clicing on save settings uses correct callbacks', () => {
    const savesettingsbutton = comp
      .find('.savesettings')
      .filterWhere(n => n.name() === 'button');
    savesettingsbutton.simulate('click');
    expect(selectedName).toHaveBeenCalledTimes(1);
    expect(selectedColor).toHaveBeenCalledTimes(1);
  });
  test('Clicking on save settings saves name and color of player', () => {
    const savesettingsbutton = comp
      .find('.savesettings')
      .filterWhere(n => n.name() === 'button');
    savesettingsbutton.simulate('click');
    expect(comp.state('nickName')).toEqual('guest');
    expect(comp.state('red')).toEqual('120');
    expect(comp.state('green')).toEqual('110');
    expect(comp.state('blue')).toEqual('100');
  });
});
