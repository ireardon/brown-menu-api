var fs = require('fs');
var http = require('http');

var express = require('express');
var jsdom = require('jsdom');

var port = process.env.PORT || 8089;
var app = express();

var server = http.createServer(app);

var rattyAddress = "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dGxVc0NQQkRSYlpyOXltemd6dzRrZkE&gid=0&output=html&widget=false&range=";
					//https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dHg5MkhHc0FXb2xKSV9BcFFmaDhtZGc&gid=0&output=html&widget=false&range=R2C81:R14C84     week of 1/26
					//https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dGxVc0NQQkRSYlpyOXltemd6dzRrZkE&gid=0&output=html&widget=false&range=R2C1:R14C4       week of 2/2
			
var RATTY = 'ratty';
var VDUB = 'vdub';			
var eateryIndex = {
	'ratty': {
		'monday': {
			'breakfast': "R2C1:R14C4",
			'lunch': "R2C5:R14C8",
			'dinner': "R2C9:R14C12"
		},
		'tuesday': {
			'breakfast': "R2C13:R14C16",
			'lunch': "R2C17:R14C20",
			'dinner': "R2C21:R14C24"
		},
		'wednesday': {
			'breakfast': "R2C25:R14C28",
			'lunch': "R2C29:R14C32",
			'dinner': "R2C33:R14C36"
		},
		'thursday': {
			'breakfast': "R2C37:R14C40",
			'lunch': "R2C41:R14C44",
			'dinner': "R2C45:R14C48"
		},
		'friday': {
			'breakfast': "R2C49:R14C52",
			'lunch': "R2C53:R14C56",
			'dinner': "R2C57:R14C60"
		},
		'saturday': {
			'breakfast': "R2C61:R14C64",
			'lunch': "R2C65:R14C68",
			'dinner': "R2C69:R14C72"
		},
		'sunday': {
			'brunch': "R2C77:R14C80",
			'dinner': "R2C81:R14C84"
		}
	},
	'vdub': {
		'monday': {
			'breakfast': "R2C1:R21C4",
			'lunch': "R2C1:R21C4",
			'dinner': "R2C1:R21C4"
		},
		'tuesday': {
			'breakfast': "R2C5:R21C8",
			'lunch': "R2C5:R21C8",
			'dinner': "R2C5:R21C8"
		},
		'wednesday': {
			'breakfast': "R2C9:R21C12",
			'lunch': "R2C9:R21C12",
			'dinner': "R2C9:R21C12"
		},
		'thursday': {
			'breakfast': "R2C13:R21C16",
			'lunch': "R2C13:R21C16",
			'dinner': "R2C13:R21C16"
		},
		'friday': {
			'breakfast': "R2C17:R21C20",
			'lunch': "R2C17:R21C20",
			'dinner': "R2C17:R21C20"
		}
	}
}
					
var rattyCells = {
	'monday': {
		'breakfast': "R2C1:R14C4",
		'lunch': "R2C5:R14C8",
		'dinner': "R2C9:R14C12"
	},
	'tuesday': {
		'breakfast': "R2C13:R14C16",
		'lunch': "R2C17:R14C20",
		'dinner': "R2C21:R14C24"
	},
	'wednesday': {
		'breakfast': "R2C25:R14C28",
		'lunch': "R2C29:R14C32",
		'dinner': "R2C33:R14C36"
	},
	'thursday': {
		'breakfast': "R2C37:R14C40",
		'lunch': "R2C41:R14C44",
		'dinner': "R2C45:R14C48"
	},
	'friday': {
		'breakfast': "R2C49:R14C52",
		'lunch': "R2C53:R14C56",
		'dinner': "R2C57:R14C60"
	},
	'saturday': {
		'breakfast': "R2C61:R14C64",
		'lunch': "R2C65:R14C68",
		'dinner': "R2C69:R14C72"
	},
	'sunday': {
		'brunch': "R2C77:R14C80",
		'dinner': "R2C81:R14C84"
	}
};

