#!/usr/bin/env python
import os
import re
import datetime
from time import sleep
from urllib import urlretrieve

def get(url, cachedir = 'cache'):
    'Download a web file, or load the version from disk.'
    tmp1 = re.sub(r'^https?://', '', url)
    tmp2 = [cachedir] + filter(None, tmp1.split('/'))
    local_file = os.path.join(*tmp2)
    local_dir = os.path.join(*tmp2[:-1])
    del(tmp1)
    del(tmp2)

    # mkdir -p
    if not os.path.exists(local_dir):
        os.makedirs(local_dir)

    # Download
    if not os.path.exists(local_file):
       print 'Downloading and saving %s' % url
       urlretrieve(url, filename = local_file)

    return open(local_file).read()

def series(portal, start, end, slice = 'DAILY'):
    for date in [start, end]:
        if not isinstance(date, datetime.datetime):
            raise TypeError('Start and end dates must be datetimes.')

    slices = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']
    if slice not in slices:
        raise TypeError('slice must be one of ' % ', '.join(slices))

    url = '%(portal)s/api/site_metrics.json?start=%(start)s&end=%(end)s&method=series&slice=%(slice)s'
    params = {
        'portal': portal,
        'start': start.strftime('%s') + '000',
        'end': end.strftime('%s') + '000',
        'slice': slice,
    }
    return get(url % params)

def download():
    start = datetime.datetime(2008,1,1)
    end = datetime.datetime.fromordinal(datetime.date.today().toordinal() - 1)
    portals = [
        'data.austintexas.gov',
        'data.cityofnewyork.us',
        'data.hawaii.gov',
        'explore.data.gov',
        'bronx.lehman.cuny.edu',
        'data.sfgov.org',
        'data.baltimorecity.gov',
        'data.oregon.gov',
        'data.raleighnc.gov',
        'finances.worldbank.org',
        'data.ok.gov',
        'data.seattle.gov',
        'data.montgomerycountymd.gov',
    ]

    # Go through them once to load everything from Socrata's cold storage
    for portal in portals:
        try:
            series(portal, start, end)
        except IOError:
            pass

    # Go through them again now that everything is in Socrata's hot storage
    portals = set(portals)
    while len(portals) > 0:
        portal = list(portals)[0]
        try:
            series(portal, start, end)
        except IOError:
            sleep(10)
        else:
            portals.remove(portal)

if __name__ == '__main__':
    download()
