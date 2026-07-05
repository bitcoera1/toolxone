let justCalculated = false;

function appendValue(value){

    const display = document.getElementById("display");

    const operators = ["+", "-", "*", "/"];

    if(justCalculated){

        if(operators.includes(value)){
            justCalculated = false;
        }
        else if(!isNaN(value)){
            display.value = "";
            justCalculated = false;
        }

    }

    display.value += value;

}
function clearDisplay(){
    document.getElementById("display").value = "";
}

function calculate(){

    try{

        document.getElementById("display").value =
        eval(document.getElementById("display").value);

        justCalculated = true;

    }

    catch{

        document.getElementById("display").value = "Error";

    }

}

document.addEventListener("keydown", function(e){
    if(!isNaN(e.key)){
        appendValue(e.key);
    }

    if(["+","-","*","/","."].includes(e.key)){
        appendValue(e.key);
    }

    if(e.key === "Enter"){
        e.preventDefault();
        calculate();
    }

    if(e.key === "Backspace"){
        let display = document.getElementById("display");
        display.value = display.value.slice(0,-1);
    }

    if(e.key === "Delete" || e.key === "Escape"){
        clearDisplay();
    }
});
