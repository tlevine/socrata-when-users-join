library(sqldf)
library(ggplot2)
library(MASS)
library(reshape2)

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
  series.zero <- subset(series.zero, disk.usage > 0)
}

if (!('bytes' %in% ls())) {
  bytes <- melt(series.zero[c('date', 'portal', 'bytes.in', 'bytes.out')], c('date', 'portal'),
    variable.name = 'direction', value.name = 'bytes')
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





p5 <- ggplot(series.zero) + aes(x = bytes.in, y = bytes.out) + geom_path()


p6 <- ggplot(bytes) + aes(x = date, group = direction, y = bytes) +
  facet_wrap(~ portal) + geom_line()


# sum(series.zero$bytes.out < 0)
# [1] 2051
# sum(series.zero$bytes.in < 0)
# [1] 1

# subset(series.zero, bytes.in < 0)
# subset(series.zero, bytes.out < 0)[1:10,c('date','portal','page.views','bytes.out','bytes.in','disk.usage')]

# Not interesting
# b <- princomp(subset(series.zero,portal=='explore.data.gov')[c('page.views','bytes.out','bytes.in','disk.usage')], cor = TRUE)

plot.bytes <- function() {
  series.bytes <- subset(series.zero, bytes.out > 0 & bytes.in > 0)
  m <- rlm(log(bytes.in) ~ log(bytes.out) + portal, data = series.bytes)
  plot(m$residuals ~ series.bytes$date,
    col = as.numeric(factor(series.bytes$portal)))
}

p7 <- ggplot(series.zero) + aes(x = date, y = page.views) +
  facet_wrap(~ portal) + geom_line() +
  scale_y_log10('Page views')
