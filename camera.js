class Camera {

  constructor(scene) {
    this.scene = scene;

    this.x = 0;
    this.y = 1000;
    this.z = 0;

    this.distToPlayer = 1000;

    this.distToPlane = null;
  }

  init() {
    this.distToPlane = 1 / (this.y / this.distToPlayer);
  }

  update() {
    var player = this.scene.player;
    var circuit = this.scene.circuit;

    this.x = player.x * circuit.roadWidth;

    this.z = player.z - this.distToPlayer;

    if (this.z < 0) this.z += circuit.roadLength;
  }
}
