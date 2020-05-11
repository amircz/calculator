const expression = document.querySelector(".expression");
const numberBox = document.querySelector(".numberBox");
let answer;
const emptyAnswer = "z";
let complexExpHelper = "";
let expressionStack = [];
const allOperators = ["+", "-", "*", "/"];
let operationsObjectGlobal = {
    "+": (first, second) => { return first + second; },
    "-": (first, second) => { return first - second; },
    "*": (first, second) => { return first * second; },
    "/": (first, second) => {
        if (second == "0") {
            expression.textContent = "ERROR - DIVIDE BY 0";
            clearAll(false);
            return "";
        }
        return first / second;
    }
};

clearAll(true);

function operatorClicked(event) {
    if (!allOperators.includes(numberBox.value[numberBox.value.length - 1])) {
        if (answer != emptyAnswer) {
            expression.textContent = "";
            numberBox.value += answer;
            answer = emptyAnswer;
        }
        if (numberBox.value == "" && event.target.textContent != "-") {
            numberBox.value += "0";
        }
        numberBox.value += event.target.textContent;
    }
}

function minusClicked(event) {
    operatorClicked(event);
}

function equalClicked(event) {
    if (numberBox.value == "") {
        answer = 0;
        expression.textContent = "0";
    }
    else {
        complexExpHelper = "";
        expression.textContent = numberBox.value;
        createHelper();
        addExpressionToStackAndCalculatePriority(complexExpHelper);
        calculateAndUpdateExpression();
        numberBox.value = "";
    }
}

function numbersclicked(event) {
    if (numberBox.value == "" && answer != emptyAnswer) {
        clearAll(true);
    }
    numberBox.value = numberBox.value.concat(event.target.textContent);
}

function deleteClicked(event) {
    numberBox.value = numberBox.value.slice(0, numberBox.value.length - 1);
}

function pointClicked() {
    if (numberBox.value[numberBox.value.length - 1] != ".") {
        if (numberBox.value == "") {
            numberBox.value += "0.";
        }
        else {
            numberBox.value += ".";
        }
    }
}

function addListenerToKeyBoard() {
    document.addEventListener("keydown", event => {
        let plusButton = document.getElementById("plus");
        let minusButton = document.getElementById("minus");
        let multButton = document.getElementById("mult");
        let divideButton = document.getElementById("divide");
        let equalButton = document.getElementById("equal");
        let pointButon = document.getElementById("point");
        let operationsObject = {
            "187": plusButton,
            "189": minusButton,
            "56": multButton,
            "191": divideButton,
            "13": equalButton,
            "190": pointButon
        };
        //equal case
        if (event.keyCode == "13") {
            operationsObject[event.keyCode].click();
        }
        else {
            if (event.keyCode in operationsObject) {
                operationsObject[event.keyCode].click();
                if (document.activeElement == numberBox) {
                    numberBox.value = numberBox.value.slice(0, numberBox.value.length - 1);
                }
            }
            else {
                if (event.keyCode >= "0".charCodeAt(0) && event.keyCode <= "9".charCodeAt(0) &&
                    document.activeElement != numberBox) {
                    if (answer != emptyAnswer && numberBox.value == "") {
                        clearAll(true);
                    }
                    numberBox.value += String.fromCharCode(event.keyCode);
                }
            }
        }
    })
}

//the goal of this is to create a string which conatins the exercise but with , before and after each operator
function createHelper() {
    for (let boxIndex = 0; boxIndex < numberBox.value.length; boxIndex++) {
        if (allOperators.includes(numberBox.value[boxIndex])) {

            //if not starting with negetive number
            if (boxIndex != 0 || numberBox.value[boxIndex] != "-") {
                complexExpHelper += ",";
            }
            complexExpHelper += numberBox.value[boxIndex];
            complexExpHelper += ",";
        }
        else {
            complexExpHelper += numberBox.value[boxIndex];
        }
    }
}

function addExpressionToStackAndCalculatePriority(expression) {
    let tempArgument;
    let tempOp;
    let argumentsList = [];
    argumentsList = expression.split(",");
    let isFirst = true;
    while (argumentsList.length != 0) {
        tempArgument = argumentsList.shift();
        if (isFirst && tempArgument == "-") {
            tempArgument += argumentsList.shift();
        }
        if (tempArgument != "*" && tempArgument != "/") {
            if (tempArgument != "-" && tempArgument != "+") {
                tempArgument = Number.parseFloat(tempArgument);
            }
            expressionStack.push(tempArgument);
        }
        else {
            expressionStack.push(operationsObjectGlobal[tempArgument](expressionStack.pop(), argumentsList.shift()));
        }
        isFirst = false;
    }
}

function calculateAndUpdateExpression() {
    let tempFirst;
    let tempSecond;
    let tempOp;
    while (expressionStack.length != 1) {
        tempFirst = expressionStack.shift();
        tempOp = expressionStack.shift();
        tempSecond = expressionStack.shift();
        expressionStack.unshift(operationsObjectGlobal[tempOp](tempFirst, tempSecond));
    }
    answer = expressionStack.pop();
    expression.textContent += "=" + answer;
    expressionStack = [];

}

function clearAll(toClearExpression) {
    if (toClearExpression) {
        expression.textContent = "";
    }
    answer = emptyAnswer;
    numberBox.value = "";
    complexExpHelper = "";
    expressionStack.push(0);
    expressionStack.push("+");
    answer = emptyAnswer;
}

function addAllListeners() {
    let allButtonsListeners = {
        "num": numbersclicked,
        "clear": clearAll,
        "equal": equalClicked,
        "del": deleteClicked,
        "op": operatorClicked,
        "minus": minusClicked,
        "point": pointClicked
    }

    let allButtons = document.getElementsByTagName("button");
    Array.from(allButtons).forEach(element => element.onclick = allButtonsListeners[element.className]);

}

addAllListeners();
addListenerToKeyBoard();