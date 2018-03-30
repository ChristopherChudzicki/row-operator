newRationalMatrixFromArray = function(matrix) {
    // matrix should be a 2D array where each entry a valid input to math.fraction. This includes numbers and strings such as "3/2".
    // returns a matrix all of whose entries are fractions
    var rows = [];
    for (let j = 0; j<matrix.length; j++){
        var row = [];
        for (let k=0; k<matrix[j].length; k++){
            row.push(math.fraction(matrix[j][k]));
        }
        rows.push(row);
    }
    return math.matrix(rows );
}

newRationalMatrixFromString = function(matrixString){
    // An ad-hoc parser string -> matrix. Matrix input should be replaced by mathquil some day.
    matrixString =  matrixString.replace(/\s/g,'') //remove whitespace
    matrixString = Utility.replaceAll(matrixString ,'[[','') //remove opening [[
    matrixString = Utility.replaceAll(matrixString ,']]','') //remove closing ]]
    var rowList = matrixString.split("],[");
    matrix = []
    for (let j=0; j<rowList.length;j++){
        matrix.push( rowList[j].split(',') );
    }
    return newRationalMatrixFromArray(matrix);
}

newRationalMatrix = function(matrix){
    if (typeof matrix === 'string'){
        return newRationalMatrixFromString(matrix);
    }
    else {
        return newRationalMatrixFromArray(matrix);
    }
}

class RowReductionStep  {
    constructor (el, oldMatrix) {
        this._holdUpdates = true;

        this.id = _.uniqueId();
        this.firstRowIndex = 1;
        this.lastRowIndex = this.firstRowIndex + oldMatrix.size()[0];
        this.rowNames = this.getRowNames();

        this.el = el;

        //Set Matrices
        Object.defineProperties(this, {
            oldMatrix: {
                set: function(val){
                    this._oldMatrix = val;
                    this.onChange()
                },
                get: function(){
                    return this._oldMatrix;
                }
            },
        })
        this.oldMatrix = oldMatrix;
        this.transformation = {};
        this.transformation = this.updateTransformation();
        this.matrix = this.calcMatrix();
        this.nextStep = null;

        this._holdUpdates = false;
        this.updateDisplay();
    }

    updateTransformation() {
        var _this = this;
        // Loop over rows in our transformation. Remove any that are not in our matrix.
        for (let _key in this.transformation){
            var key = _key.substring(1);
            if (this.rowNames.indexOf(key) === -1){
                delete this.transformation[key];
                delete this.transformation[_key];
            }
        }

        // Loop over all rows in our matrix
        for (let j = 0; j<this.rowNames.length; j++){
            let key = this.rowNames[j];
            // If a row is already listed in our transformation, skip it
            if (this.transformation[key]){continue;}
            // If a row is not listed in our transformation, add rj:rj as default & attach getter/setters
            Object.defineProperty(this.transformation, key, {
                get: function() {
                    return this['_' + key];
                },
                set: function(val) {
                    this['_' + key] = val;
                    _this.onChange();
                },
                configurable: true
            })
            this.transformation[key] = key;
        }

        return this.transformation;
    }

    getRowScope(matrix){
        // returns an object {r1:row1, r2:row2, ... } where the rows are rows of this.matrix
        var rowScope = {};
        var matrixAsArray = matrix.toArray();
        for (let j=0; j < this.rowNames.length; j++){
            rowScope[ this.rowNames[j] ] = matrixAsArray[j];
        }
        return rowScope;
    }

    getRowNames(){
        var rowNames = [];
        for (let j=this.firstRowIndex; j<this.lastRowIndex; j++){
            rowNames.push(`r${j}`);
        }
        return rowNames;
    }

    rowTransform(transformation){
        // Transformation should be an such as
        // {
        //     r1: 'r1+r2',
        //     r2: 'r2-3*r4',
        // }
        // i.e., {newRow: linear combo of old rows}
        // If a row is missing from the transformation, it will be left alone
        var newRowList = [];
        for (let j = this.firstRowIndex; j<this.lastRowIndex; j++){
            let key = `r${j}`;
            let newRow = transformation[key];
            if (newRow === undefined) { newRow = key};
            newRowList.push(newRow);
        }

        var oldRowScope = this.getRowScope(this.oldMatrix);
        // Given an array [str0, str1, ...], math.parse returns an array of parse trees.
        var newRows = []
        var nodeTree = math.parse(newRowList).forEach( function(node){
            newRows.push( node.eval(oldRowScope) );
         } );

         return newRationalMatrix(newRows);

    }

    calcMatrix(){
        return this.rowTransform(this.transformation);
    }

    static toTex(matrix){
        var noFakeFractions = matrix.map( function(value, idx, matrix){
            if (value.d === 1){
                return value.s * value.n;
            }
            else{
                return value;
            }
        } )

        var latex = math.parse(String(noFakeFractions)).toTex();
        latex = Utility.replaceAll(latex, '\\\\\\end', '\\end')

        return latex

    }

    updateDisplay(){
        katex.render(RowReductionStep.toTex(this.matrix), this.el);
    }

    onChange(){
        if (!this._holdUpdates){
            this.firstRowIndex = 1;
            this.lastRowIndex = this.firstRowIndex + this.oldMatrix.size()[0];
            this.rowNames = this.getRowNames();
            this.updateTransformation();

            this.matrix = this.calcMatrix();
            this.updateDisplay();
        }
        if (this.nextStep){
            this.nextStep.oldMatrix = this.matrix;
        }
    }
}

// TODO: factor RowReductionStep.updateTransformation into classes below.
// Some Issues:
// only allow valid row operations
// check that collection of row operations is not singular (e.g., r1->r2, r2->r2 would be singular).

class RowTransformation {
    //Represents a collection of row operations
    constructor(arrayOfTransformations){
    }
}

class RowOperation {
    // Represents a single row operation, e.g.
    // RowOperation('r1', 'r1-r2+2r4')
    constructor(row, transformedRow) {
    }

    // Check with transformedRow is actually a valid row operation. E.g., mathjs will parse 2r2+3 perfectly fine, but adding 3 to all elements of a row is not a valid row operation.
    isValidTranformation(){
    }
}
