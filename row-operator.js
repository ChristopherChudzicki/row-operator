class Utility {
    static defaultVal(variable, defaultVal) {
        return typeof variable !== 'undefined' ? variable : defaultVal;
    }

    static detectObjectDifferences(a, b) {
        // Returns keys that appear in the difference a - b
        // http://stackoverflow.com/a/31686152/2747370
        var diffKeys = _.reduce(a, function(result, value, key) {
            return _.isEqual(value, b[key]) ? result : result.concat(key);
        }, []);
        return diffKeys
    }

    static isPureObject(arg) {
        // Test if something is an object. 
        // OK, [1,2,3] is an object in JS. I mean test if something is an object like {a:1,b:[1,2,3],c:{aa:5}}.
        return arg !== null && typeof arg === 'object' && !Array.isArray(arg)
    }

    static deepObjectDiff(a, b) {
        var diff = {};
        var keys = Utility.detectObjectDifferences(a, b);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var aValue = a[key];
            var bValue = b[key];
            if (Utility.isPureObject(aValue) && Utility.isPureObject(bValue)) {
                diff[key] = Utility.deepObjectDiff(aValue, bValue);
            } else {
                diff[key] = aValue;
            }
        }
        return diff
    }

    static deepCopyValuesOnly(obj) {
        //Intended to help serialize objects with a getter named KEY that stores values in _KEY.
        // FIXME I'm not 100% sure this actually copies the object ... strings, numbers, arrays, will definitely be copied.
        var deepCopy = {};
        for (var key in obj) {
            if (key[0] == '_') {
                //In this case, the object should have a getter, but let's check
                var subkey = key.substring(1)
                if (obj[subkey] !== undefined && typeof Object.getOwnPropertyDescriptor(obj, subkey).get === 'function') {
                    key = subkey
                }
            }
            if (deepCopy.hasOwnProperty(key)) {
                throw `Error: Input Object has both ${key} and _${key} properties.`
            }

            if (Utility.isPureObject(obj[key])) {
                deepCopy[key] = Utility.deepCopyValuesOnly(obj[key]);
            } else if (Array.isArray(obj[key])) {
                deepCopy[key] = obj[key].slice(); // if array, make a new copy
            } else {
                deepCopy[key] = obj[key];
            }
        }
        return deepCopy;
    }

    static getQueryString() {
        // modified from http://stackoverflow.com/a/979995/2747370
        var query_string = {};
        var query = window.location.search.substring(1);
        if (query === "") {
            return query_string
        }
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }

    static namedColorToHexColor(color) {
        color = color.toLowerCase();
        var namedColors = {
            aliceblue: '#F0F8FF',
            antiquewhite: '#FAEBD7',
            aqua: '#00FFFF',
            aquamarine: '#7FFFD4',
            azure: '#F0FFFF',
            beige: '#F5F5DC',
            bisque: '#FFE4C4',
            black: '#000000',
            blanchedalmond: '#FFEBCD',
            blue: '#0000FF',
            blueviolet: '#8A2BE2',
            brown: '#A52A2A',
            burlywood: '#DEB887',
            cadetblue: '#5F9EA0',
            chartreuse: '#7FFF00',
            chocolate: '#D2691E',
            coral: '#FF7F50',
            cornflowerblue: '#6495ED',
            cornsilk: '#FFF8DC',
            crimson: '#DC143C',
            cyan: '#00FFFF',
            darkblue: '#00008B',
            darkcyan: '#008B8B',
            darkgoldenrod: '#B8860B',
            darkgray: '#A9A9A9',
            darkgrey: '#A9A9A9',
            darkgreen: '#006400',
            darkkhaki: '#BDB76B',
            darkmagenta: '#8B008B',
            darkolivegreen: '#556B2F',
            darkorange: '#FF8C00',
            darkorchid: '#9932CC',
            darkred: '#8B0000',
            darksalmon: '#E9967A',
            darkseagreen: '#8FBC8F',
            darkslateblue: '#483D8B',
            darkslategray: '#2F4F4F',
            darkslategrey: '#2F4F4F',
            darkturquoise: '#00CED1',
            darkviolet: '#9400D3',
            deeppink: '#FF1493',
            deepskyblue: '#00BFFF',
            dimgray: '#696969',
            dimgrey: '#696969',
            dodgerblue: '#1E90FF',
            firebrick: '#B22222',
            floralwhite: '#FFFAF0',
            forestgreen: '#228B22',
            fuchsia: '#FF00FF',
            gainsboro: '#DCDCDC',
            ghostwhite: '#F8F8FF',
            gold: '#FFD700',
            goldenrod: '#DAA520',
            gray: '#808080',
            grey: '#808080',
            green: '#008000',
            greenyellow: '#ADFF2F',
            honeydew: '#F0FFF0',
            hotpink: '#FF69B4',
            indianred: '#CD5C5C',
            indigo: '#4B0082',
            ivory: '#FFFFF0',
            khaki: '#F0E68C',
            lavender: '#E6E6FA',
            lavenderblush: '#FFF0F5',
            lawngreen: '#7CFC00',
            lemonchiffon: '#FFFACD',
            lightblue: '#ADD8E6',
            lightcoral: '#F08080',
            lightcyan: '#E0FFFF',
            lightgoldenrodyellow: '#FAFAD2',
            lightgray: '#D3D3D3',
            lightgrey: '#D3D3D3',
            lightgreen: '#90EE90',
            lightpink: '#FFB6C1',
            lightsalmon: '#FFA07A',
            lightseagreen: '#20B2AA',
            lightskyblue: '#87CEFA',
            lightslategray: '#778899',
            lightslategrey: '#778899',
            lightsteelblue: '#B0C4DE',
            lightyellow: '#FFFFE0',
            lime: '#00FF00',
            limegreen: '#32CD32',
            linen: '#FAF0E6',
            magenta: '#FF00FF',
            maroon: '#800000',
            mediumaquamarine: '#66CDAA',
            mediumblue: '#0000CD',
            mediumorchid: '#BA55D3',
            mediumpurple: '#9370DB',
            mediumseagreen: '#3CB371',
            mediumslateblue: '#7B68EE',
            mediumspringgreen: '#00FA9A',
            mediumturquoise: '#48D1CC',
            mediumvioletred: '#C71585',
            midnightblue: '#191970',
            mintcream: '#F5FFFA',
            mistyrose: '#FFE4E1',
            moccasin: '#FFE4B5',
            navajowhite: '#FFDEAD',
            navy: '#000080',
            oldlace: '#FDF5E6',
            olive: '#808000',
            olivedrab: '#6B8E23',
            orange: '#FFA500',
            orangered: '#FF4500',
            orchid: '#DA70D6',
            palegoldenrod: '#EEE8AA',
            palegreen: '#98FB98',
            paleturquoise: '#AFEEEE',
            palevioletred: '#DB7093',
            papayawhip: '#FFEFD5',
            peachpuff: '#FFDAB9',
            peru: '#CD853F',
            pink: '#FFC0CB',
            plum: '#DDA0DD',
            powderblue: '#B0E0E6',
            purple: '#800080',
            rebeccapurple: '#663399',
            red: '#FF0000',
            rosybrown: '#BC8F8F',
            royalblue: '#4169E1',
            saddlebrown: '#8B4513',
            salmon: '#FA8072',
            sandybrown: '#F4A460',
            seagreen: '#2E8B57',
            seashell: '#FFF5EE',
            sienna: '#A0522D',
            silver: '#C0C0C0',
            skyblue: '#87CEEB',
            slateblue: '#6A5ACD',
            slategray: '#708090',
            slategrey: '#708090',
            snow: '#FFFAFA',
            springgreen: '#00FF7F',
            steelblue: '#4682B4',
            tan: '#D2B48C',
            teal: '#008080',
            thistle: '#D8BFD8',
            tomato: '#FF6347',
            turquoise: '#40E0D0',
            violet: '#EE82EE',
            wheat: '#F5DEB3',
            white: '#FFFFFF',
            whitesmoke: '#F5F5F5',
            yellow: '#FFFF00',
            yellowgreen: '#9ACD32'
        };
        return namedColors[color];
    }

    static lightenColor(color, amt) {
        //color should be hex or named. First get hex color if it is named
        if (color[0] != "#") {
            //http://www.w3schools.com/colors/colors_names.asp
            color = Utility.namedColorToHexColor(color);
        }

        if (color === undefined) {
            return false
        }

        //Now that we have hex, let's lighten it
        //http://stackoverflow.com/a/13532993/2747370
        var R = parseInt(color.substring(1, 3), 16),
            G = parseInt(color.substring(3, 5), 16),
            B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (1 + amt));
        G = parseInt(G * (1 + amt));
        B = parseInt(B * (1 + amt));

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }

    static assert(condition, message) {
        if (!condition) {
            var message = Utility.defaultVal(message, "Assertion Failed");
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }

    //http://stackoverflow.com/a/1144788/2747370
    static escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(Utility.escapeRegExp(find), 'g'), replace);
    }
    
    static findClosingBrace(string, startIdx){
        var braces = {
            '[':']',
            '<':'>',
            '(':')',
            '{':'}'
        };
        var openingBrace = string[startIdx];
        var closingBrace = braces[openingBrace];
        
        if (closingBrace===undefined){
            throw `${string} does not contain an opening brace at position ${startIdx}.`
        }
        
        var stack = 1;
        
        for (let j=startIdx+1; j<string.length; j++){
            if (string[j] === openingBrace){
                stack += +1;
            }
            else if (string[j]==closingBrace){
                stack += -1;
            }
            if (stack === 0){
                return j;
            }
        }

        if (stack !== 0 ){
            throw `${string} has a brace that opens at position ${startIdx} but does not close.`
        }
        
    }
}

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
        this.firstRowIndex = 1;
        this.lastRowIndex = this.firstRowIndex + oldMatrix.size()[0];
        this.rowNames = this.getRowNames();
        
        this.el = el;
        this.id = _.uniqueId();
        
        //Set Matrices
        this._holdUpdates = true;
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