const add_char = '\u002B';
const subtract_char = '\u2212'
const multiply_char = '\u2715';
const divide_char = '\u00F7';
const decimal_char = '\u002E';
const opers = [add_char, subtract_char, multiply_char, divide_char];

const btns = [
    {pos:[0,0],     id:'clear',     fn:'clear',     key_bind:'Delete',       char:'C'},
    {pos:[0,1],     id:'backspace', fn:'backspace', key_bind:'Backspace',    char:'\u232B'},
    {pos:[1,0],     id:'_7',        fn:'input',     key_bind:'7',            char:'7'},
    {pos:[1,1],     id:'_8',        fn:'input',     key_bind:'8',            char:'8'},
    {pos:[1,2],     id:'_9',        fn:'input',     key_bind:'9',            char:'9'},
    {pos:[1,3],     id:'divide',    fn:'input',     key_bind:'/',            char:divide_char},
    {pos:[2,0],     id:'_4',        fn:'input',     key_bind:'4',            char:'4'},
    {pos:[2,1],     id:'_5',        fn:'input',     key_bind:'5',            char:'5'},
    {pos:[2,2],     id:'_6',        fn:'input',     key_bind:'6',            char:'6'},
    {pos:[2,3],     id:'multiply',  fn:'input',     key_bind:'*',            char:multiply_char},
    {pos:[3,0],     id:'_1',        fn:'input',     key_bind:'1',            char:'1'},
    {pos:[3,1],     id:'_2',        fn:'input',     key_bind:'2',            char:'2'},
    {pos:[3,2],     id:'_3',        fn:'input',     key_bind:'3',            char:'3'},
    {pos:[3,3],     id:'minus',     fn:'input',     key_bind:'-',            char:subtract_char},
    {pos:[4,0],     id:'_0',        fn:'input',     key_bind:'0',            char:'0'},
    {pos:[4,1],     id:'decimal',   fn:'input',     key_bind:'.',            char:decimal_char},
    {pos:[4,2],     id:'equals',    fn:'solve',     key_bind:'=',            char:'\u003D'},
    {pos:[4,3],     id:'plus',      fn:'input',     key_bind:'+',            char:add_char},
];

const btn_rows = 5;
const btn_cols = 4;

const body = document.querySelector('body');

const calculator = document.createElement('div');
calculator.id = 'calculator';

const display = document.createElement('div');
display.id = 'display';

const btnpad = document.createElement('div');

calculator.appendChild(display);
calculator.appendChild(btnpad);

body.appendChild(calculator);

drawKeypad(btnpad, btn_rows, btn_cols);

btns.forEach(function(btn){
    const [i, j] = btn.pos;
    let cell = document.querySelector(`#cell_${i}_${j}`);
    const button = document.createElement('button');
    button.id = btn.id;
    button.textContent = btn.char;
    button.setAttribute('function', btn.fn);
    button.addEventListener('click', function (e){
        switch (e.target.getAttribute('function')){
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

document.addEventListener('keydown', function(e){
    btns.forEach(function(btn) {
        if (btn.key_bind === e.key){
            document.querySelector(`#${btn.id}`).click();
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

function calcInput(button){
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
