class Circuit{
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics(0, 0);
    this.texture = scene.add.renderTexture(0, 0, SCREEN_W, SCREEN_H);
    this.segments = [];
    this.segmentLength = 100;
    this.totalSegments = null;
    this.visibleSegments = 200;
    this.rumbleSegments = 5;
    this.roadLanes = 3;
    this.roadWidth = 1000;
    this.roadLength = null;
  }

  create() {
    this.segments = [];
    this.createRoad();
    for (var n = 0; n < this.rumbleSegments; n++) {
      this.segments[n].color.road = '0xFFFFFF';
      this.segments[this.segments.length-1-n].color.road = '0x222222';
    }
    this.totalSegments = this.segments.length;
    this.roadLength = this.totalSegments * this.segmentLength;
  }

  createRoad() {
    this.createSection(300);
  }

  createSection(n) {
    for (var i = 0; i < n; i++) {
      this.createSegment();
    }
  }

  createSegment() {
    const COLORS = {
      LIGHT: {road:'0x888888', grass: '0x429352', rumble: '0xb8312e'},
      DARK: {road: '0x666666', grass: '0x397d46', rumble: '0xDDDDDD', lane: '0xFFFFFF'}
    }

    var n = this.segments.length;

    this.segments.push({
      index: n,
      point: {
        world: {x: 0, y:0, z:n*this.segmentLength},
        screen: {x: 0, y:0, z:0},
        scale: -1
      },

      color: Math.floor(n/this.rumbleSegments)%2 ? COLORS.DARK : COLORS.LIGHT
    })
  }

  getSegment(positionZ) {
    if (positionZ < 0) positionZ+= this.roadLength;
    var index = Math.floor(positionZ / this.segmentLength) % this.totalSegments;
    return this.segments[index];
  }

  render2D(){
    this.graphics.clear();

    var currSegment = this.segments[1];
    var prevSegment = this.segments[0];

    this.project2D(currSegment.point);
    this.project2D(prevSegment.point);

    var p1 = prevSegment.point.screen;
    var p2 = currSegment.point.screen;

    this.drawSegment(
      p1.x, p1.y, p1.w,
      p2.x, p2.y, p2.w,
      currSegment.color
    );
  }

  project2D(point) {
    point.screen.x = SCREEN_CX;
    point.screen.y = SCREEN_H - point.world.z;
    point.screen.w = this.roadWidth;
  }

  render3D(){
    this.graphics.clear();

    var clipBottomLine = SCREEN_H;

    var camera = this.scene.camera;

    var baseSegment = this.getSegment(camera.z);
    var baseIndex = baseSegment.index;

    for (var n = 0; n < this.visibleSegments; n++) {
      var currIndex = (baseIndex + n) % this.totalSegments;
      var currSegment = this.segments[currIndex];

      var offsetZ = (currIndex < baseIndex) ? this.roadLength : 0;

      this.project3D(currSegment.point, camera.x, camera.y, camera.z-offsetZ, camera.distToPlane);

      var currBottomLine = currSegment.point.screen.y;

      if (n > 0 && currBottomLine < clipBottomLine) {
        var prevIndex = (currIndex>0) ? currIndex-1 : this.totalSegments - 1;
        var prevSegment = this.segments[prevIndex];

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen;

        this.drawSegment(
          p1.x, p1.y, p1.w,
          p2.x, p2.y, p2.w,
          currSegment.color
        );

        clipBottomLine = currBottomLine;
      }
    }

    this.texture.clear();

    var player = this.scene.player;
    this.texture.draw(player.sprite, player.screen.x, player.screen.y);

    this.scene.powerups.objects.forEach((item, i) => {
        var segScreen = this.segments[item.segmentIndex].point.screen;
        if (item.lane == 2) {
          this.texture.draw(this.getCorrectSprite(segScreen, item), segScreen.x, segScreen.y);
        } else if (item.lane == 1) {
          this.texture.draw(this.getCorrectSprite(segScreen, item), segScreen.x - ((3 * segScreen.w) /4), segScreen.y);
        } else {
          this.texture.draw(this.getCorrectSprite(segScreen, item), segScreen.x + ((3 * segScreen.w) /4), segScreen.y);
        }
    });

  }

  getCorrectSprite(screen, item) {
      if (screen.y <= SCREEN_CY + 50) {
        return item.spriteSmall;
      } else if (screen.y <= SCREEN_CY + 200) {
        return item.sprite;
      } else {
        return item.spriteLarge;
      }
  }

  project3D(point, cameraX, cameraY, cameraZ, cameraDepth) {
    var transX = point.world.x - cameraX;
    var transY = point.world.y - cameraY;
    var transZ = point.world.z - cameraZ;

    point.scale = cameraDepth/transZ;

    var projectedX = point.scale * transX;
    var projectedY = point.scale * transY;
    var projectedW = point.scale * this.roadWidth;

    point.screen.x = Math.round((1 + projectedX) * SCREEN_CX);
    point.screen.y = Math.round((1 - projectedY) * SCREEN_CY);
    point.screen.w = Math.round(projectedW * SCREEN_CX);
  }

  drawSegment(x1, y1, w1, x2, y2, w2, color) {
    this.graphics.fillStyle(color.grass, 1);
    this.graphics.fillRect(0, y2, SCREEN_W, y1-y2);

    this.drawPolygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, color.road);

    var rumble_w1 = w1/5;
    var rumble_w2 = w2/5;
    this.drawPolygon(x1-w1-rumble_w1, y1, x1-w1, y1, x2-w2, y2, x2-w2-rumble_w2, y2, color.rumble);
    this.drawPolygon(x1+w1+rumble_w1, y1, x1+w1, y1, x2+w2, y2, x2+w2+rumble_w2, y2, color.rumble);

    if (color.lane) {
      var line_w1 = (w1/20) / 2;
      var line_w2 = (w2/20) / 2;

      var lane_w1 = (w1*2) / this.roadLanes;
      var lane_w2 = (w2*2) / this.roadLanes;

      var lane_x1 = x1 - w1;
      var lane_x2 = x2 - w2;

      for (var i=1; i<this.roadLanes; i++) {
        lane_x1 += lane_w1;
        lane_x2 += lane_w2;

        this.drawPolygon(
          lane_x1-line_w1, y1,
          lane_x1+line_w1, y1,
          lane_x2+line_w2, y2,
          lane_x2-line_w2, y2,
          color.lane
        )
      }
    }
  }

  drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    this.graphics.fillStyle(color, 1);
    this.graphics.beginPath();

    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3);
    this.graphics.lineTo(x4, y4);

    this.graphics.closePath();
    this.graphics.fill();
  }
}
