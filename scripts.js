const expression = document.querySelector(".expression");
const numberBox = document.querySelector(".numberBox");
var answer;
var operator;
var firstArgument;
var secondArgument;
var hasAnswer;

clearAll();

function setSecondArgumentAndCalculate(value) {
    secondArgument = value;
    expression.textContent += secondArgument + "=";
    numberBox.value = "";
    calculate();
}

function operatorClicked(event) {
    if (operator == "" || hasAnswer) {
        setOperatorAndFirstArgument(event.target.textContent);
    }
    else {
        setOperatorAndExpression(event.target.textContent);
    }
}

function setOperatorAndFirstArgument(op) {
    operator = op;
    if (!hasAnswer) {
        if (numberBox.value == ""||numberBox.value=="-") {
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
    if (numberBox.value == "" && !hasAnswer) {
        numberBox.value += "-";
    }
    else {
        operatorClicked(event);
    }
}


function equalClicked(event) {
    if (numberBox.value != ""&&numberBox.value!="-") {
        if (firstArgument != "") {
            setSecondArgumentAndCalculate(numberBox.value)
        }
        else {
            answer = numberBox.value;
            expression.textContent = answer;
        }
        hasAnswer = true;
    }
    else {
        if (firstArgument != ""&&numberBox.value!="-") {
            setSecondArgumentAndCalculate(firstArgument);
        }
        else {
            if (hasAnswer&&numberBox.value!="-") {
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
        let equalButton=document.getElementById("equal");
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
            if (event.keyCode >= 48 && event.keyCode <= 57 && document.activeElement != numberBox) {
                numberBox.value += String.fromCharCode(event.keyCode);
            }
            if (event.keyCode == 190 && document.activeElement != numberBox) {
                numberBox.value += ".";
            }
        }
    })
}


function clearAll() {
    numberBox.value = "";
    expression.textContent = "";
    operator = "";
    hasAnswer = false;
    firstArgument = "";
    secondArgument = "0";
}


function calculate() {
    let operationsObject = {
        "+": () => { return firstArgument + secondArgument; },
        "-": () => { return firstArgument - secondArgument; },
        "*": () => { return firstArgument * secondArgument; },
        "/": () => {
            if (secondArgument == "0") {
                alert("ERROR - CANNOT DIVIDE BY 0");
                clearAll();
                return "";
            }
            return firstArgument / secondArgument;
        }  
    };

    let maxDigitsFterPoint;

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
    hasAnswer = true;
    firstArgument = "";
    numberBox.value="";
}

function getNumberOfDigitsAfterPoint(num) {
    for (let digitIndex = 0; digitIndex < num.length; digitIndex++) {
        if (num[digitIndex] == ".")
            return num.length - digitIndex - 1;
    }
    return 0;
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

    var allButtons = document.getElementsByTagName("button");
    Array.from(allButtons).forEach(element => element.onclick = allButtonsListeners[element.className]);

}


function castArgumentsToFloat() {
    firstArgument = Number.parseFloat(firstArgument);
    secondArgument = Number.parseFloat(secondArgument);
}

addAllListeners();
addListenerToKeyBoard();