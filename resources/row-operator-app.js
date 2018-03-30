// TODO: Rewrite this ugly app with react :)

app = angular.module('rowOpApp', ['ngAnimate', 'ui.bootstrap']);

queryString = Utility.getQueryString()

defaultSettings = {
        initialMatrix: `[
[2,0,2,-1,-10],
[-4,0,1,2,0],
[-2,-2,1,1,-6],
[4,3,-1,1,15]
]`,
        steps:[]
    }
if (queryString.initial) {
  initialSettings = {
          initialMatrix: JSON.parse(window.atob(queryString.initial)),
          steps:[]
      }
}
else {
  initialSettings = defaultSettings
}


app.controller('reducCtrl', ['$scope', function($scope){
    scope = $scope;

    $scope.updateInitialMatrix = updateInitialMatrix;
    $scope.addStep = addStep;
    $scope.initializeKatexForStep = initializeKatexForStep;

    $scope.steps = [];
    try {
      $scope.settings = initialSettings
      $scope.updateInitialMatrix(); //initialize
    }
    catch (e) {
      console.log(`Error: ${e}, using defaults instead`)
      $scope.settings = defaultSettings
      $scope.updateInitialMatrix(); //initialize
    }

    $scope.addStep();

    function addStep(){
        var previousStepIdx = $scope.steps.length - 1;
        if (previousStepIdx > -1){
            var oldMatrix = $scope.steps[previousStepIdx].matrix;
        } else {
            var oldMatrix = $scope.initialMatrix;
        }

        var el = $('<div class="katex"></div>')[0]
        var step = new RowReductionStep(el, oldMatrix)
        $scope.steps.push(step);

        //Link previousStep to this step
        if (previousStepIdx > -1){
            $scope.steps[previousStepIdx].nextStep = step;
        }

    }

    function initializeKatexForStep(step){
        document.getElementById(`matrix-holder-${step.id}`).appendChild(step.el)
    }

    function updateInitialMatrix(){
        setInitialMatrix();
        renderInitialMatrix();
        if ($scope.steps[0] !== undefined){
            $scope.steps[0].oldMatrix = $scope.initialMatrix;
        }

    }

    function setInitialMatrix(){
        $scope.initialMatrix = newRationalMatrix($scope.settings.initialMatrix);
    }

    function renderInitialMatrix(){
        var el = $('#katex-initial-matrix')[0];
        var latex = RowReductionStep.toTex($scope.initialMatrix);
        katex.render(latex, el);
    }

}])

function saveUrl(){
  var initial = JSON.stringify(scope.settings.initialMatrix)
  console.log(initial)
  var encoded = window.btoa(initial)
  var url = window.location.href.split('#')[0].split("?")[0] + "?initial=" + encoded;
  return url
}
