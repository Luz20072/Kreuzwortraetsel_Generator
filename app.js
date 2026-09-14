// Fragen und Hinweise aus fragen.json laden
async function loadQuestions() {
  const response = await fetch('fragen.json');

  if (!response.ok) {
    throw new Error(
      'Konnte fragen.json nicht laden: ' + response.status
    );
  }

  return await response.json();
}


// Zufällige Auswahl aus dem Fragenpool
function getRandomSubset(array, count) {
  const shuffled = array
    .slice()
    .sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
}


// Erfolgs-Popup anzeigen
function showSecretPopup() {
  const popup = document.getElementById('secret-popup');
  const secretCodeElem = document.getElementById('secret-code');

  const codewort = 'Tastatur statt Papier';

  secretCodeElem.textContent = codewort;
  popup.style.display = 'flex';
}


// Hinweis-Popup anzeigen
function showInfoPopup(message) {
  const popup = document.getElementById('info-popup');
  const msgElem = document.getElementById('info-message');

  msgElem.textContent = message;
  popup.style.display = 'flex';
}


// Neues Kreuzworträtsel erzeugen
async function generateNewCrossword() {
  const allQuestions = await loadQuestions();

  // Anzahl der Fragen, die pro Rätsel ausgewählt werden
  const selectionCount = 10;

  if (allQuestions.length < selectionCount) {
    showInfoPopup(
      'Es werden mindestens 10 Fragen im Fragenpool benötigt, um ein Rätsel zu erzeugen.'
    );
    return;
  }

  const randomQuestions = getRandomSubset(
    allQuestions,
    selectionCount
  );

  const words = randomQuestions.map(question => ({
    solution: question.solution.toUpperCase(),
    clue: question.clue
  }));


  // Rätselstruktur erzeugen
  const { grid, placedWords } = generateLayout(words);

  if (!placedWords || placedWords.length === 0) {
    showInfoPopup(
      'Es konnte kein gültiges Kreuzworträtsel erzeugt werden. Bitte lade die Seite neu.'
    );
    return;
  }


  // Rätsel anzeigen
  renderGrid(grid, placedWords);


  // Prüfen-Button einrichten
  const checkBtn = document.getElementById('check-btn');

  checkBtn.onclick = () => {

    // Nach Fehlern suchen
    const wrongWords = getIncorrectWords(
      grid,
      placedWords
    );

    if (wrongWords.length > 0) {
      const numbers = wrongWords
        .map(word => word.number)
        .sort((a, b) => a - b);

      const infoText =
        'Es sind noch Fehler im Rätsel.\n' +
        'Betroffen sind die Begriffe mit den Nummern: ' +
        numbers.join(', ') +
        '.';

      showInfoPopup(infoText);
      return;
    }


    // Rätsel mit fünf oder weniger Begriffen gelten als zu klein
    if (placedWords.length <= 5) {
      showInfoPopup(
        'Dieses Rätsel enthält zu wenige Begriffe. ' +
        'Bitte lade die Seite mit F5 neu, um ein neues Rätsel zu erzeugen.'
      );
      return;
    }


    // Rätsel erfolgreich gelöst
    showSecretPopup();
  };
}


// Initialisierung nach dem Laden der Seite
document.addEventListener('DOMContentLoaded', () => {

  generateNewCrossword().catch(error => {
    console.error(error);

    showInfoPopup(
      'Beim Erzeugen des Kreuzworträtsels ist ein Fehler aufgetreten.'
    );
  });


  // Erfolgs-Popup schließen
  const closePopup = document.getElementById('close-popup');

  closePopup.addEventListener('click', () => {
    document.getElementById('secret-popup').style.display = 'none';
  });


  // Hinweis-Popup schließen
  const closeInfoPopup =
    document.getElementById('close-info-popup');

  closeInfoPopup.addEventListener('click', () => {
    document.getElementById('info-popup').style.display = 'none';
  });
});