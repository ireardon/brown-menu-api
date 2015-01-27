var fs = require('fs');
var http = require('http');

var express = require('express');
var jsdom = require('jsdom');

var port = process.env.PORT || 8089;
var app = express();

var server = http.createServer(app);

var rattyAddress = "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dHg5MkhHc0FXb2xKSV9BcFFmaDhtZGc&gid=0&output=html&widget=false&range=";
					//https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dHg5MkhHc0FXb2xKSV9BcFFmaDhtZGc&gid=0&output=html&widget=false&range=R2C81:R14C84
					
var vdubAddress = "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0Aui-7xDvNkAIdElldE13aXl4RlNZTmtjNzhhaDg1Q0E&gid=0&output=html&widget=false&range=";

					
server.listen(port, function() {
	console.log("LISTENING on port 8089");
});

app.get('/vdub', function(request, response) {
	var rangeString = "R2C1:R21C4";
	
	getVdubMenu(rangeString, function(menu) {
		response.send(menu);
	});
});

app.get('/ratty', function(request, response) {
	var rangeString = "R2C57:R14C60";
					//"R2C9:R14C12",
	
	getRattyMenu(rangeString, function(menu) {
		response.send(menu);
	});
});

function getVdubMenu(rangeString, callback) {
	
}

function getRattyMenu(rangeString, callback) {
	jsdom.env(rattyAddress + rangeString, 
		["http://code.jquery.com/jquery.js"],
		function (errors, window) {
			var $ = window.jQuery;
			
			var $menuTable = $('#tblMain');
			var $menuRows = $menuTable.children().children('tr');
			
			var menu = {};
			var indexToSectionKey = [];
			
			// there should be 14 rows and 5 cells per row
			$menuRows.each(function(r, row) { // iterate over the ROWS of the menu
				if(r > 0 && r != 12) { // rows 0 and 12 are garbage
					$(row).children('td').each(function(c, cell) { // iterate over the COLUMNS of each row
						if(c > 0) { // cell 0 in each row is garbage
							var text = $.trim($(cell).text());
							if(text == '') {
								return;
							}
							
							if(r === 1) { // row 1 is where the section headers are, e.g. "Roots & Shoots"
								indexToSectionKey.push(text);
								menu[text] = [];
							} else {
								var sectionKey = indexToSectionKey[c - 1];
								menu[sectionKey].push(text);
							}
						}
					});
				}
			});
			
			console.log(menu);
			
			return menu;
		}
	);
}