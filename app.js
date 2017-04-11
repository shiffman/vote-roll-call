var config = require('./config');
//console.log(config);

// Currently not working
// var sheetsu = require('sheetsu-node');
// var config = {
//   address: 'ADDRESS',
//   api_key: 'keys',
//   api_secret: 'SECRET',
// };

var GoogleSpreadsheet = require('google-spreadsheet');

// For now public spreadsheet at:
// https://docs.google.com/spreadsheets/d/1oWAFQIIRZneiAQAXRvJ1S4K_Lall0DY_A8WGIVawXpc/edit#gid=0
var doc = new GoogleSpreadsheet('1oWAFQIIRZneiAQAXRvJ1S4K_Lall0DY_A8WGIVawXpc');

// Lookup table for spreadsheet columns
// hardcoding for now
var columns = {
  'date': 0,
  'roll_call_number': 1,
  'bill_number': 2,
  'summary': 3
}

doc.getInfo(function(err, info) {
  var sheet = info.worksheets[0];

  // This is an annoying way to do this, parsing all the cells
  // Should probably use getRows(), have to investigate this more
  sheet.getCells({
    // Start one below the header
    'min-row': 2,
    // Look at 1000 for no good reason
    'max-row': 10,
    'min-col': 1,
    'max-col': 1,
    'return-empty': true
  }, function(err, cells) {
    var row = -1;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cells.row != row) {
        row = cell.row;
        var content = cell.value;
        // New empty row!
        if (content.length == 0) {
          cell.value = 'test';
        }
        console.log('new row! ' +  row);
      }
    }
    // Ooops, have to authenticate to add content
    // sheet.bulkUpdateCells(cells, err); //async
    // function err(oops) {
    //   console.log(oops);
    // }
  });
});


// ProPublica API
// Documentation for this API:
// https://propublica.github.io/congress-api-docs/#get-votes-by-type

// var options = {
//   url: 'https://api.propublica.org/congress/v1/senate/votes/2017/01.json',
//   headers: {
//     'X-API-Key': config.propublica
//   }
// };
//
// function gotData(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//     console.log(info);
//   }
// }
//
// request(options, gotData);
