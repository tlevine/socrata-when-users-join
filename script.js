(function(){
  d3.csv('series.csv', makePlot)
  function makePlot(table) {
    tables = separatePortals(table.map(convertTypes))

    var m = [80, 80, 80, 80]; // margins
    var w = 1600 - m[1] - m[3]; // width
    var h = 800 - m[0] - m[2]; // height
    var minDate = table[0].date
    var maxDate = table[table.length - 1].date
    var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]).nice(d3.time.day)
    var y = d3.scale.linear().domain([0, 1000]).range([h, 0]);

    var line = d3.svg.line()
      .x(function(d) { 
        return x(d.date); 
      })
      .y(function(d) { 
        return y(d['users-created']); 
      })

    // Based on http://bl.ocks.org/benjchristensen/2579599
    var graph = d3.select("#graph").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    graph.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(-25,0)")
      .call(yAxisLeft);

    var figure = graph.append("svg:text")
      .classed("figure", true)
      .classed("hide", true)
      .text('abc')

    var table_zip = []
    for (portal in tables) {
      table_zip.push([portal, tables[portal]])
    }
    graph.selectAll('path')
      .data(table_zip)
      .enter()
      .append("path")
      .attr("d", function(d, i) { return line(d[1]) })
      .classed("line", true)

    graph.selectAll('path.line').on('mouseover', function(d, i) {
      var xy = d3.mouse(this)
      graph.select('.figure').attr('dx', xy[0]).attr('dy', xy[1]).classed('hide', false)
      d3.select(this).classed('hover', true)
    })
    graph.selectAll('path.line').on('mouseout', function(d, i) {
      graph.select('.figure').classed('hide', true)
      d3.select(this).classed('hover', false)
    })


    function convertTypes(row){
      var date = new Date()
      var date_components = row.date.split('-')
      date.setYear(date_components[0])
      date.setMonth(date_components[1])
      date.setDate(date_components[2])
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      row.date = date
      return row
    }

    function separatePortals(table){
      var result = {}
      while (table.length > 0) {
        var row = table.pop()
        if (!(row.portal in result)) result[row.portal] = []
        result[row.portal].push(row)
      }
      return result
    }
  }
})()
