const expression = document.querySelector(".expression");
const numberBox = document.querySelector(".numberBox");
let answer;
let operator;
let firstArgument;
let secondArgument;

let operationsObject = {
    "+": () => { return firstArgument + secondArgument; },
    "-": () => { return firstArgument - secondArgument; },
    "*": () => { return firstArgument * secondArgument; },
    "/": () => {
        if (secondArgument == "0") {
            expression.textContent = "ERROR - CANNOT DIVIDE BY 0";
            clearAll(false);
            return "";
        }
        return firstArgument / secondArgument;
    }
};

clearAll(true);

function setSecondArgumentAndCalculate(value) {
    secondArgument = value;
    expression.textContent += secondArgument + "=";
    numberBox.value = "";
    calculate();
}

function operatorClicked(event) {
    if (operator == "" || answer != "") {
        setOperatorAndFirstArgument(event.target.textContent);
    }
    else {
        setOperatorAndExpression(event.target.textContent);
    }
}

function setOperatorAndFirstArgument(op) {
    operator = op;
    if (answer == "") {
        if (numberBox.value == "") {
            firstArgument = "0";
        }
        else {
            firstArgument = numberBox.value;
        }
    }
    else {
        firstArgument = answer;
    }
    expression.textContent = firstArgument + operator;
    numberBox.value = "";
}

function setOperatorAndExpression(op) {
    operator = op;
    expression.textContent = firstArgument + operator;
}

function minusClicked(event) {
    if (numberBox.value == "" && answer == "") {
        numberBox.value += "-";
    }
    else {
        operatorClicked(event);
    }
}

function equalClicked(event) {
    if (numberBox.value != "" && numberBox.value != "-") {
        if (firstArgument != "") {
            setSecondArgumentAndCalculate(numberBox.value)
        }
        else {
            answer = numberBox.value;
            expression.textContent = answer;
            numberBox.value = "";
        }
    }
    else {
        if (firstArgument != "" && numberBox.value != "-") {
            setSecondArgumentAndCalculate(firstArgument);
        }
        else {
            if (answer != "" && numberBox.value != "-") {
                firstArgument = answer;
                expression.textContent = firstArgument + operator + secondArgument + "=";
                calculate();
            }
        }
    }
}

function numbersclicked(event) {
    numberBox.value = numberBox.value.concat(event.target.textContent);
}

function deleteClicked(event) {
    numberBox.value = numberBox.value.slice(0, numberBox.value.length - 1);
}

function pointClicked() {
    if (!numberBox.value.includes(".")) {
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
        let operationsObject = {
            "187": plusButton,
            "189": minusButton,
            "56": multButton,
            "191": divideButton,
            "13": equalButton
        };
        if (event.keyCode in operationsObject) {
            operationsObject[event.keyCode].click();
        }
        else {
            //digit case ascii between 48 and 57
            if (event.keyCode >= "0".charCodeAt(0) && event.keyCode <= "9".charCodeAt(0) && document.activeElement != numberBox) {
                numberBox.value += String.fromCharCode(event.keyCode);
            }
            //point case
            if (event.keyCode == 190 && document.activeElement != numberBox) {
                numberBox.value += ".";
            }
        }
    })
}

function clearAll(toClearExpression) {
    if (toClearExpression) {
        expression.textContent = "";
    }
    answer = "";
    numberBox.value = "";
    operator = "";
    firstArgument = "";
    secondArgument = "0";
}

function calculate() {

    let maxDigitsFterPoint;
    let needToFix = false;

    if (firstArgument.toString().includes(".") || secondArgument.toString().includes(".")) {
        maxDigitsFterPoint = getNumberOfDigitsAfterPoint(firstArgument) +
            getNumberOfDigitsAfterPoint(secondArgument);
    }

    castArgumentsToFloat();
    answer = operationsObject[operator]();
    if (maxDigitsFterPoint != undefined) {
        answer = answer.toFixed(maxDigitsFterPoint);
    }

    setAllVariablesAfterCalculation();
}

function setAllVariablesAfterCalculation() {
    expression.textContent += answer;
    firstArgument = "";
    numberBox.value = "";
}

function getNumberOfDigitsAfterPoint(num) {
    return num.length - getPointIndex(num) - 1;
}

function getPointIndex(num) {
    for (let digitIndex = 0; digitIndex < num.length; digitIndex++) {
        if (num[digitIndex] == ".") {
            return digitIndex;
        }

    }
    return 0;
}
function getNumberOfZerosToFix(num) {
    let count = 0;
    for (let digitIndex = num.length - 1; num > getPointIndex(num); digitIndex--) {
        if (num[digitIndex] == "0") {
            count++;
        }
        else {
            return getNumberOfDigitsAfterPoint(num) - count;
        }
    }
    return getNumberOfDigitsAfterPoint(count) - count;
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

function castArgumentsToFloat() {
    firstArgument = Number.parseFloat(firstArgument);
    secondArgument = Number.parseFloat(secondArgument);
}

addAllListeners();
addListenerToKeyBoard();