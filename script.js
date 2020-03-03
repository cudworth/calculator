const add_char = '\u002B';
const subtract_char = '\u2212'
const multiply_char = '\u2715';
const divide_char = '\u00F7';

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
    {pos:[4,1],     id:'decimal',   fn:'input',     char:'\u002E'},
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
//TODO Prevent operator input prior to numeral input
//TODO Prevent sequential operator input
//TODO Return error if operator is last item in string when solved

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

function calcInput(button){
    if (-1 < display.textContent.indexOf('.') && button.textContent === '.') return 0;
    display.textContent += button.textContent;
}

function calcClear(){
    display.textContent = '';
}

function calcBackspace(){
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
}

function calcSolve(){
    let index;
    let array = parseInput(display.textContent);
    console.log(array);

    while (array.includes(multiply_char)){
        index = array.findIndex((char) => char === multiply_char)
        array = calcMultiply(array, index);
    }

    while (array.includes(divide_char)){
        index = array.findIndex((char) => char === divide_char)
        array = calcDivide(array, index);
    }

    while (array.includes(add_char)){
        index = array.findIndex((char) => char === add_char)
        array = calcAdd(array, index);
    }

    while (array.includes(subtract_char)){
        index = array.findIndex((char) => char === subtract_char)
        array = calcSubtract(array, index);
    }
    console.log(array);
    display.textContent = array[0];
}

function parseInput(string){
    const char_array = string.split('');
    const nums = '.01234567890';
    const parsed_array = char_array.reduce(function(arr, char, i){
        if (0 === arr.length) {
            arr.push(char);
            return arr;
        }
        if (-1 < nums.indexOf(char) && -1 < nums.indexOf(char_array[i - 1])){
            arr[arr.length - 1] += char;        
        } else {
            arr.push(char);
        }
        return arr;
    },[])
    return parsed_array;
}

function calcAdd(array, index){
    const val = Number(array[index - 1]) + Number(array[index + 1]);
    array.splice(index - 1, 3, val);
    return array;
}

function calcSubtract(array, index){
    const val = Number(array[index - 1]) - Number(array[index + 1]);
    array.splice(index - 1, 3, val);
    return array;
}

function calcMultiply(array, index){
    const val = Number(array[index - 1]) * Number(array[index + 1]);
    array.splice(index - 1, 3, val);
    return array;
}

function calcDivide(array, index){
    const val = Number(array[index - 1]) / Number(array[index + 1]);
    array.splice(index - 1, 3, val);
    return array;
}
