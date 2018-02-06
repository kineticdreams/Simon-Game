const lever = document.querySelector(".lever");
const start = document.querySelector(".start");
const strictDot = document.querySelector(".dot");
const colors = document.querySelectorAll("section");
const display = document.querySelector(".display");

const greenSound = new Audio(
   "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
);
const redSound = new Audio(
   "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
);
const blueSound = new Audio(
   "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
);
const yellowSound = new Audio(
   "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
);

const usingFirefox = navigator.userAgent.search("Firefox") > -1;

if (usingFirefox) console.log("You are using Firefox");

let sequence = Array();
let sequencePlayer = Array();
let level = 1;
let switchOn = false;
let strictOn = false;
let indexClick = 0;

function switchOnOff() {
   if (switchOn === false) {
      displayMessage("--", 1);
      lever.style.left = "17px";
      switchOn = true;
      start.addEventListener("click", reStartGame);
      strictDot.addEventListener("click", isStrict);
      colors.forEach(color => {
         color.addEventListener("click", checkSeqMatch);
      });
   } else {
      sequence = [];
      sequencePlayer = [];
      switchOn = false;
      strictOn = false;
      level = 1;
      display.textContent = "";
      lever.style.left = "2px";
      removeEventToColorButtons();
      start.removeEventListener("click", reStartGame);
      strictDot.removeEventListener("click", isStrict);
      strictDot.classList.remove("active-dot");
      colors.forEach(color => {
         color.removeEventListener("click", checkSeqMatch);
      });
   }
}

function isStrict() {
   if (!strictOn) {
      strictDot.classList.add("active-dot");
      strictOn = true;
   } else {
      strictDot.classList.remove("active-dot");
      strictOn = false;
   }
}

function reStartGame() {
   level = 1;
   indexClick = 0;
   strictOn = false;
   sequence = Array();
   sequencePlayer = Array();
   displayMessage("--", 2);
   displayMessage(level, 1, 2);
   compTurn(2);
   playerTurn(1);
}

function compTurn(delay = 1) {
   setTimeout(() => {
      removeEventToColorButtons();
      generateSequence();
      blink(sequence);
   }, 500 * delay);
}

function playerTurn(delay) {
   console.log("delay: ", delay);
   setTimeout(addEventToColorButtons, 500 * delay);
}

function generateSequence() {
   let rand = randColor();
   sequence.push([rand[0], rand[1]]);
   return sequence;
}

function checkSeqMatch(event) {
   let color = event.target.classList.value;
   let len = sequence.length;
   sequencePlayer.push(color);
   console.log(
      "bfore if: ",
      sequencePlayer[indexClick],
      sequence[indexClick][1].substring(5),
      indexClick
   );
   if (sequencePlayer[indexClick] === sequence[indexClick][1].substring(5)) {
      flashColor(indexClick);
      playSound(sequence[indexClick][0]);
      indexClick += 1;
      if (indexClick === len) {
         console.log("Last element of sequence", indexClick, len);
         if (level === 20) {
            displayMessage("**", 3);
            return;
         }
         level += 1;
         indexClick = 0;
         sequencePlayer = [];
         displayMessage(level, 1, 1);
         compTurn();
         playerTurn(1);
      }
   } else {
      if (strictOn) {
         console.log("Strict Mode ON: try again!");
         indexClick = 0;
         sequence = [];
         sequencePlayer = [];
         level = 1;
         displayMessage("!!", 1);
         displayMessage(level, 1, 1);
         generateSequence();
         blink(sequence);
         return;
      }
      console.log("Strict Mode OFF: try again");
      displayMessage("!!", 1);
      displayMessage(level, 1, 1);
      sequencePlayer = [];
      indexClick = 0;
      blink(sequence);
   }
}

function addEventToColorButtons() {
   colors.forEach(color => {
      console.log("added click");
      color.style.pointerEvents = "auto";
      color.style.cursor = "pointer";
   });
}

function removeEventToColorButtons() {
   colors.forEach(color => {
      color.style.pointerEvents = "none";
   });
}

function blink(sequence) {
   let len = sequence.length;
   let count = 0;
   let index = 0;
   let toggle = setInterval(() => {
      removeEventToColorButtons();
      colors[sequence[index][0]].classList.toggle(sequence[index][1]);
      count++;
      if (count === len * 2 - 1) {
         playSound(sequence[index][0]);
      }
      if (count % 2 === 0 && index < len - 1) {
         playSound(sequence[index][0]);
         index++; //let timer tick twice and then increment index
      }
   }, 700);
   setTimeout(() => {
      if (usingFirefox) {
         colors[sequence[index][0]].classList.toggle(sequence[index][1]);
      }
      playerTurn(1);
      clearInterval(toggle);
   }, 700 * len * 2);
}

function randColor() {
   let color;
   let randIndex = Math.floor(Math.random() * 4);

   switch (randIndex) {
      case 0:
         color = "dark-green";
         break;
      case 1:
         color = "dark-red";
         break;
      case 2:
         color = "dark-blue";
         break;
      case 3:
         color = "dark-yellow";
         break;
   }
   return [randIndex, color];
}

function playSound(color) {
   switch (color) {
      case 0:
         greenSound.load();
         greenSound.play();
         break;
      case 1:
         redSound.load();
         redSound.play();
         break;
      case 2:
         yellowSound.load();
         yellowSound.play();
         break;
      case 3:
         blueSound.load();
         blueSound.play();
         break;
   }
}

function flashColor(index) {
   let count = 0;
   let flash = setInterval(() => {
      colors[sequence[index][0]].classList.toggle(sequence[index][1]);
      count += 1;
      if (count === 2) clearInterval(flash);
   }, 200);
}

function displayMessage(message, blinks = 0, delay = 0) {
   display.textContent = "";
   let count = 1;
   function flash() {
      let timer = setTimeout(function tick() {
         display.textContent = display.textContent === message ? "" : message;
         timer = setTimeout(tick, 300); // recursive call of tick function
         count += 1;
         if (count === blinks * 2) clearTimeout(timer);
      }, 300);
   }
   if (blinks === 0) {
      display.textContent = message;
   }
   if (delay > 0) {
      setTimeout(flash, delay * 1000);
   } else {
      flash();
   }
}
