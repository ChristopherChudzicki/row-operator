app = angular.module('rowOpApp', ['ngAnimate', 'ui.bootstrap']);

app.controller('reducCtrl', ['$scope', function($scope){
    $scope.settings = {
        initialMatrix: `[
            [0, 1, -2, 1, -5],
            [3, 4, 1, 0, 19/2],
            [2, 3, 0, 1, 4],
            [3, 1, 1, -2, 11/2]
        ]`,
        steps:[]
    }
    
    $scope.updateInitialMatrix = updateInitialMatrix;
    $scope.addStep = addStep;
    $scope.initializeKatexForStep = initializeKatexForStep;
    
    $scope.steps = [];
    $scope.updateInitialMatrix(); //initialize
    $scope.addStep();
    
    scope = $scope;

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
