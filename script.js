function rollDie(numSides) {
  return Math.floor(Math.random() * numSides) + 1;
}

function roll(numDice, numSides) {
  
  let dice = [];
  for (let i = 0; i < numDice; i++) {
    dice.push(rollDie(numSides));
  }
  return dice;
}
  
function calculateStats(rolls) {
  let sum = rolls.reduce((acc, val) => acc + val, 0);
  let min = Math.min(...rolls);
  let max = Math.max(...rolls);

  rolls.sort((a, b) => a - b);
  let mid = Math.floor(rolls.length / 2);
  let median = rolls.length % 2 !== 0 ? rolls[mid] : (rolls[mid - 1] + rolls[mid]) / 2;

  let counts = {}, mostCommonCount = 0, mostCommonRolls = [];
  for (let val of rolls) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > mostCommonCount) {
      mostCommonCount = counts[val];
      mostCommonRolls = [];
    }
    if (counts[val] == mostCommonCount) {
      mostCommonRolls.push(val);
    }
  }

  return {
    'Min': min, 'Mean': (sum / rolls.length).toFixed(2),
    'Median': median,
    'Mode': {count: mostCommonCount, values: mostCommonRolls},
    'Max': max
  };
}
  
document.forms['diceControlForm'].addEventListener("submit", (event) => {
  event.preventDefault(); 
  
  const form = event.target;
  const statsDiv = document.getElementById("stats");
  const rollList = document.getElementById("rollList");
  
  
  rollList.innerHTML = "";
  statsDiv.innerHTML = "";

  if (!form.checkValidity()) {
    form.reportValidity(); 
    return;
  }
  
  

  const numDice = parseInt(form.elements.numDice.value);
  const numRolls = parseInt(form.elements.numRolls.value);
  const numSides = parseInt(form.elements.numSides.value);
  
  let doubleCount = 0;
  let rolls = [];
  
  for (let i = 0; i < numRolls; i++) {
    const dice = roll(numDice, numSides); 
    
    if ( (new Set(dice)).size == 1) {
      doubleCount++;
    }
  
    const thisRoll = dice.reduce((acc,x) => acc + x, 0);
    const li = document.createElement("li");
    li.textContent = `Roll ${i+1}: ${dice.join(' ')} \t (${thisRoll})`;
    rollList.appendChild(li);
  
    rolls.push(thisRoll);
  };
  
  
  const stats = calculateStats(rolls);
  if (numDice > 1) {
    stats['Number of "doubles"'] = doubleCount;
  }

  for (let [label, value] of Object.entries(stats)) {
    p = document.createElement("p");
    
    if (label === 'Mode') {
      p.textContent += `${label}: ${value.values.join(', ')} (each appeared ${value.count} times)`;
    } else {
      p.textContent = `${label}: ${value}`;
    }
    statsDiv.appendChild(p);
  }
});