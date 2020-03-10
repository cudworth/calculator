const add_char = '\u002B';
const subtract_char = '\u2212'
const multiply_char = '\u2715';
const divide_char = '\u00F7';
const decimal_char = '\u002E';
const operators = [add_char, subtract_char, multiply_char, divide_char];
let array = [''];

const keys = [
    {pos:[0,0],     id:'clear',     fn:'clear',     key_bind:'Delete',       char:'C'},
    {pos:[0,1],     id:'backspace', fn:'backspace', key_bind:'Backspace',    char:'\u232B'},
    {pos:[1,0],     id:'_7',        fn:'number',   key_bind:'7',            char:'7'},
    {pos:[1,1],     id:'_8',        fn:'number',    key_bind:'8',            char:'8'},
    {pos:[1,2],     id:'_9',        fn:'number',    key_bind:'9',            char:'9'},
    {pos:[1,3],     id:'divide',    fn:'operator',  key_bind:'/',            char:divide_char},
    {pos:[2,0],     id:'_4',        fn:'number',    key_bind:'4',            char:'4'},
    {pos:[2,1],     id:'_5',        fn:'number',    key_bind:'5',            char:'5'},
    {pos:[2,2],     id:'_6',        fn:'number',    key_bind:'6',            char:'6'},
    {pos:[2,3],     id:'multiply',  fn:'operator',  key_bind:'*',            char:multiply_char},
    {pos:[3,0],     id:'_1',        fn:'number',    key_bind:'1',            char:'1'},
    {pos:[3,1],     id:'_2',        fn:'number',    key_bind:'2',            char:'2'},
    {pos:[3,2],     id:'_3',        fn:'number',    key_bind:'3',            char:'3'},
    {pos:[3,3],     id:'minus',     fn:'operator',  key_bind:'-',            char:subtract_char},
    {pos:[4,0],     id:'_0',        fn:'number',    key_bind:'0',            char:'0'},
    {pos:[4,1],     id:'decimal',   fn:'number',    key_bind:'.',            char:decimal_char},
    {pos:[4,2],     id:'equals',    fn:'solve',     key_bind:'=',            char:'\u003D'},
    {pos:[4,3],     id:'plus',      fn:'operator',  key_bind:'+',            char:add_char},
];

const keypad_rows = 5;
const keypad_cols = 4;

const body = document.querySelector('body');
const calculator = document.createElement('div');
calculator.id = 'calculator';
const display = document.createElement('div');
display.id = 'display';
const keypad = document.createElement('div');
calculator.appendChild(display);
calculator.appendChild(keypad);
body.appendChild(calculator);

drawKeypad(keypad, keypad_rows, keypad_cols);

keys.forEach(function(key){
    const [i, j] = key.pos;
    let cell = document.querySelector(`#cell_${i}_${j}`);
    const button = document.createElement('button');
    button.id = key.id;
    button.textContent = key.char;
    button.setAttribute('function', key.fn);
    button.addEventListener('click', function (e){
        switch (e.target.getAttribute('function')){
            case 'number':
                calcInputNumber(e.target);
                break;
            case 'operator':
                calcInputOperator(e.target);
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

document.addEventListener('keydown', function(e){
    keys.forEach(function(key) {
        if (key.key_bind === e.key){
            document.querySelector(`#${key.id}`).click();
        }
    })
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

function calcInputNumber(button){
    array[array.length - 1] += button.textContent;
    updateDisplay(array);
}

function calcInputOperator(button){
    array.push(button.textContent);
    array.push('');
    
    updateDisplay(array)
}

function calcClear(){
    array = [''];
    updateDisplay(array);
}

function calcBackspace(){

    if (1 < array.length &&  '' === array[array.length - 1]){
        array.pop();
        array.pop();
    } else if ('' !== array[array.length - 1]){
        let num = array.pop();
        num = num.split('');
        num.pop();
        array.push(num.join(''));
    }

    updateDisplay(array);
}

function updateDisplay(array){
    display.textContent = array.join('');
}

function calcSolve(){
    let index;

    if (inputValidation(array)){
        updateDisplay(['ERROR']);
        array = [''];
        return;
    }

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

    array = [roundDecimal(array[0], 8)];

    updateDisplay(array);

}

function calcAdd(array, index){
    const val = String(Number(array[index - 1]) + Number(array[index + 1]));
    array.splice(index - 1, 3, val);
    return array;
}

function calcSubtract(array, index){
    const val = String(Number(array[index - 1]) - Number(array[index + 1]));
    array.splice(index - 1, 3, val);
    return array;
}

function calcMultiply(array, index){
    const val = String(Number(array[index - 1]) * Number(array[index + 1]));
    array.splice(index - 1, 3, val);
    return array;
}

function calcDivide(array, index){
    const val = String(Number(array[index - 1]) / Number(array[index + 1]));
    array.splice(index - 1, 3, val);
    return array;
}

function inputValidation(array){
    let input_error = false;

    array.forEach(function(elem){
        if (elem === ""){
            input_error = true;
            return;
        };
    });

    let contains_decimal;
    array.forEach(function(elem){
        contains_decimal = false;
        elem_array = elem.split('').forEach(function(char){
            if(!contains_decimal && char === decimal_char){
                contains_decimal = true;
            } else if (contains_decimal && char === decimal_char){
                input_error = true;
                return;
            }
        })
    })
    return input_error;
}

function roundDecimal(num, digits){
    if(0 < (num % 1) ^ 2 && digits < num.toString().length) {
        num = Math.round(Number(num) * 10 ** digits) / (10 ** digits);
    }
    return String(num);
}
