
var config = require('./config');
console.log(config);

var request = require('request');

// Documentation for this API:
// https://propublica.github.io/congress-api-docs/#get-votes-by-type

var options = {
  url: 'https://api.propublica.org/congress/v1/senate/votes/2017/01.json',
  headers: {
    'X-API-Key': config.propublica
  }
};

function gotData(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info);
  }
}

request(options, gotData);
