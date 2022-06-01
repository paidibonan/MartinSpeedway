class Player {
  constructor(scene) {
      this.scene = scene;

      this.sprite = scene.sprites[PLAYER];

      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = (this.sprite.width/1000)*2;

      this.screen = {x:0, y:0, w:0, h:0};

      this.maxSpeed = (scene.circuit.segmentLength) / (1/60);

      this.speed = 0;
    }

    init() {
      this.screen.w = this.sprite.width;
      this.screen.h = this.sprite.height;

      this.screen.x = SCREEN_CX;
      this.screen.y = SCREEN_H - this.screen.h/2;
    }

    restart() {
      this.x = 0;
      this.y = 0;
      this.z = 0;

      this.speed = this.maxSpeed;
    }

    update(dt) {
      var circuit = this.scene.circuit;

      this.z += this.speed * dt;
      if (this.z >= circuit.roadLength) this.z -= circuit.roadLength;

      this.scene.input.keyboard.on('keydown-A', function(){
        console.log("left press");
        this.x -= 1000;
      })

      var objects = this.scene.powerups.objects;
      objects.forEach((item, i) => {
          console.log("Lane" + item.lane);
          var pointWithObject = this.scene.circuit.segments[item.segmentIndex].point;
          if (pointWithObject.screen.y >= SCREEN_H - 100) {
                if (item.lane == 1) {
                  if (this.x <= -0.3 && this.x >= -0.8) {
                    this.scene.score += item.points;
                    if (item.type == "can") {
                      this.scene.cokeOpen.play();
                    } else {
                      this.scene.dadDipAud.play();
                    }
                    console.log(this.scene.score);
                    objects.splice(i, 1);
                    this.scene.powerups.objectsOnScreen--;
                    scoreText.setText(this.scene.score);
                  }
                }

                if (item.lane == 2) {
                  if (this.x >= -0.2  && this.x <= 0.2) {
                    this.scene.score += item.points;
                    if (item.type == "can") {
                      this.scene.cokeOpen.play();
                    } else {
                      this.scene.dadDipAud.play();
                    }
                    console.log(this.scene.score);
                    objects.splice(i, 1);
                    this.scene.powerups.objectsOnScreen--;
                    scoreText.setText(this.scene.score);
                  }
                }

                if (item.lane == 3) {
                  if (this.x >= 0.3 && this.x <= 0.8) {
                    this.scene.score += item.points;
                    if (item.type == "can") {
                      this.scene.cokeOpen.play();
                    } else {
                      this.scene.dadDipAud.play();
                    }
                    console.log(this.scene.score);
                    objects.splice(i, 1);
                    this.scene.powerups.objectsOnScreen--;
                    scoreText.setText(this.scene.score);
                  }
                }
              }});


    }
}
