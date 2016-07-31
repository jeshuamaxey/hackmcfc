'use strict';

angular.module('mcfcHackApp')
  .factory('PitchShapes', function () {
    // Etihad pitch: 115yd x 74yd
    // Pitch map: 920px x 592px
    // 8px = 1yd
    // home team attacking left -> right
    var YDS = 8;

    var WIDTH = 115*YDS;
    var HEIGHT = 74*YDS;
    var PADDING = 1*YDS;

    var sixYardBox = {
      WIDTH: 6*YDS,
      HEIGHT: 20*YDS
    };

    var eighteenYardBox = {
      WIDTH: 18*YDS,
      HEIGHT: 44*YDS
    };

    var penaltySpot = {
      distance: 12*YDS,
      radius: 0.2*YDS
    };
    var radiusOfTheD = 10*YDS;

    var playerSize = 0.5*YDS;

    function _optaToPitchCoords(pos) {
      return {
        x: PADDING+WIDTH*pos.x/100,
        y: PADDING+HEIGHT*(100-pos.y)/100
      }
    };

    function _clear(ctx) {
      ctx.clearRect(0, 0, WIDTH+2*PADDING, HEIGHT+2*PADDING);
    }

    function _drawPitchOutline(ctx) {
      ctx.strokeStyle = '#fff';

      // perimeter
      ctx.beginPath();
      ctx.strokeRect(PADDING, PADDING, WIDTH, HEIGHT);
      ctx.stroke();
      ctx.closePath();

      // halfway line
      ctx.moveTo(PADDING+WIDTH/2, PADDING);
      ctx.lineTo(PADDING+WIDTH/2, HEIGHT+PADDING);
      ctx.stroke();
      ctx.closePath();

      // center circle
      ctx.beginPath();
      ctx.moveTo(PADDING+10*YDS+WIDTH/2, PADDING+HEIGHT/2);
      ctx.arc(PADDING+WIDTH/2, PADDING+HEIGHT/2, 10*YDS, 0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      // center circle spot
      ctx.beginPath();
      ctx.arc(
        PADDING+WIDTH/2,
        PADDING+HEIGHT/2,
        penaltySpot.radius,
        0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      // home 18 yard box
      ctx.beginPath();
      ctx.strokeRect(
        PADDING,
        PADDING+HEIGHT/2-sixYardBox.HEIGHT/2,
        sixYardBox.WIDTH,
        sixYardBox.HEIGHT);
      ctx.stroke();
      ctx.closePath();

      // home 6 yard box
      ctx.beginPath();
      ctx.strokeRect(
        PADDING,
        PADDING+HEIGHT/2-eighteenYardBox.HEIGHT/2,
        eighteenYardBox.WIDTH,
        eighteenYardBox.HEIGHT);
      ctx.stroke();
      ctx.closePath();
      // home penalty spot
      ctx.beginPath();
      ctx.moveTo(PADDING+penaltySpot.distance+penaltySpot.radius, PADDING+HEIGHT/2);
      ctx.arc(
        PADDING+penaltySpot.distance,
        PADDING+HEIGHT/2,
        penaltySpot.radius,
        0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();
      // home D
      ctx.beginPath();
      ctx.moveTo(PADDING+penaltySpot.distance+radiusOfTheD.radius, PADDING+HEIGHT/2);
      ctx.arc(
        PADDING+penaltySpot.distance,
        PADDING+HEIGHT/2,
        radiusOfTheD,
        -0.29*Math.PI,
        0.29*Math.PI);
      ctx.stroke();
      ctx.closePath();

      // home lhs corner
      ctx.moveTo(PADDING, PADDING);
      ctx.beginPath();
      ctx.arc(
        PADDING,
        PADDING,
        1*YDS,
        0*Math.PI,
        0.5*Math.PI);
      ctx.stroke();
      ctx.closePath();

      // home rhs corner
      ctx.moveTo(PADDING, PADDING+HEIGHT);
      ctx.beginPath();
      ctx.arc(
        PADDING,
        PADDING+HEIGHT,
        1*YDS,
        -0.5*Math.PI,
        0);
      ctx.stroke();
      ctx.closePath();

      // away lhs corner
      ctx.moveTo(PADDING+WIDTH, PADDING);
      ctx.beginPath();
      ctx.arc(
        PADDING+WIDTH,
        PADDING,
        1*YDS,
        0.5*Math.PI,
        1*Math.PI);
      ctx.stroke();
      ctx.closePath();

      // away rhs corner
      ctx.moveTo(PADDING+WIDTH, PADDING+HEIGHT);
      ctx.beginPath();
      ctx.arc(
        PADDING+WIDTH,
        PADDING+HEIGHT,
        1*YDS,
        1*Math.PI,
        1.5*Math.PI);
      ctx.stroke();
      ctx.closePath();

      // away 18 yard box
      ctx.beginPath();
      ctx.strokeRect(
        PADDING+WIDTH-sixYardBox.WIDTH,
        PADDING+HEIGHT/2-sixYardBox.HEIGHT/2,
        sixYardBox.WIDTH,
        sixYardBox.HEIGHT);
      ctx.stroke();
      ctx.closePath();
      // away 6 yard box
      ctx.beginPath();
      ctx.strokeRect(
        PADDING+WIDTH-eighteenYardBox.WIDTH,
        PADDING+HEIGHT/2-eighteenYardBox.HEIGHT/2,
        eighteenYardBox.WIDTH,
        eighteenYardBox.HEIGHT);
      ctx.stroke();
      ctx.closePath();
      // away penalty spot
      ctx.moveTo(PADDING+penaltySpot.distance+penaltySpot.radius, PADDING+HEIGHT/2);
      ctx.beginPath();
      ctx.arc(
        PADDING+WIDTH-penaltySpot.distance,
        PADDING+HEIGHT/2,
        penaltySpot.radius,
        0, 2*Math.PI, true);
      ctx.stroke();
      ctx.closePath();
      // away D
      ctx.beginPath();
      ctx.moveTo(PADDING+penaltySpot.distance+radiusOfTheD.radius, PADDING+HEIGHT/2);
      ctx.arc(
        PADDING+WIDTH-penaltySpot.distance,
        PADDING+HEIGHT/2,
        radiusOfTheD,
        Math.PI-0.29*Math.PI,
        Math.PI+0.29*Math.PI);
      ctx.stroke();
      ctx.closePath();
    };

    function reset(ctx) {
      _clear(ctx);
      _drawPitchOutline(ctx);
    }

    function drawPlayer(ctx, pos, away) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.arc(
        pos.x,
        pos.y,
        playerSize,
        0, 2*Math.PI, true);
      ctx.fillStyle = away ? '#f00' : 'rgb(135, 206, 235)';
      ctx.fill();
      ctx.closePath();
    }

    function updateStats(ctx, stats) {
      var lineHeight = 20;
      _.forEach(stats, function(stat, i) {
        var lineOfText = stat.label + ': ' + stat.value;
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(lineOfText, 2*PADDING, 4*PADDING+i*lineHeight);
      });
    }

    function updatePics(ctx, pass, ballMovement) {
      var pUrl = '/assets/images/players/' + pass.passer.name + '.png';
      var rUrl = '/assets/images/players/' + pass.receiver.name + '.png';
      var blankUrl = '/assets/images/players/blank.png';

      var dim = {w: 200, h: 150}

      var passerImage = document.getElementById('passerImg');
      passerImage.onerror = function() {
        document.getElementById('passerImg').src = blankUrl;
      }
      passerImage.src = pUrl;
      ctx.drawImage(passerImage, 2*PADDING, 8*PADDING, dim.w, dim.h);
      
      if(ballMovement === 'Pass') {
        var receiverImage = document.getElementById('receiverImg')
        receiverImage.onerror = function() {
          document.getElementById('receiverImg').src = blankUrl;
        }
        receiverImage.src = rUrl;
        ctx.drawImage(receiverImage, 4*PADDING+dim.w, 8*PADDING, dim.w, dim.h);
      }
    }

    function drawDribble(ctx, from, to) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.setLineDash([YDS, YDS])
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([0])
    }

    function drawPass(ctx, from, to) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.closePath(); 
    }

    function drawPath(ctx, path) {
      _.forEach(path.passes, function(pass) {
        var pos = _optaToPitchCoords(pass.passer.optaPos);
        drawPlayer(ctx, pos);
        if(pass.passer.name === pass.receiver.name) {
          // plot a dribble
          drawDribble(ctx, pos, _optaToPitchCoords(pass.receiver.optaPos));
        } else {
          // plot a pass
          drawPass(ctx, pos, _optaToPitchCoords(pass.receiver.optaPos));
        }
      });
    };

    // Public API here
    return {
      reset: reset,
      drawPath: drawPath,
      drawPass: drawPass,
      drawDribble: drawDribble,
      drawPlayer: drawPlayer,
      updateStats: updateStats,
      updatePics: updatePics, 
      WIDTH: WIDTH,
      HEIGHT: HEIGHT,
      PADDING: PADDING
    };
  });
