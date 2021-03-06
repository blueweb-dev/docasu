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

// GET parameters
var nodeId = url.extension;

// search for node
var node = search.findNode("workspace://SpacesStore/" + nodeId); 
if(node != null) {
	// make sure is document 
	if(node.isDocument) {
		// get name property
		var nodeName = node.properties.name;
		model.d = node;
		
		model.success = true;
		model.msg = "Versions for " + nodeName + " were loaded";
		logger.log("Versions for " + nodeName + " were loaded");
	} else {
		status.code = 400;
		status.message = "Invalid document reference " + nodeId;
		status.redirect = true;
		logger.log("Invalid document reference " + nodeId);
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + nodeId;
	status.redirect = true;
	logger.log("Invalid node reference " + nodeId);
}
