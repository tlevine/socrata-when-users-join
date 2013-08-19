from download import series

start = datetime.datetime(2008, 1, 1)
end   = datetime.datetime(2008, 8, 19)
portals = os.listdir('cache')

series(portal, start, end)
