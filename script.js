(function(){
  d3.csv('series.csv', makePlot)
  function makePlot(table) {
    table = table.map(convertTypes)
    
    // http://bl.ocks.org/benjchristensen/2579599

    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = 840 - m[1] - m[3]; // width
    var h = 480 - m[0] - m[2]; // height

    var minDate = table[0].date
    var maxDate = table[table.length - 1].date

    var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]).nice(d3.time.day)
    var y = d3.scale.linear().domain([0, 1000]).range([h, 0]);

    // create a line function that can convert data[] into x and y points
    var line = d3.svg.line()
      .x(function(d,i) { 
        console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        return x(i); 
      })
      .y(function(d) { 
        console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
        return y(d); 
      })

    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#graph").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);
    
    // Add the line by appending an svg:path element with the data line we created above
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line(table));

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
  }
})()
