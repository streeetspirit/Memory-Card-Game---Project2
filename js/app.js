/*
 * List that holds all cards, two for each picture
 */
let cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb","fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

shuffle(cards);

/*
 * Display the cards on the page
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const deck = $(".deck");

for (const card of cards)
  {
    let newLi = `<li class="card">
    <i class="fa ${card}"></i>
  </li>`
    deck.append(newLi);
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

deck.click(function(event) {
  const target = $(event.target);
  console.log(target);
  if (target.is("li") && !target.hasClass("open") && !target.hasClass("match")) {
    showCard(target);
    countCard(target);
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
  var intervalId = setInterval(function() {
    pairElements.removeClass("show");
    clearInterval(intervalId);
  }, 500);
}
