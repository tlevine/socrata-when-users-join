(function(){
  window.onload = function(){
    d3.csv('series.csv', makePlot)
  }
  
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
  }

})()
