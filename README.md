# Kreuzworträtsel

Eine einfache webbasierte Anwendung zum Erstellen und Lösen von Kreuzworträtseln.

Das Projekt ist unabhängig von einem bestimmten Event, Unternehmen oder Anwendungsfall und kann mit einem eigenen Fragenkatalog verwendet werden.

## Funktionen

* Automatische Erstellung eines Kreuzworträtsels
* Zufällige Auswahl von Fragen
* Dynamische Platzierung der Wörter
* Kreuzungen zwischen den Wörtern
* Automatische Prüfung des Layouts
* Hinweise für waagerechte und senkrechte Wörter
* Nummerierung der Wörter
* Pfeiltasten zur Navigation
* Automatischer Wechsel zum nächsten Eingabefeld
* Prüfung der eingegebenen Lösung
* Anzeige falsch gelöster Wörter
* Responsive Darstellung für unterschiedliche Bildschirmgrößen

## Aufbau

```text
/
├── index.html
├── app.js
├── crossword.js
├── style.css
├── fragen.json
├── .gitignore
└── LICENSE
```

### `index.html`

Enthält die HTML-Struktur der Anwendung und die Bereiche für:

* Kreuzworträtsel
* Hinweise
* Buttons
* Informationen und Rückmeldungen

### `app.js`

Steuert den Ablauf der Anwendung. Dazu gehören unter anderem:

* Laden der Fragen
* Auswahl der Fragen
* Start der Kreuzworträtsel-Generierung
* Lösungsprüfung
* Anzeige von Rückmeldungen

### `crossword.js`

Enthält die eigentliche Kreuzworträtsel-Logik:

* Erstellung des Gitters
* Platzierung der Wörter
* Kreuzung der Wörter
* Backtracking zur Suche nach einem passenden Layout
* Darstellung des Gitters
* Eingabesteuerung
* Lösungsprüfung

### `style.css`

Enthält das komplette Design und die responsive Darstellung der Anwendung.

## Fragenkatalog

Die Datei `fragen.json` ist **nicht Bestandteil des GitHub-Repositories** und wird über die `.gitignore` ausgeschlossen.

Um das Projekt lokal verwenden zu können, muss daher selbst eine `fragen.json` im Projektverzeichnis erstellt bzw. bereitgestellt werden.

Die Datei muss folgendes Format besitzen:

```json
[
  {
    "clue": "Beispiel für eine Frage",
    "solution": "BEISPIEL"
  },
  {
    "clue": "Eine weitere Frage",
    "solution": "ANTWORT"
  }
]
```

Dabei gilt:

* `clue` enthält den Hinweis bzw. die Frage.
* `solution` enthält die zugehörige Lösung.
* Die Lösungen sollten für die Verwendung in einem Kreuzworträtsel geeignet sein.
* Es sollten ausreichend Fragen vorhanden sein, damit die Anwendung die benötigte Anzahl auswählen kann.

**Ohne eine passende `fragen.json` kann das Kreuzworträtsel nicht generiert werden.**

## Verwendung

Das Projekt benötigt keinen Server und keine externe Datenbank.

Nach dem Bereitstellen einer eigenen `fragen.json` kann die Anwendung lokal über einen geeigneten Webserver oder über GitHub Pages ausgeführt werden.

## Lizenz

Dieses Projekt steht unter der **PolyForm Noncommercial License 1.0.0**.

Die Lizenz erlaubt die Nutzung unter den Bedingungen der PolyForm Noncommercial License. Eine kommerzielle Nutzung ist nicht gestattet.

Der vollständige Lizenztext befindet sich in der Datei `LICENSE`.

Weitere Informationen zur Lizenz:

https://polyformproject.org/licenses/noncommercial/1.0.0/
