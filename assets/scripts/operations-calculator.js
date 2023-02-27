var display = document.querySelector(".display");
var buttons = document.querySelectorAll("span");
var operators = ["+", "-", "x", "÷"];
var decimalButtonState = false;

for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function (preventPageChange) {
        var inputVal = display.innerHTML;
        var btnVal = this.innerHTML;

        if (btnVal == "C") {
            display.innerHTML = "";
            decimalButtonState = false;
        } else if (btnVal == "=") {
            var operatorSolution = inputVal;
            var lastChar = operatorSolution[operatorSolution.length - 1];

            operatorSolution = operatorSolution.replace(/x/g, "*").replace(/÷/g, "/");

            if (operators.indexOf(lastChar) > -1 || lastChar == ".")
                operatorSolution = operatorSolution.replace(/.$/, "");

            if (operatorSolution) display.innerHTML = eval(operatorSolution);

            decimalButtonState = false;
        } else if (operators.indexOf(btnVal) > -1) {
            var lastChar = inputVal[inputVal.length - 1];

            if (inputVal != "" && operators.indexOf(lastChar) == -1) display.innerHTML += btnVal;
            else if (inputVal == "" && btnVal == "-") display.innerHTML += btnVal;

            if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                display.innerHTML = inputVal.replace(/.$/, btnVal);
            }

            decimalButtonState = false;
        } else if (btnVal == ".") {
            if (!decimalButtonState) {
                display.innerHTML += btnVal;
                decimalButtonState = true;
            }
        } else {
            display.innerHTML += btnVal;
        }

        // prevent page jumps
        preventPageChange.preventDefault();
    };
}

// window.addEventListener("keypress", event => {
//     console.log("pressed", event);
// });

window.onkeydown = evt => {
    evt = evt || window.event;
    let hasKey = "key" in evt;

    function btnClicker(clsName) {
        let clickBtn = Array.prototype.find.call(buttons, btn => btn.className.indexOf(clsName + " neumorphic") != -1);
        if (clickBtn !== undefined && clickBtn !== null) clickBtn.click();
    }

    if (hasKey ? evt.key === "Escape" || evt.key === "Esc" : evt.keyCode === 27) btnClicker("c");
    else {
        if (hasKey ? evt.key === "=" || evt.key === "Equal" : evt.keyCode === 187) {
            btnClicker("equals");
        } else if (hasKey ? evt.key === "+" || evt.key === "Plus" : evt.keyCode === 171) {
            btnClicker("plus");
        }
        // key: '1', code: 'Digit1'
        // key: '2', code: 'Digit2'
        // key: '3', code: 'Digit3'
        // key: '4', code: 'Digit4'
        // key: '5', code: 'Digit5'
        // key: '6', code: 'Digit6'
        // key: '7', code: 'Digit7'
        // key: '8', code: 'Digit8'
        // key: '9', code: 'Digit9'
        // key: '0', code: 'Digit0'

        console.log("not escape!", evt);
    }
};
