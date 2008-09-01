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

// only works for nodes in workspace://SpacesStore

// If a node ID is passed to the service in parameter folderId use that one
// else show the folders for companyhome
var folderId = null;
if (typeof(args.folderId) != 'undefined' && args.folderId != 'null') {
	folderId = args.folderId;
} else {
	folderId = companyhome.id;
}

var nodeRef = "workspace://SpacesStore/" + folderId;
if (logger.isLoggingEnabled()) {
	logger.log("Create Folder in the folder: " + nodeRef);
}

var folder = search.findNode(nodeRef);

if (folder == undefined || !folder.isContainer)
{
	status.code = 404;
   	status.message = "Folder " + args.folderId + " not found.";
   	status.redirect = true;
} else if (folder.hasPermission("CreateChildren")) {
   // create the folder
   newFolder = folder.createFolder(args.folderName);
}

model.msg = args.folderName;