'use strict';

angular.module('mcfcHackApp')
  .factory('Pitch', function (PitchShapes, $filter) {
    //////////////////////////
    function _optaToPitchCoords(pos) {
      return {
        x: PitchShapes.PADDING+PitchShapes.WIDTH*pos.x/100,
        y: PitchShapes.PADDING+PitchShapes.HEIGHT*(100-pos.y)/100
      }
    }

    function _scaleCoords(from, to, scale) {
      return {
        x: from.x + (to.x-from.x)*scale,
        y: from.y + (to.y-from.y)*scale
      }
    }

    var YDS = 8;
    var k = 0.2;

    var DEFAULT_ANIMATION_OPTS = {
      playerVelocity: k*7.5*YDS,
      ballVelocity: k*10*YDS
    }

    //////////////////////////
    function Pitch(ctx, players) {
      if(!ctx) {
        throw new Error('A Pitch requires a canvas context');
      }

      this._ctx = ctx;
      this._players = players || [];
      this._passes = [];
      this._dribbles = [];
    }

    Pitch.prototype.draw = function() {
      PitchShapes.reset(this._ctx);
    };

    Pitch.prototype.addPlayers = function(newPlayers) {
      this._players = _.flatten([this._players, newPlayers]);
    };

    Pitch.prototype.replacePlayers = function(newPlayers) {
      this._players = newPlayers;
    };

    Pitch.prototype._drawFrame = function() {
      PitchShapes.reset(this._ctx);
      _.forEach(this._players, function(player) {
        PitchShapes.drawPlayer(this._ctx, _optaToPitchCoords(player.optaPos), false);
      }.bind(this));
    };

    Pitch.prototype.animatePath = function(path) {
      PitchShapes.reset(this._ctx);
      this.path = path;
      this.path.passes = _.map(this.path.passes, function(pass, i) {
        var startPos = _optaToPitchCoords(pass.passer.optaPos);
        var endPos = _optaToPitchCoords(pass.receiver.optaPos);
        var dx = endPos.x - startPos.x;
        var dy = endPos.y - startPos.y;

        pass.complete = 0;
        pass.totalLength = Math.sqrt(dx*dx, dy*dy)/YDS;

        pass.isLast = i === this.path.passes.length-1;
        return pass;
      }.bind(this));

      this._animate(this.path);
    };

    Pitch.prototype._animate = function(path) {
      var self = this;
      var lastTimestamp = 0;
      var start = 0;
      var progress;

      function drawFrame(timestamp) {
        PitchShapes.reset(self._ctx);

        if (!start) {
          start = timestamp;
          console.log('SETTING START TO TIMESTAMP')
          console.log(timestamp, lastTimestamp)
          console.log('dt:' + (timestamp - lastTimestamp))
        }
        var elapsed = timestamp - start;
        var dt = 0.001*(timestamp - lastTimestamp);

        _.forEach(self.path.passes, function(pass, i) {
          var ballMovement = pass.passer.name === pass.receiver.name ?
                             'Dribble' :
                             'Pass';

          if(pass.complete >= 1) {
            // pass is complete, set to 1
            pass.complete = 1;
          } else if(pass.complete > 0) {
            // pass is on going, update
            pass.complete += dt*DEFAULT_ANIMATION_OPTS.playerVelocity/pass.totalLength;

            var stats;

            document.getElementById('passerImg').onerror = function() {
              document.getElementById('passerImg').src = Path.getPlayerImageURL();
            }

            if(ballMovement === 'Dribble') {
              stats = [{
                label: 'Player in possesion',
                value: $filter('playerName')(pass.passer.name)
              }];
            } else {
              stats = [{
                label: 'Passer',
                value: $filter('playerName')(pass.passer.name)
              }, {
                label: 'Receiver',
                value: $filter('playerName')(pass.receiver.name)
              }];
            }

            PitchShapes.updateStats(self._ctx, stats);
            PitchShapes.updatePics(self._ctx, pass, ballMovement);
          } else if(!self.path.passes[i-1] || self.path.passes[i-1].complete >= 1) {
            // pass hasn't started yet
            // start if the previous one is complete or non-existant
            pass.complete += dt*DEFAULT_ANIMATION_OPTS.playerVelocity/pass.totalLength;
          }

          var startPos = _optaToPitchCoords(pass.passer.optaPos);
          var endPos = _optaToPitchCoords(pass.receiver.optaPos);
          endPos = _scaleCoords(startPos, endPos, pass.complete);

          var prevBallMovement = 'Pass';
          if(i) {
            prevBallMovement = self.path.passes[i-1].passer.name === self.path.passes[i-1].receiver.name ? 'Dribble' : 'Pass';
          }
          var playerPos = ballMovement === 'Dribble' ? endPos : startPos;
          
          // only plot the player if the previous ball movement wasn't a dribble
          if(prevBallMovement != 'Dribble') {
            PitchShapes.drawPlayer(self._ctx, playerPos, false);
          }

          if(pass.isLast) {
            PitchShapes.drawPlayer(
              self._ctx,
              _optaToPitchCoords(pass.receiver.optaPos),
              false
            );
          }
          
          PitchShapes['draw'+ballMovement](
            self._ctx,
            startPos,
            endPos
          );

        });

        lastTimestamp = timestamp;

        var animationComplete = self.path.passes.every(function(pass) {
          // console.log(pass.complete)
          return pass.complete === 1;
        });

        if(animationComplete) {
          // self.path.passes = _.map(self.path.passes, function(pass) {
          //   delete pass.complete;
          //   return pass;
          // });
          // delete self.path
          lastTimestamp = 0;
          start = 0;
          console.log('cancelling: '+self._requestId)
          cancelAnimationFrame(self._requestId);
          // console.log('done', self)
        } else {
          requestAnimationFrame(drawFrame);
        }
      }

      self._requestId = requestAnimationFrame(drawFrame);
    }

    return {
      Pitch: Pitch
    };
  });
