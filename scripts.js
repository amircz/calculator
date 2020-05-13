const EXPRESSION = document.querySelector(".expression");
const NUMBER_BOX = document.querySelector(".numberBox");
const MILLLION = 1000000;
let answer;
const EMPTY_ANSWER = "z";
let expressionWithCommaAfterAndBeforeOperators = "";
let hasPoint = false;
let opertatorsStack = [];
let numbersStack = [];
const ALL_OPERATORS = ["+", "-", "*", "/"];
let operationsObjectGlobal = {
    "+": (first, second) => { return first + second; },
    "-": (first, second) => { return first - second; },
    "*": (first, second) => { return first * second; },
    "/": (first, second) => {
        if (second == "0") {
            EXPRESSION.textContent = "ERROR - DIVIDE BY 0";
            clearAll(false);
            return "";
        }
        return first / second;
    }
};

clearAll(true);

function operatorClicked(event) {
    let toaddOperator = true;
    if (!ALL_OPERATORS.includes(NUMBER_BOX.value[NUMBER_BOX.value.length - 1])) {
        if (answer != EMPTY_ANSWER) {
            EXPRESSION.textContent = "";
            NUMBER_BOX.value += answer;
            answer = EMPTY_ANSWER;
        }
        if (NUMBER_BOX.value == "" && event.target.textContent != "-") {
            NUMBER_BOX.value += "0";
        }
    }
    else {

        //case of switching operator
        if (NUMBER_BOX.value.length != 1) {
            NUMBER_BOX.value = NUMBER_BOX.value.slice(0, NUMBER_BOX.value.length - 1);
        }
        else {

            //in case of expression which started with minus and than tried to change
            toaddOperator = false;
        }
    }
    hasPoint = false;
    if (toaddOperator) {
        NUMBER_BOX.value += event.target.textContent;
    }
}

function equalClicked(event) {
    if (NUMBER_BOX.value == "") {
        answer = 0;
        EXPRESSION.textContent = "0";
    }
    else {
        expressionWithCommaAfterAndBeforeOperators = "";
        EXPRESSION.textContent = NUMBER_BOX.value;
        if (ALL_OPERATORS.includes(EXPRESSION.textContent[EXPRESSION.textContent.length - 1])) {
            EXPRESSION.textContent = EXPRESSION.textContent.slice(0, EXPRESSION.textContent.length - 1);
        }
        createExpressionWithCommas();
        addExpressionToStackAndCalculatePriority(expressionWithCommaAfterAndBeforeOperators);
        calculateAndUpdateExpression();
        NUMBER_BOX.value = "";
    }
    hasPoint = false;
}

function numbersclicked(event) {
    if (NUMBER_BOX.value == "" && answer != EMPTY_ANSWER) {
        clearAll(true);
    }
    NUMBER_BOX.value = NUMBER_BOX.value.concat(event.target.textContent);
}

function deleteClicked(event) {
    NUMBER_BOX.value = NUMBER_BOX.value.slice(0, NUMBER_BOX.value.length - 1);
}

function pointClicked() {
    if (!hasPoint) {
        if (NUMBER_BOX.value == "" || ALL_OPERATORS.includes(NUMBER_BOX.value[NUMBER_BOX.value.length - 1])) {
            NUMBER_BOX.value += "0.";
        }
        else {
            NUMBER_BOX.value += ".";
        }
        hasPoint = true;
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
                if (document.activeElement == NUMBER_BOX) {
                    NUMBER_BOX.value = NUMBER_BOX.value.slice(0, NUMBER_BOX.value.length - 1);
                }
            }
            else {
                if (event.keyCode >= "0".charCodeAt(0) && event.keyCode <= "9".charCodeAt(0) &&
                    document.activeElement != NUMBER_BOX) {
                    if (answer != EMPTY_ANSWER && NUMBER_BOX.value == "") {
                        clearAll(true);
                    }
                    NUMBER_BOX.value += String.fromCharCode(event.keyCode);
                }
            }
        }
    })
}

//the goal of this function is to create a string which conatins the exercise but with , before and after each operator
//4+3*2  ->  4,+,3,*,2
function createExpressionWithCommas() {
    for (let boxIndex = 0; boxIndex < NUMBER_BOX.value.length; boxIndex++) {
        if (ALL_OPERATORS.includes(NUMBER_BOX.value[boxIndex])) {

            //if not starting with negetive number
            if (boxIndex != 0 || NUMBER_BOX.value[boxIndex] != "-") {
                expressionWithCommaAfterAndBeforeOperators += ",";
            }
            expressionWithCommaAfterAndBeforeOperators += NUMBER_BOX.value[boxIndex];
            expressionWithCommaAfterAndBeforeOperators += ",";
        }
        else {
            expressionWithCommaAfterAndBeforeOperators += NUMBER_BOX.value[boxIndex];
        }
    }
    if (expressionWithCommaAfterAndBeforeOperators[expressionWithCommaAfterAndBeforeOperators.length - 1] == ",")
        expressionWithCommaAfterAndBeforeOperators += "0";
}

function addExpressionToStackAndCalculatePriority(expression) {
    let currentArgument;
    let argumentsList = [];
    argumentsList = expression.split(",");
    let isFirst = true;
    while (argumentsList.length != 0) {
        currentArgument = argumentsList.shift();
        if (isFirst && currentArgument == "-") {
            currentArgument += argumentsList.shift();
        }
        if (currentArgument != "*" && currentArgument != "/") {
            if (currentArgument != "-" && currentArgument != "+") {
                currentArgument = Number.parseFloat(currentArgument);
                numbersStack.push(currentArgument);
            }
            else {
                opertatorsStack.push(currentArgument);
            }
        }
        else {
            numbersStack.push(operationsObjectGlobal[currentArgument](numbersStack.pop(), argumentsList.shift()));
        }
        isFirst = false;
    }
}

function calculateAndUpdateExpression() {
    let currentFirstArgument;
    let currentSecondArgument;
    let currentoperator;
    while (numbersStack.length != 1) {
        currentFirstArgument = numbersStack.shift();
        currentoperator = opertatorsStack.shift();
        currentSecondArgument = numbersStack.shift();
        numbersStack.unshift(operationsObjectGlobal[currentoperator](currentFirstArgument, currentSecondArgument));
    }
    answer = numbersStack.pop();
    fixAnswer();
    EXPRESSION.textContent += "=" + answer;
    numbersStack = [];
    opertatorsStack = [];

}

function fixAnswer() {
    answer *= MILLLION;
    answer = amswer = parseFloat(answer).toFixed(1);
    answer /= MILLLION;
}

function clearAll(toClearExpression) {
    if (toClearExpression) {
        EXPRESSION.textContent = "";
    }
    answer = EMPTY_ANSWER;
    NUMBER_BOX.value = "";
    expressionWithCommaAfterAndBeforeOperators = "";
    numbersStack.push(0);
    opertatorsStack.push("+");
    answer = EMPTY_ANSWER;
    hasPoint = false;
}

function addAllListeners() {
    let allButtonsListeners = {
        "num": numbersclicked,
        "clear": clearAll,
        "equal": equalClicked,
        "del": deleteClicked,
        "op": operatorClicked,
        "point": pointClicked
    }

    let allButtons = document.getElementsByTagName("button");
    Array.from(allButtons).forEach(element => element.onclick = allButtonsListeners[element.className]);

}

addAllListeners();
addListenerToKeyBoard();