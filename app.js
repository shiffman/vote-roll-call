var sheetsu = require('sheetsu-node');
var request = require('request');

var config = require('./config');

// Create new client
var sheetsu_client = sheetsu(config.sheetsu);

var params = {
  limit: 100,
  offset: 1,
  sheet: 'votes'
  // search
}
sheetsu_client.read(params).then(gotSheet, error);

var votesArray = [];


function gotSheet(data) {
  var votesArray = JSON.parse(data);

  // For debugging
  // var fs = require('fs');
  // var json = JSON.stringify(votesArray, null, 2);
  // fs.writeFileSync("sheet.json", json);


  // Got everything in the spreadsheet
  var votesTable = {};
  console.log('Got ' + votesArray.length + ' rows from sheet.');
  for (var i = 0; i < votesArray.length; i++) {
    var vote = votesArray[i];
    votesTable[vote.roll_call_number] = true;
  }

  // Now go to Propublica
  // ProPublica API
  // Documentation for this API:
  // https://propublica.github.io/congress-api-docs/#get-votes-by-type

  // "https://api.propublica.org/congress/v1/"+chamber+"/votes/"+startDate+"/"+endDate+".json",
  var startDate = getToday(10);
  var endDate = getToday(0);
  var options = {
    url: 'https://api.propublica.org/congress/v1/senate/votes/' + startDate + '/' + endDate + '.json',
    headers: {
      'X-API-Key': config.propublica
    }
  };

  function gotVotes(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);

      // for debugging
      // var fs = require('fs');
      // var json = JSON.stringify(info, null, 2);
      // fs.writeFileSync("votes.json", json);


      var votes = info.results.votes;
      var rows = [];
      console.log('Got ' + votes.length + ' votes from ProPublica.');
      for (var i = 0; i < votes.length; i++) {
        var vote = votes[i];
        var roll_call = vote.roll_call;

        // New vote!
        if (votesTable[roll_call]) {
          console.log('Already know about roll call: ' + roll_call);
        } else {
          console.log('Adding new roll call: ' + roll_call);
          // Add a new row
          var row = {
            date: vote.date,
            roll_call_number: vote.roll_call,
            bill_number: '????',
            summary: vote.description
          }
          rows.push(row);
        }
      }

      // Add all the rows at once:
      if (rows.length > 0) {
        sheetsu_client.create(rows, "votes").then(finishedAdding, error)

        function finishedAdding(data) {
          console.log("Success adding: ");
          console.log(data);
        }
      } else {
        console.log('no new votes to add');
      }
    }
  }

  request(options, gotVotes);

}

function error(err) {
  console.log(err);
}

// Get Today
function getToday(offset) {
  var today = new Date();
  today.setDate(today.getDate() - offset);
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return today = yyyy + '-' + mm + '-' + dd;
}
