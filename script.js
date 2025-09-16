let deck = {};
let darkMode = false;
let hideInput = false;
let back = false;
let index = 0;
let wrongStreak = 0;
let rightStreak = 0;
let num
const correct  = document.getElementById("correct");

// Download .json of the deck
function download() {
  let str = JSON.stringify(deck, null, 2);
  const blob = new Blob([str], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "deck.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Store deck to local storge
function storeDeck() {
  for (const key in deck) {
    if (key === null || deck[key] === null) {
      delete deck[key];
      localStorage.removeItem(key);
    }
    localStorage.setItem(key, deck[key]);
  }
}

// Load local storage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key)
  deck[key] = value;
}

// Deletes deck from local storage
function deleteDeck() {
  localStorage.clear();
} 

// Adds card to deck
function addCard() {
  let key = prompt("Enter side 1");
  let value = prompt("Enter side 2");
  deck[key] = value;
  storeDeck();
} 

function seeDeck() {
  let string = "";
  for (let i = 0; i < keys.length; i++) {
    string += keys[i] + " : " + deck[keys[i]] + "\n";
  }
  alert(string)
}

// Checks answer input
function checkAnswer() {
  if (document.getElementById("entry").value.trim().toLowerCase() == (deck[keys[index]]).toLowerCase()) { 
    correct.style.color = "green"
    correct.textContent = "Correct";
    //index++;
    index = Math.floor(Math.random() * keys.length);
    wrongStreak = 0;
    rightStreak++;
    back = false;
  } else {
    correct.style.color = "red"
    correct.textContent = "Incorrect"; 
    wrongStreak++;
    rightStreak = 0;
    if (wrongStreak >= 2) {
      document.getElementById("solution").textContent =  deck[keys[index]];
    }
  }
  document.getElementById("entry").value = "";
  setTimeout(function() {
    correct.textContent = "";
    document.getElementById("solution").textContent = "";
    update()
  }, 2000);
}

// Updates text on the card
function update() {
  if (back) { text.textContent = deck[keys[index]]; }
  else { text.textContent = keys[index]; }
  document.getElementById("stats").textContent = "Current streak: " + rightStreak;
  if (hideInput) { document.getElementById("entry").style.visibility = "hidden"; }
  else { document.getElementById("entry").style.visibility = "visible"; }
  
  // Dark mode
  if (darkMode) {
    document.body.classList.add('darkMode');
  } else {
    document.body.classList.remove('darkMode');
  }
}

storeDeck();

// Load first card
let keys = Object.keys(deck);
const text = document.getElementById("cardText");
text.textContent = keys[index];

document.addEventListener("keydown", (e) => {
  keys = Object.keys(deck);
  if (e.code == "ArrowRight") { index++; back = false; document.getElementById("entry").value = "";}
  if (e.code == "ArrowLeft") { index--; back = false; document.getElementById("entry").value = "";}
  if (e.code == "ArrowUp" || e.code == "ArrowDown") { back = !back; }
  if (e.code == "Enter") { checkAnswer(); }
  
  if (index >= Object.keys(deck).length) { index = 0; }
  if (index < 0) { index = Object.keys(deck).length-1; }
  update()
})

// Listen for hide input checkbox changes
document.getElementById('hideInput').addEventListener('change', function() {
  hideInput = this.checked;
  update();
});

document.getElementById('darkMode').addEventListener('change', function() {
  darkMode = this.checked;
  update();
});

// Listen for uploaded file
document.getElementById("upload").addEventListener("change", function() {
  const file = document.getElementById("upload").files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const importedDeck = JSON.parse(e.target.result);
    deck = importedDeck;
    keys = Object.keys(deck);
    index = 0;
    deleteDeck();
    storeDeck();
    update();
  };
  reader.readAsText(file);
});


