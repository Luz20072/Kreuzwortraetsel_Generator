const GRID_SIZE = 15;


// ==========================================
// GITTER
// ==========================================

// Leeres GRID_SIZE × GRID_SIZE-Gitter erzeugen.
// null steht für ein Blockfeld.
function createEmptyGrid() {
  const grid = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    const currentRow = [];

    for (let col = 0; col < GRID_SIZE; col++) {
      currentRow.push(null);
    }

    grid.push(currentRow);
  }

  return grid;
}


// ==========================================
// WÖRTER PLATZIEREN
// ==========================================

// Prüfen, ob ein Wort an einer bestimmten Position
// innerhalb des Gitters platziert werden kann.
function canPlaceWordBasic(grid, word, row, col, direction) {

  if (direction === 'across') {
    if (col < 0 || col + word.length > GRID_SIZE) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const currentRow = row;
      const currentCol = col + i;

      if (
        currentRow < 0 ||
        currentRow >= GRID_SIZE
      ) {
        return false;
      }

      const cell = grid[currentRow][currentCol];

      if (cell !== null && cell !== word[i]) {
        return false;
      }
    }

  } else {
    if (row < 0 || row + word.length > GRID_SIZE) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const currentRow = row + i;
      const currentCol = col;

      if (
        currentCol < 0 ||
        currentCol >= GRID_SIZE
      ) {
        return false;
      }

      const cell = grid[currentRow][currentCol];

      if (cell !== null && cell !== word[i]) {
        return false;
      }
    }
  }

  return true;
}


// Wort in das Gitter eintragen.
function placeWordOnGrid(grid, word, row, col, direction) {

  for (let i = 0; i < word.length; i++) {
    if (direction === 'across') {
      grid[row][col + i] = word[i];
    } else {
      grid[row + i][col] = word[i];
    }
  }
}


// ==========================================
// LAYOUT-PRÜFUNG
// ==========================================

// Alle zusammenhängenden Buchstabenfolgen
// horizontal und vertikal im Gitter finden.
function findWordRuns(grid) {

  const runsAcross = [];
  const runsDown = [];


  // Waagerechte Wörter suchen.
  for (let row = 0; row < GRID_SIZE; row++) {

    let col = 0;

    while (col < GRID_SIZE) {

      if (
        grid[row][col] !== null &&
        (col === 0 || grid[row][col - 1] === null)
      ) {

        const startCol = col;
        let word = '';

        while (
          col < GRID_SIZE &&
          grid[row][col] !== null
        ) {
          word += grid[row][col];
          col++;
        }

        if (word.length >= 2) {
          runsAcross.push({
            row,
            col: startCol,
            word
          });
        }

      } else {
        col++;
      }
    }
  }


  // Senkrechte Wörter suchen.
  for (let col = 0; col < GRID_SIZE; col++) {

    let row = 0;

    while (row < GRID_SIZE) {

      if (
        grid[row][col] !== null &&
        (row === 0 || grid[row - 1][col] === null)
      ) {

        const startRow = row;
        let word = '';

        while (
          row < GRID_SIZE &&
          grid[row][col] !== null
        ) {
          word += grid[row][col];
          row++;
        }

        if (word.length >= 2) {
          runsDown.push({
            row: startRow,
            col,
            word
          });
        }

      } else {
        row++;
      }
    }
  }

  return {
    runsAcross,
    runsDown
  };
}


// Prüfen, ob alle im Gitter entstandenen
// Wörter im Fragenpool vorhanden sind.
function isLayoutValid(grid, words) {

  const wordSet = new Set(
    words.map(word => word.solution)
  );

  const {
    runsAcross,
    runsDown
  } = findWordRuns(grid);

  const allRuns = [
    ...runsAcross,
    ...runsDown
  ];

  return allRuns.every(run =>
    wordSet.has(run.word)
  );
}


// ==========================================
// KREUZWORTRÄTSEL GENERIEREN
// ==========================================

