// constants for our constants:
// time between rerenders
const RENDER_TIMEOUT = 20;

// Where the sprite first starts
const STARTING_Y = 547;

// constants object for game initialization
export const CONSTANTS = {
  jump: { STOP: 0, UP: 1, DOWN: 2 }, // Jump state enum for clarity
  UPDATE_INTERVAL: 20, // milliseconds between multiplayer updates
  TOOLBAR_Y: 15,
  TOOLBAR_X: 800,
  ICON_X: 40,
  UPDATE_TIMEOUT: 20, // time between motionChange updates
  RENDER_TIMEOUT: RENDER_TIMEOUT, // time between rerenders
  JUMP_SPEED: 0.0013, // acceleration ("gravity") in the game
  JUMP_POWER: 0.7, // jumping velocity
  SCROLL_SPEED: 0.4, // the velocity of the sprite
  SPRITE_SIDE: 100, // size of the invisiable square surrounding the sprite
  PATH_THRESH: 4, // a constant used when finding the end of a path
  TIME_THRESH: RENDER_TIMEOUT, // a constant used in the motionChange update loop
  COUNTDOWN_X: 760, // X position of countdown numbers
  COUNTDOWN_Y: 650, // Y position of countdown numbers
  COUNTDOWN_NUMBERS: ['3', '2', '1', ''], // displayed countdown values
  INITIAL_STATE: {
    countdownIndex: 0, // index of our countdown numbers (where we are in the countdown)
    highscore: '', // current highscore for the current map
    dataSent: false, // indicates if we have sent data (put request) at the end of a game
    wasBooted: false, // indicated whether the game ended due to a boot
    paused: false, // boolean to determine whether or not the game is in the paused state
    endScore: undefined, // score at the completion of the game
    gameover: false, // boolean to determine whether or not the game has ended
    jumpKey: 32, // space bar
    changingKey: false, // boolean to determine whether or not the game is in the key change state
    timerCanStart: false, // prevents timer from starting during countdown
    resetTimer: true, // should we reset the timer after a restart or game start
    y: STARTING_Y, // the current y coordinate of the sprite (upper left corner)
    mapTranslation: 0, // the amount the map is currently translated to the left (interger <= 0)
    hideMenu: false,
    windowHeight: window.innerHeight,
    players: undefined,
    color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() *
      255})` // svg player's color
  },
  INITIAL_VARIABLES: {
    gameStartTime: undefined, // the time the game starts
    x: 200, // this is how far from the left edge of the screen the sprite is
    minY: 1000, // PANIC should loop over all of map or whatever to find this.
    motionChange: undefined, // will take an object of the following form {time: , event: } options for event are block, go, land, and fall
    yStart: STARTING_Y, // a reference point that get's set when the sprite starts moving up or down
    jumpState: 0, // CONSTANTS.jump.STOP === 0 // the current jump state of the game
    jumpStartTime: undefined, // the time a jump begins
    descentStartTime: undefined, // the time a fall begins
    mapTranslationStart: 0, // a reference point that get's set when the sprite starts moving horizontally
    atWall: false, // boolean to determine whether or not the sprite is stopped at a wall
    mapTranslationStartTime: undefined, // the time when the sprite starts moving horizontally
    pauseOffsetStart: undefined, // the time when the pause menu is opened
    timePaused: 0 // the total amount of time the game has spent paused
  }
};
