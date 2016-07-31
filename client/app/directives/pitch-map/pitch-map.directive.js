'use strict';

angular.module('mcfcHackApp')
  .directive('pitchMap', function (Path, Pitch, PitchShapes, $state ,$stateParams, $location) {
    return {
      templateUrl: 'app/directives/pitch-map/pitch-map.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.$state = $state;

        console.log('canvas width: '+(PitchShapes.WIDTH+2*PitchShapes.PADDING));
        console.log('canvas height: '+(PitchShapes.HEIGHT+2*PitchShapes.PADDING));

        var canvas = document.getElementById('pitch');
        var ctx = canvas.getContext('2d');

        scope.pitch = new Pitch.Pitch(ctx);
        scope.pitch.draw();

        scope.paths = Path.query(function() {
          scope.paths = _.map(scope.paths, function(path) {
            path.playerList = Path.getPlayerList(path);
            path.totalYardage = Path.getTotalYardage(path);
            return path;
          });

          if($stateParams.pathIndex) {
            scope.visualisePath(scope.paths[$stateParams.pathIndex]);
          }
        });

        scope.visualisePath = function(path) {
          scope.currentPathId = path._id;
          scope.pitch.replacePlayers(path.playerList); // make this part of animatePath()
          scope.pitch.animatePath(path);
        };

        scope.reload = function(index) {
          console.log($location);
          window.location.search = 'pathIndex='+index;
          $location.reload();
        }
      }
    };
  });