// Kreuzworträtsel mithilfe von Backtracking erzeugen.
function generateLayout(words) {

  const grid = createEmptyGrid();

  // Erstes Wort mittig waagerecht platzieren.
  const firstWord = words[0];

  const middleRow =
    Math.floor(GRID_SIZE / 2);

  const startCol =
    Math.floor(
      (GRID_SIZE - firstWord.solution.length) / 2
    );

  placeWordOnGrid(
    grid,
    firstWord.solution,
    middleRow,
    startCol,
    'across'
  );


  const placedWords = [
    {
      ...firstWord,
      row: middleRow,
      col: startCol,
      direction: 'across',
      number: 1
    }
  ];


  // Bestes bisher gefundenes Layout speichern.
  let bestPlaced = placedWords.map(word => ({
    ...word
  }));

  let bestGrid = grid.map(row => row.slice());


  function backtrack(index, nextNumber) {

    // Alle Wörter wurden verarbeitet.
    if (index >= words.length) {

      if (
        placedWords.length > bestPlaced.length &&
        isLayoutValid(grid, placedWords)
      ) {
        bestPlaced = placedWords.map(word => ({
          ...word
        }));

        bestGrid = grid.map(row => row.slice());
      }

      return;
    }


    const wordObj = words[index];
    const word = wordObj.solution;

    const positions = [];


    // Mögliche Kreuzungspunkte mit bereits
    // platzierten Wörtern suchen.
    for (const existingWord of placedWords) {

      const existingSolution =
        existingWord.solution;

      for (let i = 0; i < word.length; i++) {

        const character = word[i];

        for (
          let j = 0;
          j < existingSolution.length;
          j++
        ) {

          if (existingSolution[j] !== character) {
            continue;
          }


          const baseRow =
            existingWord.row +
            (
              existingWord.direction === 'down'
                ? j
                : 0
            );

          const baseCol =
            existingWord.col +
            (
              existingWord.direction === 'across'
                ? j
                : 0
            );


          // Kreuzungsrichtung bestimmen.
          const direction =
            existingWord.direction === 'across'
              ? 'down'
              : 'across';


          const startRow =
            direction === 'down'
              ? baseRow - i
              : baseRow;

          const startCol =
            direction === 'across'
              ? baseCol - i
              : baseCol;


          positions.push({
            row: startRow,
            col: startCol,
            direction
          });
        }
      }
    }


    // Zufällige Reihenfolge für abwechslungsreiche Layouts.
    positions.sort(
      () => Math.random() - 0.5
    );


    for (const position of positions) {

      const {
        row,
        col,
        direction
      } = position;


      // Keine zwei Wörter am gleichen Startpunkt.
      const startUsed = placedWords.some(
        existingWord =>
          existingWord.row === row &&
          existingWord.col === col
      );

      if (startUsed) {
        continue;
      }


      if (
        !canPlaceWordBasic(
          grid,
          word,
          row,
          col,
          direction
        )
      ) {
        continue;
      }


      // ==========================================
      // BACKTRACKING-ZUSTAND SICHERN
      // ==========================================

      // Vor der Testplatzierung wird das komplette
      // Gitter kopiert. Dadurch kann nach dem Versuch
      // exakt der vorherige Zustand wiederhergestellt
      // werden, einschließlich aller Kreuzungen.
      const previousGrid = grid.map(currentRow =>
        currentRow.slice()
      );


      // Wort testweise platzieren.
      placeWordOnGrid(
        grid,
        word,
        row,
        col,
        direction
      );

      placedWords.push({
        ...wordObj,
        row,
        col,
        direction,
        number: nextNumber
      });


      // Nur mit gültigem Layout weitersuchen.
      if (
        isLayoutValid(
          grid,
          placedWords
        )
      ) {
        backtrack(
          index + 1,
          nextNumber + 1
        );
      }


      // Wort aus der Liste entfernen.
      placedWords.pop();


      // ==========================================
      // BACKTRACKING-ZUSTAND WIEDERHERSTELLEN
      // ==========================================

      // Das komplette Gitter auf den Zustand vor
      // der Testplatzierung zurücksetzen.
      for (let r = 0; r < GRID_SIZE; r++) {
        grid[r] = previousGrid[r].slice();
      }
    }


    // Aktuelles Layout als bestes Ergebnis speichern,
    // falls es mehr Wörter enthält.
    if (
      placedWords.length > bestPlaced.length &&
      isLayoutValid(grid, placedWords)
    ) {
      bestPlaced = placedWords.map(word => ({
        ...word
      }));

      bestGrid = grid.map(row => row.slice());
    }


    // Aktuelles Wort überspringen.
    backtrack(
      index + 1,
      nextNumber
    );
  }


  // Erstes Wort wurde bereits platziert.
  backtrack(1, 2);

  return {
    grid: bestGrid,
    placedWords: bestPlaced
  };
}


// ==========================================
// RÄTSEL DARSTELLEN
// ==========================================

