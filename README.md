# Excel-Trainer

Interaktive Web-App zum Erlernen von Tabellenkalkulation, entwickelt für Berufsschüler (AVM-Klassen, 16-18 Jahre).

**Live:** https://lernmodule.dirk-schulenburg.net/excel-trainer/

## Features

- 24 Übungen in 6 thematischen Leveln mit steigender Schwierigkeit
- Echte Tabellenkalkulation im Browser (FortuneSheet)
- Gamification: XP, Badges, Sterne, Streaks
- Schritt-für-Schritt-Anleitungen mit Validierung
- Lottie-Animationen und Framer Motion Übergänge
- i18n: Deutsch und Ukrainisch

## Level-Übersicht

| Level | Thema | Schwerpunkt |
|-------|-------|-------------|
| 1 | Einkaufen | Zellen ausfüllen, erste Formeln, SUMME |
| 2 | Mein Alltag | SUMME, MITTELWERT, Preisvergleich |
| 3 | Kochen & Rezepte | Multiplikation, mehrstufige Formeln |
| 4 | WG & Finanzen | Prozentrechnung, Monatsübersicht |
| 5 | Klassenfahrt | Absolute Referenzen, komplexe Berechnungen |
| 6 | Profi-Tabellen | Kettenrechnung, Jahresvergleich, Inventur |

## Tech Stack

- **React 18** + **Vite**
- **FortuneSheet** (Spreadsheet-Komponente)
- **Framer Motion** (Animationen)
- **Lottie React** (Illustrationen)

## Development

```bash
npm install
npm run dev
```

Läuft auf http://localhost:3000/excel-trainer/

## Build & Deploy

```bash
npm run build
```

Das `dist/`-Verzeichnis auf den Server kopieren:

```bash
tar -czf dist.tar.gz -C dist .
scp -i ~/.ssh/hetzner_ssh_key dist.tar.gz dirk@95.217.163.192:~/docker/lernmodule/html/excel-trainer/
ssh -i ~/.ssh/hetzner_ssh_key dirk@95.217.163.192 \
  "cd ~/docker/lernmodule/html/excel-trainer && rm -rf assets index.html && tar -xzf dist.tar.gz && rm dist.tar.gz"
```

## Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── ui/              # Wiederverwendbare UI-Elemente
│   ├── LevelMap.jsx     # Level-Auswahl
│   ├── StoryIntro.jsx   # Story-Einführung pro Level
│   ├── ExerciseView.jsx # Hauptansicht mit Spreadsheet
│   └── LevelComplete.jsx
├── context/             # React Context (Game, I18n)
├── exercises/           # Übungsdefinitionen
│   ├── level1/          # 4 Übungen pro Level
│   ├── level2/
│   ├── ...
│   └── level6/
├── i18n/                # Übersetzungen (de.json, uk.json)
└── utils/               # Validierung, XP, Storage
public/
└── animations/          # Lottie JSON-Animationen
```

## Lizenz

MIT
