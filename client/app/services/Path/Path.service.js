'use strict';

angular.module('mcfcHackApp')
  .factory('Path', function ($resource, PitchShapes) {
    /////////////////////////////////
    function _optaToPitchCoords(pos) {
      return {
        x: PitchShapes.PADDING+PitchShapes.WIDTH*pos.x/100,
        y: PitchShapes.PADDING+PitchShapes.HEIGHT*(100-pos.y)/100
      }
    }
    /////////////////////////////////

    var api = $resource('api/paths/:pathId', {pathId:'@_id'});

    api.getPlayerList = function(path) {
      var players = _.chain(path.passes)
                         .map('passer')
                         .uniq('name')
                         .value();
      players.push(_.last(path.passes).receiver);
      return players
    };

    api.getTotalYardage = function(path) {
      return _.reduce(path.passes, function(sum, pass) {
        var startPos = _optaToPitchCoords(pass.passer.optaPos);
        var endPos = _optaToPitchCoords(pass.receiver.optaPos);
        var dx = endPos.x - startPos.x;
        var dy = endPos.y - startPos.y;

        Math.sqrt(dx*dx, dy*dy)/PitchShapes.YDS;

        return sum + Math.sqrt(dx*dx, dy*dy);
      }, 0);
    };

    api.getPlayerImageURL = function(playerName) {
      var baseUrl = '/assets/images/players/';
      return baseUrl + (playerName || 'blank') + '.png';
    };

    return api;
  });
