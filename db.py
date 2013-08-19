#!/usr/bin/env python2
import os, datetime, json
from download import series
from dumptruck import DumpTruck

dt = DumpTruck(dbname = 'metrics.db')
dt.create_table({'portal': 'abc', 'date': datetime.date.today()}, 'series')
dt.create_index(['portal', 'date'], 'series')

def main():
    start = datetime.datetime(2008, 1, 1)
    end   = datetime.datetime(2013, 8, 18)
    portals = os.listdir('cache')
    for portal in portals:
        dt.upsert(mapper(portal))

def mapper(portal):
    data = json.load(series(portal, start, end))
    data['portal'] = portal
    data['metrics']['date'] = datetime.datetime.fromtimestamp(data[-1]['__start__'] / 1000).date()
    return data['metrics']
