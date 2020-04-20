var operator = "";
var arg1 = "";
var arg2 = "";
var opButtons = document.querySelectorAll(".op")
var numButtons = document.querySelectorAll(".num");
var expression = document.getElementById("expression");
var numberBox = document.getElementById("numberBox");
var equal = document.getElementById("equal");
var hasAnswer = false;
var hasPoint = false;
var answer;
var hasMinus = false;
function addListenersToOps() {
    for (var i = 0; i < opButtons.length; i++)
        opButtons[i].addEventListener("click", function () {
            if (numberBox.value == "" && this.textContent == "-") {
                numberBox.value += "-";
                hasMinus = true;
            }
            else {
                if (operator == "" || hasAnswer) {
                    operator = this.textContent;
                    if (!hasAnswer)
                        arg1 = numberBox.value;
                    else
                        arg1 = answer;
                    expression.textContent = arg1 + "\n" + operator;
                    numberBox.value = "";
                }
            }
            hasPoint = false;
        })
}

function addListenersToEuqal() {
    equal.addEventListener("click", function () {
        if (!arg1 == "") {
            arg2 = numberBox.value;
            expression.textContent += arg2 + "=";
            numberBox.value = "";
            calculate();
        }
        else {
            alert("error! please enter only numbers or negetive numbers to the box, not operrators. enter only one argument and use the operators buttons")
            clearAll();
        }
    })
}

function addListenersToNums() {
    for (var i = 0; i < numButtons.length; i++)
        numButtons[i].addEventListener("click", function () {
            numberBox.value= addCharToTheEnd(numberBox.value, this.textContent);
        })
}
function addListenerToDel() {
    var delButton = document.getElementById("del");
    delButton.addEventListener("click", function () {
        if(numberBox.value[numberBox.value.length-1]==".")
            hasPoint=false;
        numberBox.value = removeLastChar(numberBox.value);
    })
}
function addListenerToClear() {
    var clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", function () {
        clearAll();
    })
}
function addListenerToPoint() {
    var pointButton = document.getElementById("point");
    pointButton.addEventListener("click", function () {
        if (!hasPoint) {
            numberBox.value += ".";
            hasPoint = true;
        }
    })
}
function clearAll() {
    numberBox.value = "";
    expression.textContent = "";
    operator = "";
    hasAnswer = false;
    arg1 = "";
    arg2 = "";
    hasPoint = false;
    hasMinus = false;
}

function calculate() {
    hasAnswer = true;
    hasPoint = false;
    if (Number.isInteger(arg1))
        arg1 = parseInt(arg1);
    else
        arg1 = parseFloat(arg1);

    if (Number.isInteger(arg2))
        arg2 = parseInt(arg2);
    else
        arg2 = parseFloat(arg2);

    switch (operator) {
        case "+": {
            expression.textContent += (arg1 + arg2);
            answer = arg1 + arg2
        }
            break;
        case "-": {
            expression.textContent += arg1 - arg2;
            answer = arg1 - arg2;
        }
            break;
        case "*": {
            expression.textContent += arg1 * arg2;
            answer = arg1 * arg2;
        }
            break;
        case "/": {
            if (arg2 != 0) {
                expression.textContent += arg1 / arg2;
                answer = arg1 / arg2;
            }
            else {
                alert("ERROR - CANNOT DIVIDE BY 0")
                clearAll();
            }

        }
            break;
    }
    arg1 = "";
}
function addAllListeners() {
    addListenersToOps();
    addListenersToEuqal();
    addListenersToNums();
    addListenerToDel();
    addListenerToClear();
    addListenerToPoint();
}
function removeLastChar(str) {
    result = "";
    for (var i = 0; i < str.length - 1; i++) {
        result += str[i];
    }
    return result;
}
function addCharToTheEnd(str, ch){
    return str.concat(ch);
}

addAllListeners();