#!/bin/sh
sqlite3 -csv -header metrics.db "SELECT * FROM series where date >= '2010-06-01' ORDER BY portal,date" | 
  sed 's/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,$/,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,/' > series.csv
