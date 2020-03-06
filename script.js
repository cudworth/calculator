const add_char = '\u002B';
const subtract_char = '\u2212'
const multiply_char = '\u2715';
const divide_char = '\u00F7';
const decimal_char = '\u002E';
const opers = [add_char, subtract_char, multiply_char, divide_char];

const keys = [
    {pos:[0,0],     id:'clear',     fn:'clear',     char:'C'},
    {pos:[0,1],     id:'backspace', fn:'backspace', char:'\u232B'},
    {pos:[1,0],     id:'7',         fn:'input'},
    {pos:[1,1],     id:'8',         fn:'input'},
    {pos:[1,2],     id:'9',         fn:'input'},
    {pos:[1,3],     id:'divide',    fn:'input',     char:divide_char},
    {pos:[2,0],     id:'4',         fn:'input'},
    {pos:[2,1],     id:'5',         fn:'input'},
    {pos:[2,2],     id:'6',         fn:'input'},
    {pos:[2,3],     id:'multiply',  fn:'input',     char:multiply_char},
    {pos:[3,0],     id:'1',         fn:'input'},
    {pos:[3,1],     id:'2',         fn:'input'},
    {pos:[3,2],     id:'3',         fn:'input'},
    {pos:[3,3],     id:'minus',     fn:'input',     char:subtract_char},
    {pos:[4,0],     id:'0',         fn:'input'},
    {pos:[4,1],     id:'decimal',   fn:'input',     char:decimal_char},
    {pos:[4,2],     id:'equals',    fn:'solve',     char:'\u003D'},
    {pos:[4,3],     id:'plus',      fn:'input',     char:add_char},
]

const key_rows = 5;
const key_cols = 4;

const body = document.querySelector('body');

const calculator = document.createElement('div');
calculator.id = 'calculator';

const display = document.createElement('div');
display.id = 'display';

const keypad = document.createElement('div');

calculator.appendChild(display);
calculator.appendChild(keypad);

body.appendChild(calculator);

drawKeypad(keypad, key_rows, key_cols);

keys.forEach(function(key){
    const [i, j] = key.pos;
    let cell = document.querySelector(`#cell_${i}_${j}`);
    const button = document.createElement('button');
    button.textContent = (key.char)? key.char: key.id;
    button.function = key.fn;
    button.addEventListener('click', function (e){
        switch (e.target.function){
            case 'input':
                calcInput(e.target);
                break;
            case 'solve':
                calcSolve(e.target);
                break;
            case 'clear':
                calcClear(e.target);
                break;
            case 'backspace':
                calcBackspace(e.target);
                break;
        }
    })
    cell.appendChild(button);
})

//TODO (KEYBOARD INPUT, MISSING ESC, BACKSPACE)

document.addEventListener('keydown', function(e){
    console.log([e.keyCode, e.key]);
    const familiar_keys = '0123456789+-*/=\d';
    if (-1 < familiar_keys.indexOf(e.key)){
        console.log('key recognized');
    }
})

function drawKeypad(node, n, m){
    for (let i = 0; i < n; i++){

        let row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < m; j++){
            let cell = document.createElement('span');
            cell.id = `cell_${i}_${j}`;
            row.appendChild(cell);
        }

        node.appendChild(row);
    }
    node.appendChild
}

function calcInput(btn){
    display.textContent += btn.textContent;
}

function calcClear(){
    display.textContent = '';
}

function calcBackspace(){
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
}

function calcSolve(){
    let index;
    let arr = parseInput(display.textContent);

    arr = inputValidation(arr);

    while (arr.includes(multiply_char)){
        index = arr.findIndex((char) => char === multiply_char)
        arr = calcMultiply(arr, index);
    }

    while (arr.includes(divide_char)){
        index = arr.findIndex((char) => char === divide_char)
        arr = calcDivide(arr, index);
    }

    while (arr.includes(add_char)){
        index = arr.findIndex((char) => char === add_char)
        arr = calcAdd(arr, index);
    }

    while (arr.includes(subtract_char)){
        index = arr.findIndex((char) => char === subtract_char)
        arr = calcSubtract(arr, index);
    }

    arr = [roundDecimal(arr[0], 8)];

    display.textContent = arr[0];
}

function parseInput(string){
    const char_arr = string.split('');
    const nums = '-.01234567890';
    let input_error = false;
    
    let return_arr = char_arr.reduce(function(arr, char, i){

        if (0 === arr.length) {
            arr.push(char);
            return arr;
        }

        if (-1 < nums.indexOf(char) && -1 < nums.indexOf(char_arr[i - 1])){
            arr[arr.length - 1] += char;        
        }else if (-1 < nums.indexOf(char) || -1 < opers.indexOf(char)) {
            arr.push(char);
        } else {
            input_error = true;
        }

        return arr;

    },[])

    if (input_error) return_arr = ['ERR'];

    return return_arr;
}

function calcAdd(arr, index){
    const val = Number(arr[index - 1]) + Number(arr[index + 1]);
    arr.splice(index - 1, 3, val);
    return arr;
}

function calcSubtract(arr, index){
    const val = Number(arr[index - 1]) - Number(arr[index + 1]);
    arr.splice(index - 1, 3, val);
    return arr;
}

function calcMultiply(arr, index){
    const val = Number(arr[index - 1]) * Number(arr[index + 1]);
    arr.splice(index - 1, 3, val);
    return arr;
}

function calcDivide(arr, index){
    const val = Number(arr[index - 1]) / Number(arr[index + 1]);
    arr.splice(index - 1, 3, val);
    return arr;
}

function inputValidation(arr){

    if (-1 < opers.indexOf(arr[0]) || -1 < opers.indexOf(arr[arr.length-1])){
        console.log('MISSING OPERAND ERROR')
        return arr = ['ERR'];
    }

    let prev = '';
    arr.forEach(function(elem){
        if (-1 < opers.indexOf(prev) && -1 < opers.indexOf(elem)){
            console.log('SEQUENTIAL OPERATORS ERROR');
            return arr = ['ERR'];
        }
        prev = elem;
    })

    let contains_decimal;
    arr.forEach(function(elem){
        contains_decimal = false;
        elem_arr = elem.split('').forEach(function(char){
            if(!contains_decimal && char === decimal_char){
                contains_decimal = true;
            } else if (contains_decimal && char === decimal_char){
                console.log('MULTIPLE DECIMALS ERROR');
                return arr = ['ERR'];
            }
        })
    })
 
    return arr;
}

function roundDecimal(num, digits){
    if(0 < (num % 1) ^ 2 && digits < num.toString().length) {
        num = Math.round(num * 10 ** digits) / (10 ** digits);
    }
    return num;
}
