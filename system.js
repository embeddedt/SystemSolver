/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var possibleItems = [ 
    "drum.svg",
    "car.svg",
    "guitar.svg",
    "ladybug.svg",
    "popsicle.svg",
    "present.svg",
    "pumpkin.svg",
    "star.svg"
];

var visibleSection;

var item1, item2, item3;

var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;

var val1, val2, val3;

var levelNum;

var attempts = 0;

var coef_val2;

var theEquation;

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

function generateItems() {
    var index1 = getRandomInt(0, possibleItems.length - 1);
    var index2, index3;
    do {
        index2 = getRandomInt(0, possibleItems.length - 1);
    } while(index2 === index1);
    do {
        index3 = getRandomInt(0, possibleItems.length - 1);
    } while(index3 === index2 || index3 === index1);
    item1 = possibleItems[index1];
    item2 = possibleItems[index2];
    item3 = possibleItems[index3];
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTwoShelfEquation() {
    var lhs, rhs, b, num_val1;
    do {
        if(levelNum === 1)
            val1 = getRandomInt(4, 12);
        else
            val1 = getRandomInt(4, 32);
        if(getRandomInt(0, 1) === 1) {
            val2 = val1 * getRandomInt(2, 4);
        } else {
            val2 = val1 / getRandomInt(2, 4);
        }
        val2 = Math.round(val2);

        num_val1 = getRandomInt(1, 4);
        /* num_val2 is calculated below */
        lhs = new Expression("x");
        lhs = lhs.multiply(num_val1);

        rhs = new Expression("b");
        rhs = rhs.multiply(val2);

        /* 'b' will become the coefficient for the other side */

        theEquation = new Equation(lhs.eval({ x : val1 }), rhs);
        b = theEquation.solveFor("b");
        /* b is the theoretical num_val2 */
    } while(!Number.isInteger(b.valueOf()) || b.valueOf() > 4);
    
    
    
    theEquation = new Equation(lhs, new Expression("y").multiply(b));
    generateItems();
    
    /* Put items on the shelves */
    
    /* The first shelf should have some number of the first item to allow for easy
     * identification
     */
    var numOfFirstItems = getRandomInt(1, 5);
    var $leftShelfContents = $("#first-shelf").find(".shelf-contents");
    var $rightShelfContents = $("#second-shelf").find(".shelf-contents");
    $leftShelfContents.empty();
    $rightShelfContents.empty();
    for(var i = 0; i < numOfFirstItems; i++) {
        var item = document.createElement("img");
        item.classList.add("shelf-contents-img");
        item.src = item1;
        $leftShelfContents.append(item);
    }
    $("#first-shelf").find(".shelf-text").find("span").text(numOfFirstItems*val1);
    
    /* The second shelf should match the coefficients of the equation */
    coef_val2 = b;
    $("#second-shelf").find(".shelf-text").find("span").text(num_val1*val1 + val2*b);
    for(var i = 0; i < num_val1; i++) {
        var item = document.createElement("img");
        item.classList.add("shelf-contents-img");
        item.src = item1;
        $rightShelfContents.append(item);
    }
    for(var i = 0; i < b; i++) {
        var item = document.createElement("img");
        item.classList.add("shelf-contents-img");
        item.src = item2;
        $rightShelfContents.append(item);
    }
    $("#third-shelf").hide();
    $('.shelf-text').textfill();
}

function getFactors(num) {
  const isEven = num % 2 === 0;
  let inc = isEven ? 1 : 2;
  let factors = [1];
  
  if(num !== 1)
      factors.push(num);

  for (let curFactor = isEven ? 2 : 3; Math.pow(curFactor, 2) <= num; curFactor += inc) {
    if (num % curFactor !== 0) continue;
    factors.push(curFactor);
    let compliment = num / curFactor;
    if (compliment !== curFactor) factors.push(compliment);
  }

  return factors.sort(function(a, b){return a - b;});
}

function generateThreeShelfEquation() {
    /* Generate a two shelf equation first */
    generateTwoShelfEquation();
    
    do {
        if(getRandomInt(0, 1) === 1) {
            val3 = val2 * getRandomInt(1, 3);
        } else {
            val3 = val2 / getRandomInt(1, 3);
        }
        val3 = Math.round(val3);

        var lhs = theEquation.rhs.copy();
        var rhs = new Expression("b");
        rhs = rhs.multiply(val3);
        var b = new Equation(lhs.eval({ y: val2 }), rhs).solveFor("b");
        rhs = new Expression("z").multiply(b);
    } while(!Number.isInteger(b.valueOf()));
    var $thirdShelfContents = $("#third-shelf").find(".shelf-contents");
    $thirdShelfContents.empty();
    var numOfSecondItems = getRandomInt(1, 4);
    for(var i = 0; i < numOfSecondItems; i++) {
        var item = document.createElement("img");
        item.classList.add("shelf-contents-img");
        item.src = item2;
        $thirdShelfContents.append(item);
    }
    for(var i = 0; i < b; i++) {
        var item = document.createElement("img");
        item.classList.add("shelf-contents-img");
        item.src = item3;
        $thirdShelfContents.append(item);
    }
    $("#third-shelf").show();
    $("#third-shelf").find(".shelf-text").find("span").text(numOfSecondItems*val2 + val3*b);
    console.log(val1 + " " + val2 + " " + val3);
    
}

function nextEquation() {
    if(levelNum === 3)
        generateThreeShelfEquation();
    else
        generateTwoShelfEquation();
    $('.shelf-text').textfill();
    $("#check-button").attr("disabled", false);
    $("#error-msg").text("");
    var str;
    if(levelNum === 3)
        str = item3;
    else
        str= item2;
    attempts = 0;
    $("#item-name").text(str.substr(0, str.indexOf('.')));
}

function doTextFill(parent) {
    if(parent === undefined)
        parent = visibleSection;
    console.log("Width: " + parent.find(".shelf-text").width());
    console.log("Height: " + parent.find(".shelf-text").height());
    
    $(".shelf-text").textfill({ 
        explicitWidth: parent.find(".shelf-text").width(),
        explicitHeight: parent.find(".shelf-text").height()
    }); 
}

function showGameInstructions() {
    $("#real-game").hide();
    $("#game-instructions").show();
    visibleSection = $("#game-instructions");
    doTextFill();
}
$(window).load(function() {
    
    
    
    $(window).resize(function() {
        doTextFill();
    });
    $(".level-button").click(function() {
        levelNum = parseInt($(this).attr("data-num"));
        
        $("#game-instructions").hide();
        $("#real-game").show();
        visibleSection = $("#real-game");
        doTextFill();
        nextEquation();
    });
    showGameInstructions();
    $("#check-button").click(function() {
        var correctVal;
        if(levelNum < 3) {
            correctVal = val2;
        } else
            correctVal = val3;
        var val = parseInt($("#item-number").val());
        if(isNaN(val))
            return;
        else {
            if(val !== correctVal) {
                $("#error-msg").addClass("error-color");
                $("#error-msg").removeClass("good-color");
                $("#error-msg").text("Nope. Try again.");
                attempts++;
                if(attempts === 3) {
                    $("#error-msg").text("The answer is " + correctVal + ". Let's try something else.");
                    setTimeout(nextEquation, 2000);
                    $("#check-button").attr("disabled", true);
                }
            } else {
                $("#error-msg").removeClass("error-color");
                $("#error-msg").addClass("good-color");
                $("#error-msg").text("Great job!");
                $("#check-button").attr("disabled", true);
                setTimeout(nextEquation, 2000);
            }
            $("#error-msg")[0].scrollIntoView();
        }
    });
});