function renderGrid(grid, placedWords) {

  const table =
    document.getElementById('crossword');

  table.innerHTML = '';


  // Startzellen der Wörter speichern.
  const startCells = new Map();

  placedWords.forEach(word => {

    const key =
      word.row + '-' + word.col;

    if (!startCells.has(key)) {
      startCells.set(key, {
        number: word.number,
        hasAcross: false,
        hasDown: false
      });
    }

    const cell =
      startCells.get(key);

    if (word.direction === 'across') {
      cell.hasAcross = true;
    }

    if (word.direction === 'down') {
      cell.hasDown = true;
    }
  });


  // Zu jeder Zelle die zugehörigen
  // Wortnummern speichern.
  const cellWords = {};

  placedWords.forEach(word => {

    for (
      let i = 0;
      i < word.solution.length;
      i++
    ) {

      const row =
        word.direction === 'across'
          ? word.row
          : word.row + i;

      const col =
        word.direction === 'down'
          ? word.col
          : word.col + i;

      const key =
        row + '-' + col;


      if (!cellWords[key]) {
        cellWords[key] = {};
      }

      cellWords[key][word.direction] =
        word.number;
    }
  });


  // Gitter erzeugen.
  for (let row = 0; row < GRID_SIZE; row++) {

    const tableRow =
      document.createElement('tr');

    for (let col = 0; col < GRID_SIZE; col++) {

      const cell =
        document.createElement('td');


      // Blockfeld.
      if (grid[row][col] === null) {

        cell.classList.add('block');

      } else {

        cell.style.position = 'relative';


        const input =
          document.createElement('input');

        input.maxLength = 1;

        input.dataset.row = row;
        input.dataset.col = col;


        const key =
          row + '-' + col;

        if (cellWords[key]) {

          if (cellWords[key].across) {
            input.dataset.across =
              cellWords[key].across;
          }

          if (cellWords[key].down) {
            input.dataset.down =
              cellWords[key].down;
          }
        }


        cell.appendChild(input);


        // Nummer und Richtung des Wortstarts anzeigen.
        if (startCells.has(key)) {

          const entry =
            startCells.get(key);

          const container =
            document.createElement('span');

          container.style.position = 'absolute';
          container.style.top = '2px';
          container.style.left = '3px';
          container.style.fontSize = '10px';
          container.style.color = '#555';
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.lineHeight = '1';


          const number =
            document.createElement('span');

          number.textContent =
            entry.number;

          container.appendChild(number);


          if (
            entry.hasAcross &&
            !entry.hasDown
          ) {

            const arrow =
              document.createElement('span');

            arrow.textContent = '→';
            arrow.style.fontSize = '8px';

            container.appendChild(arrow);

          } else if (
            entry.hasDown &&
            !entry.hasAcross
          ) {

            const arrow =
              document.createElement('span');

            arrow.textContent = '↓';
            arrow.style.fontSize = '8px';

            container.appendChild(arrow);

          } else if (
            entry.hasAcross &&
            entry.hasDown
          ) {

            const arrow =
              document.createElement('span');

            arrow.textContent = '↘';
            arrow.style.fontSize = '8px';

            container.appendChild(arrow);
          }


          cell.appendChild(container);
        }
      }


      tableRow.appendChild(cell);
    }

    table.appendChild(tableRow);
  }


  // ==========================================
  // HINWEISE
  // ==========================================

  const acrossList =
    document.getElementById('hints-across');

  const downList =
    document.getElementById('hints-down');

  acrossList.innerHTML = '';
  downList.innerHTML = '';


  placedWords.forEach(word => {

    const listItem =
      document.createElement('li');

    listItem.textContent =
      word.number + '. ' + word.clue;


    if (word.direction === 'across') {
      acrossList.appendChild(listItem);
    } else {
      downList.appendChild(listItem);
    }
  });


  // ==========================================
  // EINGABESTEUERUNG
  // ==========================================

  const inputs = Array.from(
    document.querySelectorAll(
      '#crossword input'
    )
  );

  let currentDirection = 'across';


  // Alle Felder eines bestimmten Wortes ermitteln.
  function getInputsForWord(
    wordNumber,
    direction
  ) {

    return inputs
      .filter(
        input =>
          input.dataset[direction] == wordNumber
      )
      .sort((a, b) => {

        const rowA =
          parseInt(a.dataset.row, 10);

        const colA =
          parseInt(a.dataset.col, 10);

        const rowB =
          parseInt(b.dataset.row, 10);

        const colB =
          parseInt(b.dataset.col, 10);


        if (direction === 'across') {
          return (
            colA - colB ||
            rowA - rowB
          );
        }

        return (
          rowA - rowB ||
          colA - colB
        );
      });
  }


  inputs.forEach(input => {

    // Richtung beim Fokussieren bestimmen.
    input.addEventListener(
      'focus',
      () => {

        const hasAcross =
          !!input.dataset.across;

        const hasDown =
          !!input.dataset.down;


        if (
          hasAcross &&
          !hasDown
        ) {
          currentDirection = 'across';

        } else if (
          !hasAcross &&
          hasDown
        ) {
          currentDirection = 'down';
        }
      }
    );


    // Eingabe automatisch zum nächsten Feld führen.
    input.addEventListener(
      'input',
      event => {

        const value =
          event.target.value.toUpperCase();

        event.target.value = value;


        if (!value) {
          return;
        }


        const direction =
          currentDirection;

        const wordNumber =
          input.dataset[direction];


        if (!wordNumber) {
          return;
        }


        const wordInputs =
          getInputsForWord(
            wordNumber,
            direction
          );

        const index =
          wordInputs.indexOf(input);


        if (
          index > -1 &&
          index < wordInputs.length - 1
        ) {

          const nextInput =
            wordInputs[index + 1];

          nextInput.focus();
          nextInput.select();
        }
      }
    );


    // Tastatursteuerung.
    input.addEventListener(
      'keydown',
      event => {

        const direction =
          currentDirection;

        const wordNumber =
          input.dataset[direction];


        // Backspace / Delete.
        if (
          (
            event.key === 'Backspace' ||
            event.key === 'Delete'
          ) &&
          wordNumber
        ) {

          const wordInputs =
            getInputsForWord(
              wordNumber,
              direction
            );

          const index =
            wordInputs.indexOf(input);


          if (event.key === 'Backspace') {

            if (input.value) {
              return;
            }

            if (index > 0) {

              event.preventDefault();

              const previousInput =
                wordInputs[index - 1];

              previousInput.focus();
              previousInput.value = '';
            }
          }

          return;
        }


        const row =
          parseInt(input.dataset.row, 10);

        const col =
          parseInt(input.dataset.col, 10);

        let target = null;


        // Pfeiltasten.
        if (event.key === 'ArrowRight') {

          currentDirection = 'across';

          target = inputs.find(
            other =>
              other.dataset.row == row &&
              other.dataset.col == col + 1
          );

        } else if (event.key === 'ArrowLeft') {

          currentDirection = 'across';

          target = inputs.find(
            other =>
              other.dataset.row == row &&
              other.dataset.col == col - 1
          );

        } else if (event.key === 'ArrowDown') {

          currentDirection = 'down';

          target = inputs.find(
            other =>
              other.dataset.row == row + 1 &&
              other.dataset.col == col
          );

        } else if (event.key === 'ArrowUp') {

          currentDirection = 'down';

          target = inputs.find(
            other =>
              other.dataset.row == row - 1 &&
              other.dataset.col == col
          );
        }


        if (target) {

          event.preventDefault();

          target.focus();
          target.select();
        }
      }
    );
  });
}


