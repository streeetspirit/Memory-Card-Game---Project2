/*
 * List that holds all cards, two for each picture
 */
let cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb","fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const deck = $(".deck");

/*
 * Display the cards on the page
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function resetCanvas() {
  shuffle(cards);
  deck.html("");
  for (const card of cards)
    {
      let newLi = `<li class="card">
      <i class="fa ${card}"></i>
    </li>`
      deck.append(newLi);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a deck. If a card is clicked:
 *  - display the card's symbol
 *  - add the card to array cardPair of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol
 *    + increment the move counter and display it on the page
 *    + if all cards have matched, display a message with the final score
 */

let cardPair = [];
let interval;

resetCanvas();

deck.click(function(event) {
  const target = $(event.target);
  console.log(target);

  if (target.is("li") && !target.hasClass("open") && !target.hasClass("match")) {
    if (!started) {
      started = true;
      startTimer();
    };
    showCard(target);
    countCard(target);
    updateStats();
  }
});

// mark card as visible and open (visible status is needed for keeping a card facing up a little longer)
function showCard (target) {
  target.addClass("open");
  target.addClass("show");
}

// add card to a list. if the list already has another card, check to see if the two cards match
function countCard(target) {
  cardPair.push(target.find("i").attr('class'));
  console.log(cardPair);
  let pairElements = $("ul.deck").find("li.open");

  if (cardPair.length===2) {
    checkIfMatching(cardPair, pairElements);
    cleanUpOpenCards(cardPair, pairElements);
  }
}

// check if cards match, if yes - mark cards as matching
function checkIfMatching(cardPair, pairElements) {
  if (cardPair[0]===cardPair[1]) {
    pairElements.addClass("match");
  }
}

// remove Open style for all cards, but show them a little longer on the screen
function cleanUpOpenCards(cardPair, pairElements) {
  cardPair.splice(0,2);
  pairElements.removeClass("open");
  let intervalId = setInterval(function() {
    pairElements.removeClass("show");
    clearInterval(intervalId);
  }, 500);
}

// here follows implementaion of star counter, moves counter and a timer
// started - flag for starting time counter

let stars_count = 3;
let moves_count = 0;
let started = false;


const stars = $(".stars");
const moves = $(".moves");
const timer = $(".timer");
const reset = $(".restart");

function setToDefault () {
  stars_count = 3;
  moves_count = 0;
  started = false;
  stars.html(`<li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>`);
  moves.html(moves_count + " moves");
  timer.html("00:00:00");
  clearInterval(interval);
  console.log (stars.innerHTML);

  // clear and shuffle cards
  resetCanvas();
  cardPair = [];
}

reset.click (function(event) {
  setToDefault();
});

function startTimer() {
  let seconds = 0, minutes = 0, hours = 0;

  interval = setInterval(function() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    console.log (seconds);
    timer.html((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
  }, 1000);
}

function updateStats() {
  moves_count++;
  moves_count > 1 ? moves.html(moves_count + " moves") : moves.html(moves_count + " move");

}
