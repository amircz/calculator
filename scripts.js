var operator = "";
var firstArgument = "";
var secondArgument = "0";
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
                    if (!hasAnswer) {
                        if (numberBox.value == "") {
                            firstArgument = "0";
                        }
                        else {
                            firstArgument = numberBox.value;
                        }
                    }
                    else
                        firstArgument = answer;
                    expression.textContent = firstArgument + "\n" + operator;
                    numberBox.value = "";
                }
            }
            hasPoint = false;
        })
}

function addListenersToEuqal() {
    equal.addEventListener("click", function () {
        if (numberBox.value != "") {
            if (firstArgument != "") { 
            secondArgument = numberBox.value;
            expression.textContent += secondArgument + "=";
            numberBox.value = "";
            calculate();
        }
        else {
            answer = numberBox.value;
            expression.textContent = answer;
        }
        hasAnswer = true;
    }
    else{
        clearAll();
    }
    })
}

function addListenersToNums() {
    for (var i = 0; i < numButtons.length; i++) {
        numButtons[i].addEventListener("click", function () {
            numberBox.value = numberBox.value.concat(this.textContent);
        })
    }
}

function numbersclicked(event){
    console.log("mike");
    numberBox.value = numberBox.value.concat(event.target.textContent);
}

function addListenerToDel() {
    var delButton = document.getElementById("del");
    delButton.addEventListener("click", function () {
        if (numberBox.value[numberBox.value.length - 1] == ".") {
            hasPoint = false;
        }
        numberBox.value = numberBox.value.slice(0, numberBox.value.length - 1);
    })
}
function addListenerToClear() {
    var clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearAll);
}
function addListenerToPoint() {
    var pointButton = document.getElementById("point");
    pointButton.addEventListener("click", function () {
        if (!hasPoint) {
            if (numberBox.value == "") {
                numberBox.value += "0.";
            }
            else {
                numberBox.value += ".";
            }
            hasPoint = true;
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
    hasPoint = false;
    hasMinus = false;
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


    castArgumentsToFloat();
    answer = operationsObject[operator]();
    expression.textContent += answer;
    hasAnswer = true;
    hasPoint = false;
    firstArgument = "";
}

//     switch (operator) {
//         case "+": {
//             expression.textContent += (firstArgument + secondArgument);
//             answer = firstArgument + secondArgument
//         }
//             break;
//         case "-": {
//             expression.textContent += firstArgument - secondArgument;
//             answer = firstArgument - secondArgument;
//         }
//             break;
//         case "*": {
//             expression.textContent += firstArgument * secondArgument;
//             answer = firstArgument * secondArgument;
//         }
//             break;
//         case "/": {
//             if (secondArgument != 0) {
//                 expression.textContent += firstArgument / secondArgument;
//                 answer = firstArgument / secondArgument;
//             }
//             else {
//                 alert("ERROR - CANNOT DIVIDE BY 0")
//                 clearAll();
//             }

//         }
//             break;
//     }
//     firstArgument = "";
// }
function addAllListeners() {
    addListenersToOps();
    addListenersToEuqal();
    //addListenersToNums();
    addListenerToDel();
    addListenerToClear();
    addListenerToPoint();
    numButtons.forEach(element=>element.onclick=numbersclicked);

}
function removeLastChar(str) {
    result = "";
    for (var i = 0; i < str.length - 1; i++) {
        result += str[i];
    }
    return result;
}

function castArgumentsToFloat() {
    firstArgument = Number.parseFloat(firstArgument);
    secondArgument = Number.parseFloat(secondArgument);
}

addAllListeners();