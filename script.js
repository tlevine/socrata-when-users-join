(function(){
  d3.csv('series.csv', function(data) {
    window.onload = function() {
      makePlot(data)
    }
  })
  
  function separatePortals(full_table){
    var result = {}
    while (full_table.length > 0) {
      var row = full_table.pop()
      if (!(row.portal in result)) result[row.portal] = []
      result[row.portal].push(row)
    }
    return result
  }

  function makePlot(table) {
    var portals = separatePortals(table)

    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = 840 - m[1] - m[3]; // width
    var h = 480 - m[0] - m[2]; // height

    
  }
})()
