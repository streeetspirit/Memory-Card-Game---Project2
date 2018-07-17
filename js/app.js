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
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let cardPair = [];

deck.click(function(event) {
  const target = $(event.target);
  if (target.is("li")) {
    showCard(target);
    countCard(target);
  }
});

function showCard (target) {
    target.addClass("open");
}

function countCard(target) {
  cardPair.push(target);
  console.log(cardPair.length);
  if (cardPair.length===2)
  {
      if (cardPair[0].className==cardPair[1].className)
      {
        console.log(cardPair[0]);
        console.log(cardPair[1].className);
        target.addClass("match");
      }
      target.removeClass("open");
      cardPair.splice(0,2);
  }
}
