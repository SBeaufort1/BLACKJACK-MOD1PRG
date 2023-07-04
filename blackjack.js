var dealerSum = 0;
var yourSum = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var hidden;
var deck;
var money;
let bet;
var canHit = true; //allows the player (you) to draw while yourSum <= 21
let backImg = document.createElement("img");
backImg.src = "./cards/BACK.png";
window.onload = function() {
    money = parseFloat(localStorage.getItem("bankAccount")) || 2500; // Retrieve the money value from local storage or use a default value of 2500
    buildDeck();
    shuffleDeck();
    startGame();
    bank();
}
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    //console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg, backImg);
    }
    
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    //console.log(dealerSum);
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    //console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("resetBank").addEventListener("click", resetBankAccount);
}
function bank(){
    bankAccount = document.getElementById("bankAccount");
    bankAccount.innerHTML='Bank Account: $'+money;
    document.getElementById("submit").addEventListener("click", placeBet);
}
function resetBankAccount() {
    money = 2500;
    localStorage.setItem("bankAccount", money);
    bankAccount.innerHTML = 'Bank Account: $' + money;
    
  }
  
function placeBet(){
    betInput = document.getElementById("bet"); //grabs the value of bet element
    let bet =parseFloat(betInput.value);//turns the value into a number
if (money<=0){
    alert("you can't place anymore bets.");
} 
else{

    if (isNaN(bet) ||bet <=0) {// if nothing is entered or bet is 0 an alert for thr bet amount pops up
        alert("Please enter a valid bet amount.");
        betInput.value = ""; // Clear the input field
        return;
    }
        const betAmount = document.createElement('p');
        bankAccount.appendChild(betAmount);
        betAmount.innerHTML='Youve bet: $' +bet;
}   
}


function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        
    }
}
function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    canHit = false;
    backImg.remove();
    let hiddenImg = document.createElement("img");
    hiddenImg.src = "./cards/" + hidden + ".png";
    document.getElementById("dealer-cards").append(hiddenImg);

    let betInput = document.getElementById("bet");
    let bet = parseFloat(betInput.value); 
    
    let message = "";
    if (yourSum > 21) {
        message = "You Lose! Reload page to play again";        
        if (!isNaN(bet)) {
            money -= bet;
        }
        
    }
    else if (dealerSum > 21) {
        message = "You Win! Reload page to play again";
        if (!isNaN(bet)) {
            money += bet;
        }
    }

    else if (yourSum === dealerSum) {
        message = "Tie! Reload page to play again";
        
    }
    else if (yourSum > dealerSum) {
        message = "You Win! Reload page to play again";
        if (!isNaN(bet)) {
            money += bet;
        }
    }
    else {//
        message = "You Lose! Reload page to play again";
        if (!isNaN(bet)) {
            money -= bet;
        }
    }

    let bankAccount = document.getElementById("bankAccount");
    bankAccount.innerHTML = 'Bank Account: $' + money;
    
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    localStorage.setItem("bankAccount", money);//save value into the local storage
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];
    if (isNaN(value)) { // A J Q K
        if (value === "A") {
            return 11;
        } 
        else if (value === "J" || value === "Q" || value === "K") {
            return 10; // Assign a value of 10 to all face cards
        }
    }
    return parseInt(value);
}
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}









