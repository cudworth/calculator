const keys = [
    {pos:[0,0],     id:'clear',     fn:'clear',     char:'C'},
    {pos:[0,1],     id:'delete',    fn:'delete',    char:'\u232B'},
    {pos:[1,0],     id:'7',         fn:'input'},
    {pos:[1,1],     id:'8',         fn:'input'},
    {pos:[1,2],     id:'9',         fn:'input'},
    {pos:[1,3],     id:'divide',    fn:'input',     char:'\u00F7'},
    {pos:[2,0],     id:'4',         fn:'input'},
    {pos:[2,1],     id:'5',         fn:'input'},
    {pos:[2,2],     id:'6',         fn:'input'},
    {pos:[2,3],     id:'multiply',  fn:'input',     char:'\u2715'},
    {pos:[3,0],     id:'1',         fn:'input'},
    {pos:[3,1],     id:'2',         fn:'input'},
    {pos:[3,2],     id:'3',         fn:'input'},
    {pos:[3,3],     id:'minus',     fn:'input',     char:'\u2212'},
    {pos:[4,0],     id:'0',         fn:'input'},
    {pos:[4,1],     id:'decimal',   fn:'input',     char:'\u002E'},
    {pos:[4,2],     id:'equals',    fn:'solve',     char:'\u003D'},
    {pos:[4,3],     id:'plus',      fn:'input',     char:'\u002B'},
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
            case 'delete':
                calcDelete(e.target);
                break;
        }
    })
    cell.appendChild(button);
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

function calcClear(button){
    display.textContent = '';
}

function calcDelete(button){
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
}

//TODO
function calcSolve(button){}
