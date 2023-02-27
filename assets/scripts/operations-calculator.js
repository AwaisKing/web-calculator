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
        } else if (btnVal == "⌫") {
            if (display.innerHTML.length > 0) display.innerHTML = display.innerHTML.substr(0, display.innerHTML.length - 1);

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
    else if (hasKey ? evt.key === "Backspace" || evt.code == "Backspace" : evt.keyCode === 8) btnClicker("signed");

    else if (hasKey ? evt.key === "Enter" : evt.keyCode === 13) btnClicker("equals");
    else if (hasKey ? evt.key === "+" || evt.key === "Plus" : evt.keyCode === 171) btnClicker("plus");
    else if (hasKey ? evt.key === "=" || evt.key === "Equal" : evt.keyCode === 187) btnClicker(evt.shiftKey ? "plus" : "equals");
    
    else if (hasKey ? evt.key === "1" || evt.key == "Digit1" || evt.code == "Digit1" : evt.keyCode === 49) btnClicker("one");
    else if (hasKey ? evt.key === "2" || evt.key == "Digit2" || evt.code == "Digit2" : evt.keyCode === 50) btnClicker("two");
    else if (hasKey ? evt.key === "3" || evt.key == "Digit3" || evt.code == "Digit3" : evt.keyCode === 51) btnClicker("three");
    else if (hasKey ? evt.key === "4" || evt.key == "Digit4" || evt.code == "Digit4" : evt.keyCode === 52) btnClicker("four");
    
    else if (hasKey ? evt.key === "%" || evt.key == "Percent" || evt.code == "Percent" : evt.shiftKey && evt.keyCode === 53) btnClicker("percent");
    else if (hasKey ? evt.key === "5" || evt.key == "Digit5" || evt.code == "Digit5" : evt.keyCode === 53) btnClicker(evt.shiftKey ? "percent" : "five");

    else if (hasKey ? evt.key === "6" || evt.key == "Digit6" || evt.code == "Digit6" : evt.keyCode === 54) btnClicker("six");
    else if (hasKey ? evt.key === "7" || evt.key == "Digit7" || evt.code == "Digit7" : evt.keyCode === 55) btnClicker("seven");

    else if (hasKey ? evt.key === "*" || evt.code == "*" : evt.shiftKey && evt.keyCode === 56) btnClicker("times");
    else if (hasKey ? evt.key === "8" || evt.key == "Digit8" || evt.code == "Digit8" : evt.keyCode === 56) btnClicker(evt.shiftKey ? "times": "eight");

    else if (hasKey ? evt.key === "9" || evt.key == "Digit9" || evt.code == "Digit9" : evt.keyCode === 57) btnClicker("nine");
    else if (hasKey ? evt.key === "0" || evt.key == "Digit0" || evt.code == "Digit0" : evt.keyCode === 48) btnClicker("zero");
    
    else if (hasKey ? evt.key === "/" || evt.key == "Slash" || evt.code == "Slash" : evt.keyCode === 191) btnClicker("divide");


    else {
        console.log("not escape!", evt);
    }
};
