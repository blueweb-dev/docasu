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
 

// AdvancedSearchComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.AdvancedSearchComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.AdvancedSearchComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.AdvancedSearchComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"AdvancedSearchComponent",
	title		:	"Advanced Search Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var searchField = new Ext.form.TextField({
			fieldLabel		:	"Query",
			name			:	"q",
			width			:	150
		});
		var typeCombo = new Ext.form.ComboBox({
			fieldLabel		:	"Search for",
			hiddenName		:	"t",
			store			:	new Ext.data.SimpleStore({
									fields	:	["code", "label"],
									data	:	[	
													["", "All items"],
													["content", "Documents"],
													["file", "File names"],
													["folder", "Folder names"]
												]
								}),
			displayField	:	"label",
			valueField		:	"code",
			mode			:	"local",
			value			:	"",
			width			:	150,
			triggerAction	:	"all",
			readOnly		:	true,
			editable		: false
		});
		var createdFrom = new Ext.form.DateField({
			fieldLabel		:	"Created After",
			name			:	"createdFrom",
			format			:	"Y/m/d",
			width			:	150
		});
		var createdTo = new Ext.form.DateField({
			fieldLabel		:	"Created Before",
			name			:	"createdTo",
			format			:	"Y/m/d",
			width			:	150
		});
		var modifiedFrom = new Ext.form.DateField({
			fieldLabel		:	"Modified After",
			name			:	"modifiedFrom",
			format			:	"Y/m/d",
			width			:	150
		});
		
		var modifiedTo = new Ext.form.DateField({
			fieldLabel		:	"Modified Before",
			name			:	"modifiedTo",
			format			:	"Y/m/d",
			width			:	150
		});
		var lookInCombo = new Ext.form.ComboBox({
			fieldLabel		:	"Look in",
			width			:	150,
			hiddenName		:	"folderId",
			store			:	new Ext.data.SimpleStore({
									fields	:	["code", "label"],
									data	:	[
													["", "All Folders"],
													[DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").getCurrentFolder(), "Current Folder"] 
												]
								}),
			displayField	:	"label",
			valueField		:	"code",
			value			:	"",
			mode			:	"local",
			selectOnFocus	:	true,
			triggerAction	:	"all",
			editable		:	false
		});
		var advSearchForm = new Ext.form.FormPanel({
			id				:	"advSearchForm",
			width			:	600,
			height			:	160,
			frame			:	false,
			bodyStyle		:	"border: none",
			keys			:	[{
									key		:	Ext.EventObject.ENTER,
									handler : function() {
										DoCASU.App.PluginManager.getPluginManager().getComponent("AdvancedSearchComponent", "DoCASU.App.Core").submit();
									}
								}],
			layout			:	"column",
			layoutConfig	:	{itemCls: "pad-children"},
			items			:	[
									new Ext.Panel({
										width	:	280,
										layout	:	"form",
										border	:	false,
										style	:	"margin:8px 4px 4px 4px",
										items	:	[searchField, typeCombo, lookInCombo]
									}),
									new Ext.Panel({
										width	:	280,
										layout	:	"form",
										border	:	false,
										style	:	"margin:8px 4px 4px 4px",
										items	:	[createdFrom, createdTo, modifiedFrom, modifiedTo]
									})
								],
			buttons			:	[
									new Ext.Button({
										text	:	"Search",
										handler : function() {
											DoCASU.App.PluginManager.getPluginManager().getComponent("AdvancedSearchComponent", "DoCASU.App.Core").submit();
										}
									})
								]
		});
		var uiConfig	=	{
								id				:	this.id,
								title			:	"Advanced Search",
								width			:	580,
								height			:	200,
								modal			:	true,
								iconCls			:	"icon-grid",
								animCollapse	:	false,
								constrainHeader	:	true,
								resizable		:	false,
								buttonAlign		:	"center",
							    items			:	[advSearchForm]		
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	

	show : function() {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.show();
		// populate search fields according to previous search
		var centerView = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
		var searchParameters = centerView.items.items[1].store.baseParams;
		var searchForm = Ext.getCmp("advSearchForm").form;
		searchForm.setValues(searchParameters);
	}, // eo show
	
	submit : function () {
		var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
		searchAction.on("afterload", function(component) {
			var uiWidget;
			try {
				uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("AdvancedSearchComponent");
			} catch(err) {
				// no UI widget was created thus component is disabled or closed
				return;
			}
			uiWidget.close();
		});
		searchAction.on("fail", function(component) {
			var uiWidget;
			try {
				uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("AdvancedSearchComponent");
			} catch(err) {
				// no UI widget was created thus component is disabled or closed
				return;
			}
			uiWidget.close();
		});
		// get search parameters
		var searchForm = Ext.getCmp("advSearchForm");
		var searchParameters = searchForm.form.getValues(false);
		// validate search parameters
		var message = this.validateSearchParameters(searchParameters);
		if(message.length > 0) {
			// invalid search parameters
			Ext.MessageBox.show({
				title: "Invalid search parameters",
				msg: message,
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});
			return false;
		}
		// perform search
		searchAction.advancedSearch(searchParameters);
	}, // eo submit
	
	validateSearchParameters : function (params) {
		// validate dates
		var createdFrom = null;
		var createdTo = null;
		var modifiedFrom = null;
		var modifiedTo = null;
		if (params.createdFrom != undefined && params.createdFrom.length > 0) {
			createdFrom = Date.parse(params.createdFrom);
		}
		if (params.createdTo != undefined && params.createdTo.length > 0) {
			createdTo = Date.parse(params.createdTo);
		}
		if (params.modifiedFrom != undefined && params.modifiedFrom.length > 0) {
			modifiedFrom = Date.parse(params.modifiedFrom);
		}
		if (params.modifiedTo != undefined && params.modifiedTo.length > 0) {
			modifiedTo = Date.parse(params.modifiedTo);
		}
		if(createdFrom != null &&  createdTo != null && createdTo < createdFrom) {
			// if createdTo is before createdFrom 
			return "'Created Before' date cannot be set before 'Created After' date!";
		}
		if(modifiedFrom != null &&  modifiedTo != null && modifiedTo < modifiedFrom) {
			// if modifiedTo is before modifiedFrom 
			return "'Modified Before' date cannot be set before 'Modified After' date!";
		}
		if(createdFrom != null &&  modifiedTo != null && modifiedTo < createdFrom) {
			// if modifiedTo is before createdFrom 
			return "'Modified Before' date cannot be set before 'Created After' date!";
		}
		// validate query
		var query = null;
		if (params.q != undefined && params.q.length > 0) {
			query = params.q;
		} 
		if (query == null && createdFrom == null && createdTo == null && modifiedFrom == null && modifiedTo == null) {
			return "Missing search keyword";
		}
		return "";
	} // eo validateSearchParameters
		
}); // eo DoCASU.App.Core.AdvancedSearchComponent
