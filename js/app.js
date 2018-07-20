/*
 * List that holds all cards, two for each picture
 */
const singlecards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const cards = singlecards.concat(singlecards);
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
  if ($("ul.deck").find("li.match").length === 16) {
    clearInterval(interval);
    setTimeout(function() {
      winnerPopup();
    }, 700);


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
  setTimeout(function() {
    pairElements.removeClass("show");
  }, 500);

}

// here follows implementaion of star counter, moves counter and a timer
// started - flag for starting time counter

let moves_count = 0;
let started = false;


const stars = $(".stars");
const moves = $(".moves");
const timer = $(".timer");
const reset = $(".restart");

function setToDefault () {
  moves_count = 0;
  started = false;
  stars.html(`<li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>`);
  moves.html(moves_count + " moves");
  timer.html("00:00:00");
  clearInterval(interval);

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

    timer.html((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
  }, 1000);
}

function updateStats() {
  moves_count++;
  moves_count > 1 ? moves.html(moves_count + " moves") : moves.html(moves_count + " move");

//reduce amount of stars if too many moves
  if (moves_count > 22 && moves_count <= 32) {
    stars.html(`<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`);
  } else if (moves_count > 33) {
    stars.html(`<li><i class="fa fa-star"></i></li>`);
  }

}

let scoreRecord;

//if all cards have matched, display a message with the final score
function winnerPopup () {
  const popup = $(".popup");
  const closeit = $(".close");
  const message = $(".stats");
  scoreRecord = "";
  message.html(`<p>It took you ${moves_count} moves to solve it!</p>
    <p>Your time is ${timer.html()}</p>
    <ul class="stars">${stars.html()}</ul>`);

  popup.css("display", "block");
  closeit.click(function(event) {
    popup.css("display", "none");
  });

  scoreRecord = `<li><strong>Time:</strong> ${timer.html()}, <strong>Moves:</strong> ${moves_count}, `;
  setToDefault();
}
// save player's name and hide the popup
$(".ok").click(function saveRecord(event) {
  let name = $(".input").val();
  scoreRecord += `<strong>Name:</strong> ${name}</li>`;
  $("#scoreboard").append(scoreRecord);
  $(".popup").css("display", "none");
});

// if Enter key is pressed in the input field - do the same as if Ok button is pressed
$(".input").keypress(function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $(".ok").click();
  }
});
