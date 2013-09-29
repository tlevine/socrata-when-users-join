library(sqldf)
library(ggplot2)

if (!('series' %in% ls())) {
  series <- sqldf('SELECT * FROM "series" WHERE "date" >= \'2010-06-01\' ;', dbname = 'metrics.db')
  names(series) <- sapply(names(series), function(x) { gsub('-', '.', x)})
  series$date <- as.Date(series$date)
}

if (!('series.zero' %in% ls())) {
  series.zero <- series
  series.zero[is.na(series)] <- 0
  series.zero[1:nrow(series),] <- as.data.frame(series.zero)
  series.zero$day.of.week <- factor(strftime(series.zero$date, '%a'),
    c('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'))
}

p1 <- ggplot(series.zero) +
  aes(x = date, y = users.created, group = portal, color = portal) +
  scale_x_date('Date') + scale_y_log10('Users created today') +
  labs(title = 'Which portals aquired users when?') +
  geom_line()

# Standardize by portal


# Facet
p3 <- p1 + facet_wrap(~ portal)


# Day of week
p4 <- ggplot(series.zero) + aes(x = day.of.week) + geom_histogram() +
  scale_y_continuous('Number of users added on this day of the week') +
  scale_x_discrete('Day of the week') +
  ggtitle('Day of the week doesn\'t tell us much.')

# Notable events, like hackathons, legislation
