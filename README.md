# ics-to-csv-for-ff

Converts a ICS calendar file to a CSV file that is ready to import it in the ff-agent.  

Konvertiert eine ICS-Kalender Datei in eine CSV-Datei die zum import im ff-agent Programm geeigent ist.

## TODOs
* Not tested yet!
* Not linted yet!

## DE

### Beschreibung
Mit diesem Nodejs Script, lässt sich eine ICS-Kalendardatei in eine CSV-Datei umwandeln. 
Gedacht ist das Script um einen exportierten Kalender (z.B. aus MS-Outlook oder Mozilla-Thunderbird) in eine CSV-Datei umzuwandeln, die in der ff-agent Applikation importiert werden kann. Von Vorteil ist in dem Fall zum einen, dass man nicht (wie bei einem manuallen CSV-Export aus einer Mailanwendung) die Felder einzeln auswählen muss (und deren Reihenfolge) und zum anderen, dass auch Felder die sonst nicht erstellt werden könnten (z.B. Event-Titel wird aufgeteilt) aufgeteilt werden. Da die exportierte CSV Datei für den import in der ff-agent Applikation angepasst ist, für andere Programme ggf. dieses Repository forken und anpassen :).

### Verwendung
* nodejs muss zur Verwendung installiert sein (um auf das Dateisystem zugreifen zu können)
* mit `node ICStoCSV.js pfad/zur/Kalenderdatei.ics` wird das Skript aufgerufen
* ohne Argument wandelt das Skript die `input-example.ics` Datei um
* die konvertierte Datei wird in `output.csv` gespeichert

## EN

### Description
This Nodejs script can convert a ICS calendar file into a CSV file.
It is designed to convert an exported calendar (e.g. MS-Outlook or Mozilla-Thunderbird) into a CSV file, that can be importet in the ff-agent application. The advantage here is, that you don't have to select fields and their order manually (as if you would export to CSV in you mail application) and also that fields are created, which you could not create with manual export (e.g. ICS event title is split to two different CSV-values). The CSV file that this script creates is adapted for the use with the ff-agent application, to use it with other applications feel free to fork the repo and adapt it :).

### How to use
* nodejs needs to be installed (for filesystem access)
* call the script with `node ICStoCSV.js path/to/your/calendar.ics`
* the script will convert the `input-example.ics` if you call it without argument
* the output will be written to `output.csv`