// ==========================================
// LÖSUNGSPRÜFUNG
// ==========================================

// Prüfen, ob alle Felder korrekt ausgefüllt sind.
function checkSolution(grid, placedWords) {

  const inputs =
    document.querySelectorAll(
      '#crossword input'
    );


  for (const input of inputs) {

    const row =
      parseInt(input.dataset.row, 10);

    const col =
      parseInt(input.dataset.col, 10);

    const expected =
      grid[row][col];

    const value =
      (input.value || '').toUpperCase();


    if (value !== expected) {
      return false;
    }
  }

  return true;
}


// Alle Wörter ermitteln, die mindestens
// einen falschen Buchstaben enthalten.
function getIncorrectWords(
  grid,
  placedWords
) {

  const inputs =
    document.querySelectorAll(
      '#crossword input'
    );

  const wrongWordNumbers =
    new Set();


  for (const input of inputs) {

    const row =
      parseInt(input.dataset.row, 10);

    const col =
      parseInt(input.dataset.col, 10);

    const expected =
      grid[row][col];

    const value =
      (input.value || '').toUpperCase();


    if (value === expected) {
      continue;
    }


    const acrossNumber =
      input.dataset.across;

    const downNumber =
      input.dataset.down;


    if (acrossNumber) {
      wrongWordNumbers.add(
        parseInt(acrossNumber, 10)
      );
    }

    if (downNumber) {
      wrongWordNumbers.add(
        parseInt(downNumber, 10)
      );
    }
  }


  return placedWords.filter(
    word =>
      wrongWordNumbers.has(word.number)
  );
}