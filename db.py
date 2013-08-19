#!/usr/bin/env python2
import os, datetime, json
from download import series
from dumptruck import DumpTruck

def table():
    start = datetime.datetime(2008, 1, 1)
    end   = datetime.datetime(2013, 8, 18)
    portals = os.listdir('cache')
    for portal in portals:
        days = json.load(series(portal, start, end))
        for day in days:
            if 'metrics' not in day:
                day['metrics'] = {}

            day['metrics']['portal'] = portal
            day['metrics']['date'] = datetime.datetime.fromtimestamp(
                day['__start__'] / 1000).date()

            yield day['metrics']

def main():
    dt = DumpTruck(dbname = 'metrics.db')
    dt.create_table({'portal': 'abc', 'date': datetime.date.today()}, 'series')
    dt.create_index(['portal', 'date'], 'series')
    dt.upsert(list(table()), 'series')

if __name__ == '__main__':
    main()
