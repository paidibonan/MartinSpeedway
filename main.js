const SCREEN_W = 1920;
const SCREEN_H = 1080;

const SCREEN_CX = SCREEN_W/2;
const SCREEN_CY = SCREEN_H/2;

const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;

const PLAYER = 0;

var state = STATE_INIT;
var score = 0;
var scoreText;
var tutorialText;
var startText;
var goalText;

var timCreditText;
var hanCreditText;
var goBlueText;
var pedotText;
var martinMngmtText;
var weLoveYouText;

var shownCountdown = false;
var showThree = true;
var showTwo = true;
var showOne = true;
var showGo = true;
var startCreditsSong = true;
var startMainSong = true;

class MainScene extends Phaser.Scene {
  constructor() {
    super({key: 'SceneMain'});
  }

  preload() {
    this.load.image('background', 'images/blue_large.png');
    this.load.image('player', 'images/daddytruck.png');
    this.load.image('title', 'images/title.png');
    this.load.image('three', 'images/3.png');
    this.load.image('two', 'images/2.png');
    this.load.image('one', 'images/1.png');
    this.load.image('go', 'images/go.png');
    this.load.audio('mainMusic', 'audio/Boss002.wav');
    this.load.image('can', 'images/coke_z_can.png');
    this.load.audio('cokeOpen', 'audio/sipp.wav');
    this.load.image('dip', 'images/daddyDip.png');
    this.load.audio('dadDipAud', 'audio/mm_dadydip.wav');
    this.load.image('canSmall', 'images/coke_z_can_small.png');
    this.load.image('canLarge', 'images/coke_z_can_large.png');
    this.load.image('dipSmall', 'images/daddyDip_small.png');
    this.load.image('dipLarge', 'images/daddyDip_large.png');
  }

  create() {
    this.sprBackground = this.add.image(SCREEN_CX, SCREEN_CY, 'background');
    this.mainMusic = this.sound.add('mainMusic', {loop: true});
    this.cokeOpen = this.sound.add('cokeOpen', {loop: false});
    this.dadDipAud = this.sound.add('dadDipAud', {loop: false});

    this.sprites = [
      this.add.image(0, 0, 'player').setVisible(false),
      this.add.image(SCREEN_CX, SCREEN_CY, 'title'),
      this.add.image(SCREEN_CX, SCREEN_CY, 'three').setVisible(false),
      this.add.image(SCREEN_CX, SCREEN_CY, 'two').setVisible(false),
      this.add.image(SCREEN_CX, SCREEN_CY, 'one').setVisible(false),
      this.add.image(SCREEN_CX, SCREEN_CY, 'go').setVisible(false),
      this.add.image(0,0, 'canSmall').setVisible(false), //6
      this.add.image(0,0, 'can').setVisible(false), //7
      this.add.image(0,0, 'canLarge').setVisible(false), //8
      this.add.image(0,0, 'dipSmall').setVisible(false), //9
      this.add.image(0,0, 'dip').setVisible(false), //10
      this.add.image(0,0, 'dipLarge').setVisible(false), //11
    ]

    scoreText = this.add.text(SCREEN_W - 200, 100, score, {fontSize: '50px'}).setVisible(false);
    tutorialText = this.add.text(SCREEN_CX - 350, SCREEN_CY + 300, "press D and A to move", {fontSize: '60px'});
    startText = this.add.text(SCREEN_CX - 400, SCREEN_CY + 350, "press space bar to begin", {fontSize: '60px'});
    goalText = this.add.text(SCREEN_CX - 310, SCREEN_CY + 400, "score 6000 to win!", {fontSize: '60px'});

    this.settings = new Settings(this);
    this.circuit = new Circuit(this);
    this.camera = new Camera(this);
    this.player = new Player(this);
    this.powerups = new Powerups(this);

    this.input.keyboard.on('keydown-P', function(){
      this.settings.txtPause.text = "[P] Resume";
      this.scene.pause();
      this.scene.launch('ScenePause');
    }, this);

    this.events.on('resume', function(){
      this.settings.show();
    }, this);

    this.input.keyboard.on('keydown-A', function(){
      this.player.x -= 0.05;
    }, this);

    this.input.keyboard.on('keydown-D', function(){
      this.player.x += 0.05;
    }, this);

    this.input.keyboard.on('keydown-SPACE', function(){
      if (state == STATE_INIT) state = STATE_RESTART;
    }, this);

  }

