(function(){
  d3.csv('series.csv', function(data) {
    window.onload = function() {
      makePlot(data)
    }
  })
  
  function makePlot(table) {
    table = table.map(convertTypes)
    
    // http://bl.ocks.org/benjchristensen/2579599

    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = 840 - m[1] - m[3]; // width
    var h = 480 - m[0] - m[2]; // height

    var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]).nice(d3.time.day)
    // var y = d3.scale.linear().domain([0, 1000]).range([h, 0]);

    function convertTypes(row){
      var date = new Date()
      var date_components = date.split('-')
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
