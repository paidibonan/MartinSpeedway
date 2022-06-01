class Settings {

  constructor(scene) {
      this.scene = scene;

      var font = {font: '32px Arial', fill: '#000000'};
      this.txtPause = scene.add.text(SCREEN_W - 10, SCREEN_H - 10, '', font);

      this.show();
  }

  show() {
    this.txtPause.text = "[P] Pause";
  }
}
