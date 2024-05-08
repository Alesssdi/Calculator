
const input = document.getElementById('input');
const calculator = document.querySelector('.calculator');
const copyButton = document.getElementById('copy_btn');


let open_brackets = 0
let current_num = ''



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



copyButton.addEventListener('click', function() {
    
    navigator.clipboard.writeText(input.value)
        .then(function() {
            copyButton.classList.add('copied');
            setTimeout(function() {
                copyButton.classList.remove('copied');
            }, 300);
        })
        .catch(function(error) {
            console.error('Ошибка при копировании текста: ', error);
        });
});

function handleInput(value) {
    if (input.value=='ERROR'){
        input.value='';
    }

    switch (value) {

        case 'C':
            input.value = "";
            current_num = ''
            open_brackets = 0;
            break


        case '\u2190':
            if (input.value.slice(-1)==')'){
                open_brackets += 1;
            }else if(input.value.slice(-1)=='('){
                open_brackets -= 1;
            }

            input.value = input.value.slice(0, -1);
            current_num = current_num.slice(0, -1);
            break


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

            input.value = input.value.replace(/[^-+*/ ()\d]/g, '');

            if (input.value !== "" && /\d$/.test(input.value.slice(-1)) && open_brackets != 0) {
                for (var i = 0; i < open_brackets; i++) {
                    input.value += ')';
                }
            }

            try {
                var result = eval(input.value);
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


