{
	// Folder Setup.jsx
	// Copyright (c) 2007-2012 Adobe Systems, Incorporated. All rights reserved.
	// 
	// The unofficial project folder hierarchy creator for Adobe(R) 
	// After Effects(R) CS4 or later. Use at your own risk. Brought to 
	// you by Jeff of the After Effects crew. Inspired by the 
	// FolderMaker.jsx script from Ross McTaggart.
	// 
	// Notes:
	// This script allows you to describe a hierarchy of folders 
	// to create in the Project panel by entering folder names on 
	// successive lines, with the indentation implying the nesting 
	// level.
	// 
	// To enter new lines, press Ctrl+Enter (Windows) or
	// Ctrl+Return (Mac) in CS5.5 and earlier, or just Enter/Return 
	// in CS6 and later. Use four (4) additional spaces of 
	// indentation at the beginning of a line to indicate that 
	// you want a folder to be created inside the previous 
	// parent folder.
	// 
	// You can use this script as a dockable panel by placing it 
	// in a ScriptUI Panels subfolder of the Scripts folder, and 
	// then choosing the Folder Setup.jsx script from the 
	// Window menu.
	
	
	function FolderSetup(thisObj)
	{
		var folderSetupData = new Object();
		folderSetupData.scriptName = "Folder Setup";
		folderSetupData.version = "1.2";
		
		folderSetupData.strAboutTitle = "About " + folderSetupData.scriptName;
		folderSetupData.strAbout = folderSetupData.scriptName + " " + folderSetupData.version + "\n" +
			"Copyright (c) 2007-2012 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"The unofficial project folder hierarchy creator for Adobe(R) After Effects(R) CS4 or later. Use at your own risk. Brought to you by Jeff of the After Effects crew. Inspired by the FolderMaker.jsx script from Ross McTaggart.\n" +
			"\n" +
			"Notes:\n" +
			"This script allows you to describe a hierarchy of folders to create in the Project panel by entering folder names on successive lines, with the indentation implying the nesting level.\n" +
			"\n" +
			"To enter new lines, press Ctrl+Enter (Windows) or Ctrl+Return (Mac) in CS5.5 and earlier, or just Enter/Return in CS6 and later. Use four (4) additional spaces of indentation at the beginning of a line to indicate that you want a folder to be created inside the previous parent folder.\n" +
			"\n" +
			"You can use this script as a dockable panel by placing it in a ScriptUI Panels subfolder of the Scripts folder, and then choosing the Folder Setup.jsx script from the Window menu.";
		folderSetupData.strFolderHierarchy = "Folder Hierarchy:";
		folderSetupData.strDefaultHierarchy = "Folder 1\n    Subfolder A\n        Sub-subfolder I\n        Sub-subfolder II\n    Subfolder B\nFolder 2\n    Subfolder C\n    Subfolder D\nFolder 3";
		folderSetupData.strCreateFolders = "Create Folders";
		folderSetupData.strHelp = "?";
		folderSetupData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
		
		
		// folderSetup_buildUI()
		// Function for creating the user interface
		function folderSetup_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", folderSetupData.scriptName, undefined, {resizeable: true});
			
			if (pal != null)
			{
				var hierarchyWantReturn = (parseFloat(app.version) >= 11) ? ", wantReturn: true" : "";
				var res = 
				"""group { 
					orientation:'column', alignment:['fill','fill'], 
					header: Group { 
						alignment:['fill','top'], 
						hierarchyTitle: StaticText { text:'""" + folderSetupData.strFolderHierarchy + """', alignment:['fill','bottom'] }, 
						helpBtn: Button { text:'""" + folderSetupData.strHelp + """', alignment:['right','top'], preferredSize:[25,-1] }, 
					}, 
					hierarchy: EditText { properties:{multiline: true""" + hierarchyWantReturn + """}, alignment:['fill','fill'], preferredSize:[150,150] }, 
					createBtn: Button { text:'""" + folderSetupData.strCreateFolders + """', alignment:['center','bottom'] }, 
				}""";
				pal.margins = [10,10,10,10];
				pal.grp = pal.add(res);
				
				pal.grp.header.helpBtn.onClick = function () {alert(folderSetupData.strAbout, folderSetupData.strAboutTitle);}
				pal.grp.hierarchy.text = folderSetupData.strDefaultHierarchy;
				pal.grp.createBtn.onClick = folderSetup_doCreateFolders;
				
				pal.layout.layout(true);
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
			}
			
			return pal;
		}
		
		
		// folderSetup_doCreateFolders()
		// Callback function for creating the actual folder structure
		function folderSetup_doCreateFolders()
		{
			var folderNames = this.parent.hierarchy.text.split("\n");	// Split the lines of edittext content into an array
			
			if (folderNames.length > 0)
			{
				app.beginUndoGroup(folderSetupData.scriptName);
				
				var matches;
				var currParent = lastFolder = app.project.rootFolder, newFolder;
				var currIndent = 0, newIndent;
				
				// Traverse the folder names
				for (var f in folderNames)
				{
					// Use a regular expression to pick off the indentation and folder name
					matches = folderNames[f].match(/^(\s*)(.*)$/);
					if ((matches != null) && ((matches.length == 3) && (matches[2] != "")))	// Skip blank lines
					{
						//$.writeln("creating folder named '"+matches[2]+"'");
						newIndent = parseInt(matches[1].length / 4);
						
						// Determine where to place the new folder
						if (newIndent > currIndent)				// Nest new folder
						{
							currParent = lastFolder;
							currIndent++;
						}
						else if (newIndent < currIndent)		// Create in some parent folder
						{
							// Find indent matching newIndent by traversing parent folders
							while ((currIndent > 0) && (currIndent > newIndent))
							{
								currParent = currParent.parentFolder;
								currIndent--;
							}
						}
						// else create at same level as previous folder (sibling)
						
						// Create the new folder in the current parent
						lastFolder = newFolder = app.project.items.addFolder(matches[2]);
						newFolder.parentFolder = currParent;
					}
				}
				
				app.endUndoGroup();
			}
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 9)
		{
			alert(folderSetupData.strErrMinAE90, folderSetupData.scriptName);
			return;
		}
		else
		{
			var fsPal = folderSetup_buildUI(thisObj);
			if (fsPal != null)
			{
				// Use the last defined folder hierarchy (saved in the After Effects preferences file), if it exists
				if (app.settings.haveSetting("Adobe", "folderSetup_hierarchy"))
				{
					fsPal.grp.hierarchy.text = app.settings.getSetting("Adobe", "folderSetup_hierarchy").toString();
				}
				
				// Save current folder hierarchy upon closing the palette
				fsPal.onClose = function()
				{
					app.settings.saveSetting("Adobe", "folderSetup_hierarchy", fsPal.grp.hierarchy.text);
				}
				
				if (fsPal instanceof Window)
				{
					fsPal.center();
					fsPal.show();
				}
				else
					fsPal.layout.layout(true);
			}
		}
	}
	
	FolderSetup(this);
}