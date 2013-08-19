#!/usr/bin/env python
import os
import re
import datetime
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

    url = 'https://%(portal)s/api/site_metrics.json?start=%(start)s&end=%(end)s%method=series&slice=%(slice)s'
    params = {
        'portal': portal,
        'start': start.strftime('%s') + '000',
        'end': end.strftime('%s') + '000',
        'slice': slice,
    }
    return get(url % params)

# https://data.oregon.gov/api/site_metrics.json?start=1375315200000&end=1376438399999&method=series&slice=WEEKLY
series('data.oregon.gov', datetime.datetime(2013,8,1), datetime.datetime(2013,8,10))
