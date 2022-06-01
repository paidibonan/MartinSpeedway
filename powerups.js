class Powerups {

  constructor(scene) {
    this.scene = scene;
    this.objects = [];
    this.objectsOnScreen = 0;

    let seed = Date.now();
    this.random = new Phaser.Math.RandomDataGenerator(seed);
  }

  update(dt) {
    if (this.objectsOnScreen < 5) {
        var randomInt = this.random.integerInRange(1, 20);
        if (randomInt <= 6) {
          this.spawnNewCoke(randomInt);
        } else if (randomInt <= 9) {
          this.spawnNewDaddyDip(randomInt);
        }
    }
  }

  spawnNewCoke(lane) {
    var circuit = this.scene.circuit;
    var baseSegment = circuit.getSegment(this.scene.camera.z);
    var baseIndex = baseSegment.index;
    var laneNumber = (lane % 3) + 1;

    this.objects.push({
      type: "can",
      spriteSmall: this.scene.sprites[6],
      sprite: this.scene.sprites[7],
      spriteLarge: this.scene.sprites[8],
      lane: laneNumber,
      segmentIndex: (baseIndex + circuit.visibleSegments) % circuit.totalSegments,
      points: 100
    })
    this.objectsOnScreen++;
  }

  spawnNewDaddyDip(lane) {
    var circuit = this.scene.circuit;
    var baseSegment = circuit.getSegment(this.scene.camera.z);
    var baseIndex = baseSegment.index;
    var laneNumber = (lane % 3) + 1;

    this.objects.push({
      type: "dip",
      spriteSmall: this.scene.sprites[9],
      sprite: this.scene.sprites[10],
      spriteLarge: this.scene.sprites[11],
      lane: laneNumber,
      segmentIndex: (baseIndex + circuit.visibleSegments) % circuit.totalSegments,
      points: 500
    })
    this.objectsOnScreen++;
  }
}