  update(time, delta) {
    switch(state) {
      case STATE_INIT:
        this.circuit.create();
        this.camera.init();
        this.player.init();
        this.score = 0;
        if(startMainSong) {
          this.mainMusic.play();
          startMainSong = false;
        }
        break;
      case STATE_RESTART:
        this.player.restart();
        this.sprites[1].setVisible(false);
        tutorialText.setVisible(false);
        startText.setVisible(false);
        goalText.setVisible(false);
        this.camera.update();
        if (showThree) this.sprites[2].setVisible(true);
        showThree = false;
        if (!shownCountdown) {
          shownCountdown = true;
          this.time.delayedCall(1000, ()=> {
              this.sprites[2].setVisible(false);
            })
        this.time.delayedCall(1000, ()=> {
            if (showTwo) {
              this.sprites[3].setVisible(true);
              showTwo = false;
            }
        })
        this.time.delayedCall(2000, ()=> {
            this.sprites[3].setVisible(false);
          })
        this.time.delayedCall(2000, ()=> {
            if (showOne) {
              this.sprites[4].setVisible(true);
              showOne = false;
            }
        })
        this.time.delayedCall(3000, ()=> {
            this.sprites[4].setVisible(false);
          })
        this.time.delayedCall(3000, ()=> {
            if (showGo) {
              this.sprites[5].setVisible(true);
              showGo = false;
            }
        })
        this.time.delayedCall(4000, ()=> {
            this.sprites[5].setVisible(false);
        })
        this.time.delayedCall(4000, ()=> {
            state = STATE_PLAY;
        })
      }
        break;
      case STATE_PLAY:
        scoreText.setVisible(true);
        var dt = Math.min(1, delta/1000);
        this.powerups.update();
        this.circuit.render3D();
        this.camera.update();
        this.player.update(dt);
        if(this.score >= 6000) state = STATE_GAMEOVER
        break;
      case STATE_GAMEOVER:
        this.mainMusic.stop();
        this.scene.launch('SceneCredits');
    }
  }
}

class PauseScene extends Phaser.Scene {
  constructor() {
    super({key: 'ScenePause'});
  }

  create() {
    this.input.keyboard.on('keydown-P', function(){
      this.scene.resume('SceneMain');
      this.scene.stop();
    }, this);
  }
}

class CreditsScene extends Phaser.Scene {
  constructor() {
    super({key: 'SceneCredits'});
  }

    preload() {
      this.load.audio('creditsMusic', 'audio/loading.wav');
      this.load.image('happyBday', 'images/happyBirthday.png');
    }

    create() {
      this.creditsMusic = this.sound.add('creditsMusic', {loop: true});
      this.hapBday = this.add.image(SCREEN_CX, SCREEN_CY - 100, 'happyBday');

      timCreditText = this.add.text(100, SCREEN_CY + 100, "music by Scüter", {fontSize: '50px'});
      timCreditText.setStroke('#000000', 6);
      hanCreditText = this.add.text(100, SCREEN_CY + 150, "engineering by Paidi", {fontSize: '50px'});
      hanCreditText.setStroke('#000000', 6);
      goBlueText = this.add.text(100, SCREEN_CY + 250, "osu sucks", {fontSize: '50px'});
      goBlueText.setStroke('#000000', 6);
      pedotText = this.add.text(100, SCREEN_CY + 300, "no pedot molecules were harmed in the making of this game", {fontSize: '50px'});
      pedotText.setStroke('#000000', 6);
      martinMngmtText = this.add.text(100, SCREEN_CY + 350, "sponsered my martin management", {fontSize: '50px'});
      martinMngmtText.setStroke('#000000', 6);
      weLoveYouText = this.add.text(100, SCREEN_CY + 400, "we love you dad!", {fontSize: '50px'});
      weLoveYouText.setStroke('#000000', 6);
      if (startCreditsSong) {
        this.creditsMusic.play();
        startCreditsSong = false;
      }
    }
  }


var config = {
  type: Phaser.AUTO,
  width: SCREEN_W,
  height: SCREEN_H,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: [MainScene, PauseScene, CreditsScene]
};

var game = new Phaser.Game(config);
