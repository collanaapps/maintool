# RSVG – bearbeitbare Startseite

Statische Arbeitskopie der öffentlich zugänglichen Startseite https://www.rsvg.de/, Stand 16. Oktober 2026.

## Bearbeiten

- `dist/index.html`: vollständige Seitenstruktur und Texte.
- `dist/assets/www.rsvg.de/fileadmin/Resources/Public/Css/`: Originalgestaltung.
- `dist/assets/www.rsvg.de/fileadmin/user_upload/Images/`: Bilder und Slider.
- `dist/custom.css`: eigene Anpassungen, die nach den Originalstyles geladen werden.

Für die Vorschau den Ordner `dist` über einen lokalen Webserver bereitstellen, zum Beispiel `python3 -m http.server 8000 --directory dist`.

Die separate Datei `RSVG-Startseite.html` ist eine Einzeldatei mit eingebetteten Ressourcen und kann direkt im Browser geöffnet werden.

Menü, Slider und Tabs verwenden die Originalskripte. Unterseiten führen zur Originalwebsite. Die TYPO3-Datenbank, Live-Fahrplanauskunft, Suche und weitere serverseitige Funktionen sind nicht Teil dieser statischen Arbeitskopie. Tracking wurde aus der Vorlage entfernt.

Die Übernahme ist eine Arbeitsgrundlage für die geplante Kombination mit dem eigenen Factsheet. Logos, Bilder und Texte stammen von der Originalwebsite.
