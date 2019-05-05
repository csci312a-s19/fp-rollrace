// Jump state enum for clarity
const RENDER_TIMEOUT = 20;
const STARTING_Y = 547;

export const CONSTANTS = {
  jump: { STOP: 0, UP: 1, DOWN: 2 },
  UPDATE_INTERVAL: 20,
  TOOLBAR_Y: 15,
  TOOLBAR_X: 800,
  ICON_X: 40,
  GAMEOVER_X: 9067,
  UPDATE_TIMEOUT: 20,
  RENDER_TIMEOUT: RENDER_TIMEOUT,
  JUMP_SPEED: 0.0013,
  JUMP_POWER: 0.7,
  SCROLL_SPEED: 0.4,
  SPRITE_SIDE: 100,
  PATH_THRESH: 4,
  TIME_THRESH: RENDER_TIMEOUT,
  INITIAL_STATE: {
    score: '',
    dataSent: false,
    tutorial: false,
    paused: false,
    gameover: false,
    jumpKey: 32, // space bar
    startKey: 115, // s key
    changingKey: false,
    timerCanStart: false,
    y: STARTING_Y,
    mapTranslation: 0,
    hideMenu: false,
    windowHeight: window.innerHeight,
    players: undefined,
    color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() *
      255})`
  },
  INITIAL_VARIABLES: {
    gameStartTime: undefined,
    x: 200,
    minY: 1000, // should loop over all of map or whatever to find this.
    // will take an object of the following form {time: , event: } options for event are block, go, land, and fall
    motionChange: undefined,
    yStart: STARTING_Y,
    jumpState: 0, // CONSTANTS.jump.STOP
    jumpStartTime: undefined,
    descendStartTime: undefined,
    mapTranslationStart: 0,
    atWall: false,
    mapTranslationStartTime: undefined,
    pauseOffsetStart: undefined,
    timePaused: 0
  }
};
