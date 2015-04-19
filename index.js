var cheerio = require('cheerio');
var request = require('request');
var tabula = require('tabula');

var url = 'http://www.punkybrewster.co.nz/';

var beers = [];

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    beers = parse(body);
    tabula(beers, {columns: ['name', 'price', 'abv'], sort: ['name']});
  }
  else {
    console.log(error);
    echo(url + ' returned ' + response.statusCode);
  }
});

function parse(body) {
  var beers = [];
  var $ = cheerio.load(body);

  $('h2').slice(1).each(function(i, element) { // skip first h2.
      beers[i] = {};
      beers[i].name = $(this).text();
      beers[i].price = $(this).next('.paragraph').text().match(/^\$(\d+\.\d+)\/L$/)[1];
      beers[i].abv = $(this).next('.paragraph').next('.paragraph').text();
  });

  return beers;
}
