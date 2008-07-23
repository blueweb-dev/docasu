/*
 *    Copyright (C) 2008 Optaros, Inc. All rights reserved.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program. If not, see <http://www.gnu.org/licenses/>.
 *    
 */

function compareModified(n1, n2) {
	var d1 = n1.properties["cm:modified"];
	var d2 = n2.properties["cm:modified"];
	
	return d1 < d2 ? 1 : d1 > d2 ? -1 : 0;
}

function writeDateForRange(d) {
	var temp = d;
	return temp.getFullYear() + "\\-" + (temp.getMonth() + 1) + "\\-" +
		(temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate()) + "T00:00:00";
}

function y2k(number) {
	return (number < 1000) ? number + 1900 : number;
}

// get the date 3 days ago
var date = new Date();
var oldDate = new Date(Date.UTC(y2k(date.getYear()),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()) 
	- 3*24*60*60*1000);

var luceneQuery = "+@cm\\:modified:[" + writeDateForRange(oldDate) + " TO "
			+ writeDateForRange(new Date()) + "] AND TYPE:\"cm:content\" AND NOT PATH:\"/app:company_home/app:dictionary//.\""
			+ "AND PATH:\"/app:company_home//.\"";

logger.log(luceneQuery);

var results = search.luceneSearch(luceneQuery);

results.sort(compareModified);

if (results.length > 20) {
	model.resultset = results.slice(0, 20);
}
else {
	model.resultset = results;
}