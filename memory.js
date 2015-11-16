'use strict';

/* ------------------------------------------------------------------------- */
var viewport = document.getElementById('viewport');
var menuarea = document.getElementById('menuarea');
var gamearea = document.getElementById('gamearea');
var renderer = PIXI.autoDetectRenderer();
gamearea.appendChild(renderer.view);

window.addEventListener('resize', function () {
  var ratioX = (viewport.clientWidth) / renderer.view.width;
  var ratioY = (viewport.clientHeight - menuarea.clientHeight) / renderer.view.height;
  var ratio  = ratioX <= ratioY ? ratioX : ratioY;
  renderer.view.style.width  = Math.round(renderer.view.width  * ratio) + 'px';
  renderer.view.style.height = Math.round(renderer.view.height * ratio) + 'px';
}, false);

window.dispatchEvent(new Event('resize'));


/* ------------------------------------------------------------------------- */
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}


/* ------------------------------------------------------------------------- */
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/* ------------------------------------------------------------------------- */
var game = {};

game.stage = new PIXI.Stage(0x888888);

game.width  = 3;
game.height = 2;

game.tileset = [];

for (var i=0; i<100; i++) {
  game.tileset[i] = i;
};


/* ------------------------------------------------------------------------- */
game.start = function (w,h) {
  var that = this;

  shuffle(game.tileset);

  game.stage.removeChildren();

  game.width  = w || game.width;
  game.height = h || game.height;

  var w = game.width;
  var h = game.height;
  this.tiles = game.tileset.slice(0, Math.floor(0.5*w*h));
  this.tiles = this.tiles.concat(this.tiles);
  shuffle(this.tiles);

  this.tile1 = null;
  this.tile2 = null;

  for(var i=0; i<w; i++){
    for(var j=0; j<h; j++){
      var tile = PIXI.Sprite.fromImage("assets/back.png");
      var icon = PIXI.Sprite.fromFrame(this.tiles[j*w+i]);
      this.stage.addChild(tile); this.stage.addChild(icon);
      icon.position.x = 16+32+i*80*4; icon.position.y = 16+32+j*80*4;
      tile.position.x = 16+10+i*80*4; tile.position.y = 16+10+j*80*4;
      tile.interactive = true; tile.icon = icon; tile.icon.visible = false;
      tile.click = function () {
        if ((!this.icon.visible) && ((!that.tile1) || (!that.tile2))) {
          if (!that.tile1) {
            that.tile1 = this; this.icon.visible = true; this.visible = false;
          } else {
            that.tile2 = this; this.icon.visible = true; this.visible = false;
            if (that.tile1.icon.texture === that.tile2.icon.texture) {
              window.setTimeout(function () {
                that.tile1.visible = false; that.tile1.icon.visible = false;
                that.tile2.visible = false; that.tile2.icon.visible = false;
                that.tile1 = null; that.tile2 = null;
                renderer.render(game.stage);
              },1000);
            } else {
              window.setTimeout(function () {
                that.tile1.visible = true; that.tile1.icon.visible = false;
                that.tile2.visible = true; that.tile2.icon.visible = false;
                that.tile1 = null; that.tile2 = null;
                renderer.render(game.stage);
              },1000);
            };
          };
        };
      };
    };
  };

  renderer.resize(32+w*80*4,32+h*80*4);
  window.dispatchEvent(new Event('resize'));
  renderer.render(game.stage);

};


/* ------------------------------------------------------------------------- */
game.assets = new PIXI.AssetLoader(["assets/images.json"]);
game.assets.onComplete = function () { game.start(6,4); };
game.assets.load();


/* ------------------------------------------------------------------------- */
window.addEventListener('click', function () {
  renderer.render(game.stage);
}, false);

