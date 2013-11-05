{
	// Encore Tools.jsx
	// Copyright (c) 2012 Adobe Systems, Incorporated. All rights reserved.
	// 
	// A script for setting up layers in Adobe(R) After Effects(R) CS6
	// for use in Adobe Encore(R). The functionality in this script 
	// mimics that available in the former Layer > Adobe Encore 
	// submenu (which is no longer available in CS6). Use at your 
	// own risk. Brought to you by Jeff of the After Effects crew.
	// 
	// You can use this script launcher as a dockable panel by 
	// placing it in a ScriptUI Panels subfolder of the Scripts 
	// folder, and then choosing the Encore Tools.jsx script from 
	// the Window menu.
	
	
	function EncoreTools(thisObj)
	{
		var encoreToolsData = new Object();
		encoreToolsData.scriptName = "Encore Tools";
		encoreToolsData.version = "1.0";
		
		encoreToolsData.strHelp = "?";
		encoreToolsData.strCreateButton = "Create Button...";
		encoreToolsData.strAssignToSubpicture1 = "Assign to Subpicture 1";
		encoreToolsData.strAssignToSubpicture2 = "Assign to Subpicture 2";
		encoreToolsData.strAssignToSubpicture3 = "Assign to Subpicture 3";
		encoreToolsData.strAssignToVideoThumbnail = "Assign to Video Thumbnail";
		encoreToolsData.strCreateButtonTitle = "Create Adobe Encore Button";
		encoreToolsData.strButtonName = "Button name:";
		encoreToolsData.strSubpicture1 = "Subpicture 1:";
		encoreToolsData.strSubpicture2 = "Subpicture 2:";
		encoreToolsData.strSubpicture3 = "Subpicture 3:";
		encoreToolsData.strVideoThumbnail = "Video Thumbnail:";
		encoreToolsData.strButtonNameDefault = "Button";
		encoreToolsData.strLayerNone = "None";
		encoreToolsData.strUndoEventAssign = "Assign to Encore Layer";
		encoreToolsData.strUndoEventCreateButton = "Create Button";
		encoreToolsData.strPrefixButton = "(+)";
		encoreToolsData.strPrefixSubpicture1 = "(=1)";
		encoreToolsData.strPrefixSubpicture2 = "(=2)";
		encoreToolsData.strPrefixSubpicture3 = "(=3)";
		encoreToolsData.strPrefixVideoThumbnail = "(%)";

		encoreToolsData.strOK = "OK";
		encoreToolsData.strCancel = "Cancel";
		encoreToolsData.strAboutTitle = "About " + encoreToolsData.scriptName;
		encoreToolsData.strAbout = encoreToolsData.scriptName + " " + encoreToolsData.version + "\n" +
			"Copyright (c) 2012 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"A script for setting up layers in Adobe(R) After Effects(R) CS6 for use in Adobe Encore(R). The functionality in this script mimics that available in the former Layer > Adobe Encore submenu (which is no longer available in CS6). Use at your own risk. Brought to you by Jeff of the After Effects crew.\n" +
			"\n" +
			"You can use this script launcher as a dockable panel by placing it in a ScriptUI Panels subfolder of the Scripts folder, and then choosing the Encore Tools.jsx script from the Window menu.";
		encoreToolsData.strErrNoProj = "Create or open a project and a composition in it, and try again";
		encoreToolsData.strErrNoActiveComp = "Select or open a single composition, and try again.";
		encoreToolsData.strErrNoSelLayer = "Select at least one layer, and try again.";
		encoreToolsData.strErrMinAE110 = "This script requires Adobe After Effects CS6 or later.";
		
		
		// encoreTools_buildUI()
		// Function for creating the user interface
		function encoreTools_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", encoreToolsData.scriptName, undefined, {resizeable:true});
			if (pal != null)
			{
				var res = 
				"""group { 
					orientation:'column', alignment:['fill','fill'], alignChildren:['fill','top'], spacing:5, margins:[0,0,0,0], 
					header: Group { 
						alignment:['fill','top'], 
						helpBtn: Button { text:'""" + encoreToolsData.strHelp + """', alignment:['right','top'], preferredSize:[25,-1] }, 
					}, 
					createButton: Button { text:'""" + encoreToolsData.strCreateButton + """' },
					assignToSubpicture1: Button { text:'""" + encoreToolsData.strAssignToSubpicture1 + """' },
					assignToSubpicture2: Button { text:'""" + encoreToolsData.strAssignToSubpicture2 + """' },
					assignToSubpicture3: Button { text:'""" + encoreToolsData.strAssignToSubpicture3 + """' },
					assignToVideoThumbnail: Button { text:'""" + encoreToolsData.strAssignToVideoThumbnail + """' },
				}""";
				
				pal.margins = [10,10,10,10];
				pal.grp = pal.add(res);
				
				pal.grp.createButton.onClick = function ()
				{
					if (app.project == null)
					{
						alert(encoreToolsData.strErrNoProj, encoreToolsData.strAboutTitle);
						return;
					}
					
					if ((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem)))
					{
						alert(encoreToolsData.strErrNoActiveComp, encoreToolsData.strAboutTitle);
						return;
					}
					var comp = app.project.activeItem;
					
					if (comp.selectedLayers.length == 0)
					{
						alert(encoreToolsData.strErrNoSelLayer, encoreToolsData.strAboutTitle);
						return;
					}
					
					var dlg = new Window("dialog", encoreToolsData.strCreateButtonTitle, undefined, {resizeable:false});
					if (dlg != null)
					{
						var res = 
						"""group { 
							orientation:'column', alignment:['fill','fill'], alignChildren:['right','top'], spacing:5, margins:[0,0,0,0], 
							buttonName: Group {
								lbl: StaticText { text:'""" + encoreToolsData.strButtonName + """' },
								val: EditText { text:'""" + encoreToolsData.strButtonNameDefault + """', characters:20 },
							},
							subpicture1: Group {
								lbl: StaticText { text:'""" + encoreToolsData.strSubpicture1 + """' },
								val: DropDownList { properties:{ items:['""" + encoreToolsData.strLayerNone + """', '-'] } },
							},
							subpicture2: Group {
								lbl: StaticText { text:'""" + encoreToolsData.strSubpicture2 + """' },
								val: DropDownList { properties:{ items:['""" + encoreToolsData.strLayerNone + """', '-'] } },
							},
							subpicture3: Group {
								lbl: StaticText { text:'""" + encoreToolsData.strSubpicture3 + """' },
								val: DropDownList { properties:{ items:['""" + encoreToolsData.strLayerNone + """', '-'] } },
							},
							videoThumbnail: Group {
								lbl: StaticText { text:'""" + encoreToolsData.strVideoThumbnail + """' },
								val: DropDownList { properties:{ items:['""" + encoreToolsData.strLayerNone + """', '-'] } },
							},
							sep: Panel { preferredSize:[-1,2], alignment:['fill','bottom'] },
							cmds: Group { 
								alignment:['right','bottom'], """;
						if ($.os.indexOf("Windows") != -1)	// order the OK/Cancel buttons based on OS convention
						{
							res += """
								okBtn: Button { text:'""" + encoreToolsData.strOK + """' }, 
								cancelBtn: Button { text:'""" + encoreToolsData.strCancel + """' }, 
							""";
						}
						else
						{
							res += """
								cancelBtn: Button { text:'""" + encoreToolsData.strCancel + """' }, 
								okBtn: Button { text:'""" + encoreToolsData.strOK + """' }, 
							""";
						}
						res += """
							}, 
						}""";
					}
					dlg.margins = [10,10,10,10];
					dlg.grp = dlg.add(res);
					
					// Get the list of selected layers' names (in top-to-bottom order). Assumes we have selected layers, which is a prerequisite for clicking the Create Button button.
					var comp = app.project.activeItem;
					for (var i=0; i<comp.selectedLayers.length; i++)
					{
						dlg.grp.subpicture1.val.add("item", comp.selectedLayers[i].name);
						dlg.grp.subpicture2.val.add("item", comp.selectedLayers[i].name);
						dlg.grp.subpicture3.val.add("item", comp.selectedLayers[i].name);
						dlg.grp.videoThumbnail.val.add("item", comp.selectedLayers[i].name);
					}
					dlg.grp.subpicture1.val.selection = 
						dlg.grp.subpicture2.val.selection = 
						dlg.grp.subpicture3.val.selection = 
						dlg.grp.videoThumbnail.val.selection = 0;

					dlg.grp.subpicture1.val.onChange = 
						dlg.grp.subpicture2.val.onChange = 
						dlg.grp.subpicture3.val.onChange = 
						dlg.grp.videoThumbnail.val.onChange = function()
					{
						var selectedLayerIndex = this.selection.index;
						if (selectedLayerIndex > 1)
						{
							// Set all dropdownlists that match the selection to None
							if ((this != this.parent.parent.subpicture1.val) && (this.parent.parent.subpicture1.val.selection.index == selectedLayerIndex))
								this.parent.parent.subpicture1.val.selection = 0;
							if ((this != this.parent.parent.subpicture2.val) && (this.parent.parent.subpicture2.val.selection.index == selectedLayerIndex))
								this.parent.parent.subpicture2.val.selection = 0;
							if ((this != this.parent.parent.subpicture3.val) && (this.parent.parent.subpicture3.val.selection.index == selectedLayerIndex))
								this.parent.parent.subpicture3.val.selection = 0;
							if ((this != this.parent.parent.videoThumbnail.val) && (this.parent.parent.videoThumbnail.val.selection.index == selectedLayerIndex))
								this.parent.parent.videoThumbnail.val.selection = 0;
						}
					};
					
					dlg.grp.cmds.okBtn.onClick = encoreTools_createButton;
					
					dlg.grp.subpicture1.val.preferredSize.width = 
						dlg.grp.subpicture2.val.preferredSize.width = 
						dlg.grp.subpicture3.val.preferredSize.width = 
						dlg.grp.videoThumbnail.val.preferredSize.width = dlg.grp.buttonName.val.preferredSize.width;
					
					dlg.layout.layout(true);
					dlg.center();
					dlg.show();
				}
				pal.grp.assignToSubpicture1.onClick = function () {encoreTools_assignLayers(encoreToolsData.strPrefixSubpicture1);}
				pal.grp.assignToSubpicture2.onClick = function () {encoreTools_assignLayers(encoreToolsData.strPrefixSubpicture2);}
				pal.grp.assignToSubpicture3.onClick = function () {encoreTools_assignLayers(encoreToolsData.strPrefixSubpicture3);}
				pal.grp.assignToVideoThumbnail.onClick = function () {encoreTools_assignLayers(encoreToolsData.strPrefixVideoThumbnail);}
				pal.grp.header.helpBtn.onClick = function () {alert(encoreToolsData.strAbout, encoreToolsData.strAboutTitle);}
				
				pal.layout.layout(true);
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
			}
			
			return pal;
		}
		
		
		// encoreTools_createButton()
		// Function for creating an Encore button; assumes there are selected layers
		function encoreTools_createButton()
		{
			var comp = app.project.activeItem;
			var layer;
			
			var btnName = this.parent.parent.buttonName.val;
			// Update selected layer names (prefixes) based on button creation settings
			var subpic1 = this.parent.parent.subpicture1.val;
			var subpic2 = this.parent.parent.subpicture2.val;
			var subpic3 = this.parent.parent.subpicture3.val;
			var vidThumb = this.parent.parent.videoThumbnail.val;
			
			app.beginUndoGroup(encoreToolsData.strUndoEventCreateButton);
			
			if (subpic1.selection.index > 1)
			{
				layer = comp.selectedLayers[subpic1.selection.index - 2];	// ignore the None and separator so we have an offset number
				layer.name = encoreTools_updateLayerNameWithPrefix(layer.name, encoreToolsData.strPrefixSubpicture1);
			}
			if (subpic2.selection.index > 1)
			{
				layer = comp.selectedLayers[subpic2.selection.index - 2];	// ignore the None and separator so we have an offset number
				layer.name = encoreTools_updateLayerNameWithPrefix(layer.name, encoreToolsData.strPrefixSubpicture2);
			}
			if (subpic3.selection.index > 1)
			{
				layer = comp.selectedLayers[subpic3.selection.index - 2];	// ignore the None and separator so we have an offset number
				layer.name = encoreTools_updateLayerNameWithPrefix(layer.name, encoreToolsData.strPrefixSubpicture3);
			}
			if (vidThumb.selection.index > 1)
			{
				layer = comp.selectedLayers[vidThumb.selection.index - 2];	// ignore the None and separator so we have an offset number
				layer.name = encoreTools_updateLayerNameWithPrefix(layer.name, encoreToolsData.strPrefixVideoThumbnail);
			}
			
			// Get the list of the selected layers' indices based on top-to-bottom order
			var selLayerIndices = [];
			for (var i=1; i<=comp.numLayers; i++)
			{
				if (comp.layer(i).selected)
					selLayerIndices[selLayerIndices.length] = i;
			}
			
			// Precomp the selected layers
			var precomp = comp.layers.precompose(selLayerIndices, encoreToolsData.strPrefixButton + btnName.text, true);
			precomp.selected = true;
			
			app.endUndoGroup();
			
			this.window.close();
		}
		
		
		// encoreTools_updateLayerNameWithPrefix()
		// Function for strip any existing prefix, and using the specified prefix; returning the new name
		function encoreTools_updateLayerNameWithPrefix(layerName, newPrefix)
		{
			var matches = layerName.match(/^(\(((=(1|2|3))|%)\))(.*)/);
			if (matches && (matches.length == 6))
				return newPrefix + matches[5];
			else
				return newPrefix + layerName;
		}
		
		
		// encoreTools_assignLayers()
		// Function for assigning the selected layers to the specified type of object
		function encoreTools_assignLayers(prefix)
		{
			if (app.project == null)
			{
				alert(encoreToolsData.strErrNoProj, encoreToolsData.strAboutTitle);
				return;
			}
			
			if ((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem)))
			{
				alert(encoreToolsData.strErrNoActiveComp, encoreToolsData.strAboutTitle);
				return;
			}
			var comp = app.project.activeItem;
			
			if (comp.selectedLayers.length == 0)
			{
				alert(encoreToolsData.strErrNoSelLayer, encoreToolsData.strAboutTitle);
				return;
			}
			
			app.beginUndoGroup(encoreToolsData.strUndoEventAssign);
			
			for (var i=0; i<comp.selectedLayers.length; i++)
			{
				var layer = comp.selectedLayers[i];
				layer.name = encoreTools_updateLayerNameWithPrefix(layer.name, prefix);
				
				if (prefix == encoreToolsData.strPrefixVideoThumbnail)	// video thumbnail can only be assigned to one layer
					break;
			}
			
			app.endUndoGroup();
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 11)
		{
			alert(encoreToolsData.strErrMinAE110, encoreToolsData.scriptName);
			return;
		}
		else
		{
			var etPal = encoreTools_buildUI(thisObj);
			if (etPal != null)
			{
				if (etPal instanceof Window)
				{
					etPal.center();
					etPal.show();
				}
				else
					etPal.layout.layout(true);
			}
		}
	}
	
	EncoreTools(this);
}