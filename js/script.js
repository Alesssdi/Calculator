const input = document.getElementById('input');
const calculator = document.querySelector('.calculator');
const copyButton = document.getElementById('copy_btn');

let open_brackets = 0;
let current_num = '';
let operandStack = [];
let operatorStack = [];


function handleInput(value) {
    if (input.value == 'ERROR') {
        input.value = '';
    }

    switch (value) {
        case 'C':
            input.value = "";
            operandStack = [];
            operatorStack = [];
            current_num = '';
            open_brackets = 0;
            break;

        case '\u2190':

            if (input.value.slice(-1) == ')') {
                open_brackets += 1;
            } else if (input.value.slice(-1) == '(') {
                open_brackets -= 1;
            }
            input.value = input.value.slice(0, -1);
            current_num = current_num.slice(0, -1);
            break;

        case '=':

            if (input.value !== "") {
                while ('+×÷-'.includes(input.value.slice(-1))) {
                    input.value = input.value.slice(0, -1);
                }
            }

            input.value = input.value.replace(/(\d)(\()/g, "$1*$2");
            input.value = input.value.replace(/(\))(\d)/g, "$1*$2");

            input.value = input.value.replace(/÷/g, '/');
            input.value = input.value.replace(/×/g, '*');

            input.value = input.value.replace(/[^-+*/ ().\d]/g, '');

            if (input.value !== "" && /\d$/.test(input.value.slice(-1)) && open_brackets != 0) {
                for (var i = 0; i < open_brackets; i++) {
                    input.value += ')';
                }
            }

            try {
                var result = calculateResult(input.value);

                if (!isFinite(result)) {
                    throw new Error;
                }
                input.value = result.toFixed(2).replace(/\.?0+$/, '');
                current_num = input.value;
                open_brackets = 0;
            } catch (error) {
                input.value = "ERROR";
            }
            break
        case '.':

            if (current_num.indexOf('.') === -1) {
                input.value += ".";
                current_num += ".";
            }
            break;

        case '(':

            current_num = "";
            input.value += "(";
            open_brackets += 1;
            break;

        default:
            if (value.length == 1) {
                if (value == ')' && open_brackets != 0) {
                    open_brackets -= 1;
                } else if (value == ')' && open_brackets == 0) {
                    break
                }

                if (/[0-9]/.test(value)) {
                    current_num += value
                } else {
                    current_num = ''
                }

                if (input.value !== "" && '+×÷-'.includes(value) && '+×÷-'.includes(input.value.slice(-1))) {
                    input.value = input.value.slice(0, -1);
                }

                input.value += value;
            }
    }
}

function calculateResult(expression) {

    let array = expression.match(/(?:\d+\.\d+|\.\d+|\d+|(?<=[+\-*\/(]|^)-?\d+\.\d+|(?<=[+\-*\/(]|^)-?\d+|[+\-*\/()^])/g);

    while (array.length > 0) {
        let t = array.shift();

        if (!isNaN(t)) {
            operandStack.push(parseFloat(t));
        } else if (t === '(') {
            operatorStack.push(t);
        } else if (t === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                applyOperation();
            }

            operatorStack.pop();
        } else {
            while (operatorStack.length > 0 && hasHigherPrecedence(operatorStack[operatorStack.length - 1], t)) {
                applyOperation();
            }
            operatorStack.push(t);
        }
    }
    while (operatorStack.length > 0) {
        applyOperation();
    }

    return operandStack.pop();
}

function applyOperation() {
    let operator = operatorStack.pop();
    let operand2 = operandStack.pop();
    let operand1 = operandStack.pop();
    operandStack.push(performOperation(operand1, operand2, operator));
}

function hasHigherPrecedence(op1, op2) {
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };
    return precedence[op1] >= precedence[op2];
}

function performOperation(operand1, operand2, operator) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            throw new Error('Invalid operator');
    }
}

calculator.addEventListener('click', function (event) {
    let value = event.target.innerText;
    handleInput(value);
});

document.addEventListener('keydown', function (event) {
    let key = event.key;
    if (key === 'Backspace') {
        key = '\u2190';
    } else if (key === 'Enter') {
        key = '=';
    } else if (!/[\d+\-*\/().]/.test(key)) {
        return
    }
    handleInput(key);
});


copyButton.addEventListener('click', function () {
    navigator.clipboard.writeText(input.value)
        .then(function () {
            copyButton.classList.add('copied');
            setTimeout(function () {
                copyButton.classList.remove('copied');
            }, 300);
        })
        .catch(function (error) {
            console.error('Ошибка при копировании текста: ', error);
        });
});