var vdubCells = {
	'monday': "R2C1:R21C4",
	'tuesday': "R2C5:R21C8",
	'wednesday': "R2C9:R21C12",
	'thursday': "R2C13:R21C16",
	'friday': "R2C17:R21C20"
};
					
var vdubAddress = "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlK5raaYNAu5dDJiU1N6Z25ZOW8yMVM4dXhhdmdOZ1E&gid=0&output=html&widget=false&range=";
	//https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0Aui-7xDvNkAIdElldE13aXl4RlNZTmtjNzhhaDg1Q0E&gid=0&output=html&widget=false&range=

					
server.listen(port, function() {
	console.log("LISTENING on port 8089");
});

app.get('/vdub/:dayOfWeek/:meal', function(request, response) {
	var dayOfWeek = request.params.dayOfWeek.toLowerCase();
	var meal = request.params.meal.toLowerCase();
	
	var validDict = getValidRequest(VDUB, dayOfWeek, meal);
	if(validDict.invalid) {
		response.send(validDict.errorMessage);
		return;
	}
	
	var rangeString = getVdubRangeString(dayOfWeek, meal);
	
	getVdubMenu(rangeString, function(menu) {
		response.send(menu);
	});
});

app.get('/ratty/:dayOfWeek/:meal', function(request, response) {
	var dayOfWeek = request.params.dayOfWeek.toLowerCase();
	var meal = request.params.meal.toLowerCase();
	
	var validDict = getValidRequest(RATTY, dayOfWeek, meal);
	if(validDict.invalid) {
		response.send(validDict.errorMessage);
		return;
	}
	
	var rangeString = getRattyRangeString(dayOfWeek, meal);
	
	getRattyMenu(rangeString, function(menu) {
		response.send(menu);
	});
});

function getRattyRangeString(dayOfWeek, meal) {
	return eateryIndex.ratty[dayOfWeek][meal];
}

function getVdubRangeString(dayOfWeek, meal) {
	return eateryIndex.vdub[dayOfWeek][meal];
}

function getVdubMenu(rangeString, callback) {
		jsdom.env(vdubAddress + rangeString, 
		["http://code.jquery.com/jquery.js"],
		function (errors, window) {
			var $ = window.jQuery;
			
			var $menuTable = $('#tblMain');
			var $menuRows = $menuTable.children().children('tr');
			
			var menu = {};
			var indexToSectionKey = [];
			
			// there should be 21 rows and 5 cells per row
			$menuRows.each(function(r, row) { // iterate over the ROWS of the menu
				if(r > 0) { // row 0 is garbage
					$(row).children('td').each(function(c, cell) { // iterate over the COLUMNS of each row
						if(c > 0) { // cell 0 in each row is garbage
							var text = $.trim($(cell).text());
							if(excludeText(text)) {
								return;
							}
							
							if(r === 1) { // row 1 is where the meal headers are, e.g. "Lunch"
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
			
			callback(menu);
		}
	);
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
							if(excludeText(text)) {
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
			
			callback(menu);
		}
	);
}

function excludeText(text) {
	if(text == '') {
		return true;
	}
	
	return false;
}

function getValidRequest(eatery, dayOfWeek, meal) {
	var validDict = {
		'invalid': false
	};
	
	if(!eateryIndex[eatery][dayOfWeek]) {
		validDict.invalid = true;
		validDict.errorMessage = "ERROR: No service at eatery:" + eatery + " on dayOfWeek:" + dayOfWeek + ".";
		return validDict;
	}
		
	if(!eateryIndex[eatery][dayOfWeek][meal]) {
		validDict.invalid = true;
		validDict.errorMessage = "ERROR: No service at eatery:" + eatery + " for meal:" + meal + " on dayOfWeek:" + dayOfWeek + ".";
		return validDict;
	}

	return validDict;
}
