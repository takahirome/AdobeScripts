{
	// Launch Pad.jsx
	// Copyright (c) 2007-2008 Adobe Systems, Incorporated. All rights reserved.
	// 
	// The unofficial script launcher for Adobe(R) After Effects(R) 
	// CS4 or later. Use at your own risk. Brought to you by Jeff 
	// of the After Effects crew.
	// 
	// Notes:
	// This launcher creates buttons for all .jsx and .jsxbin script 
	// files located in the selected scripts folder, which you can 
	// change by clicking the '...' button; subfolders are not 
	// scanned. If you place a 30x30 or smaller PNG file in the 
	// same folder and with the same base name as the script 
	// (just with a .png extension, e.g., KeyEd Up.png for the 
	// KeyEd Up.jsx script), the PNG file will be used as an icon 
	// button instead. Good stuff.
	// 
	// You can use this script launcher as a dockable panel by 
	// placing it in a ScriptUI Panels subfolder of the Scripts 
	// folder, and then choosing the Launch Pad.jsx script from 
	// the Window menu. Even more good stuff.
	
	
	function LaunchPad(thisObj)
	{
		var launchPadData = new Object();
		launchPadData.scriptName = "Launch Pad";
		launchPadData.version = "1.1";
		
		launchPadData.strSettings = "...";
		launchPadData.strSettingsTip = "Settings";
		launchPadData.strHelp = "?";
		launchPadData.strHelpTip = "Help";
		launchPadData.settingsTitle = launchPadData.scriptName + " Settings";
		launchPadData.settingsScripts = "Scripts (listed in order of appearance):"
		launchPadData.strSelScriptsFolder = "Select the scripts folder to use";
		launchPadData.strAboutTitle = "About " + launchPadData.scriptName;
		launchPadData.strAbout = launchPadData.scriptName + " " + launchPadData.version + "\n" +
			"Copyright (c) 2007-2008 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"The unofficial script launcher for Adobe(R) After Effects(R) CS4 or later. Use at your own risk. Brought to you by Jeff of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"This launcher creates buttons for all .jsx and .jsxbin script files located in the selected scripts folder, which you can change by clicking the '...' button; subfolders are not scanned. If you place a 30x30 or smaller PNG file in the same folder and with the same base name as the script (just with a .png extension, e.g., KeyEd Up.png for the KeyEd Up.jsx script), the PNG file will be used as an icon button instead. Good stuff.\n" +
			"\n" +
			"You can use this script launcher as a dockable panel by placing it in a ScriptUI Panels subfolder of the Scripts folder, and then choosing the Launch Pad.jsx script from the Window menu. Even more good stuff.";
		launchPadData.strRefreshPanel = "Please close and then reopen Launch Pad to refresh the panel's script buttons.";
		launchPadData.strErrCantLaunchScript = "Could not launch script '%s' because it no longer exists on disk."
		launchPadData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
		
		launchPadData.btnSize = 36;
		
		
		// launchPad_buildUI()
		// Function for creating the user interface
		function launchPad_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", launchPadData.scriptName, [200, 200, 600, 500], {resizeable: true});
			
			if (pal != null)
			{
				pal.bounds.width = (launchPadData.btnSize+5)*10 + 5;
				pal.bounds.height = (launchPadData.btnSize+5)*1 + 5;
				
				pal.scriptBtns = null;
				launchPad_rebuildButtons(pal);
				
				pal.onResize = launchPad_doResizePanel;
				pal.onResizing = launchPad_doResizePanel;
			}

			return pal;
		}
		
		
		// launchPad_filterJSXFiles()
		// Function for filtering .jsx files that are not the current file. Used with the Folder.getFiles() function.
		function launchPad_filterJSXFiles(file)
		{
			return ((file.name.match(/.jsx(bin)?$/) != null) && (file.name != (new File($.fileName)).name));
		}
		
		
		// launchPad_rebuildButtons()
		// Function for creating/recreating the button layout
		function launchPad_rebuildButtons(palObj)
		{
			var topEdge = 4;
			var leftEdge = 4;
			var btnSize = launchPadData.btnSize;
			var btnIconFile, defBtnIconFile;
			
			// Remove the existing buttons (all of them)
			if (palObj.btnGroup != undefined)
			{
				while (palObj.btnGroup.children.length > 0)
					palObj.btnGroup.remove(0);
				palObj.remove(0);
			}
			
			// Add buttons for scripts
			//alert("Folder.current = "+launchPadData.thisScriptsFolder.toString());
			defBtnIconFile = new File(launchPadData.thisScriptsFolder.fsName + "/Launch Pad_jsx-icon.png");
			if (!defBtnIconFile.exists)
				defBtnIconFile = null;
			
			palObj.scriptBtns = undefined;
			palObj.scriptBtns = new Array();
			
			// Place controls in a group container to get the panel background love
			palObj.btnGroup = palObj.add("group", [0, 0, palObj.bounds.width, palObj.bounds.height]);
			
			for (var i=0; i<launchPadData.scripts.length; i++)
			{
				// If there's a corresponding .png file, use it as an iconbutton instead of a regular text button
				btnIconFile = new File(File(launchPadData.scripts[i]).fsName.replace(/.jsx(bin)?$/, ".png"));
				if (btnIconFile.exists)
					palObj.scriptBtns[i] = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], btnIconFile, {style:"toolbutton"});
				else if (defBtnIconFile != null)
					palObj.scriptBtns[i] = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], defBtnIconFile, {style:"toolbutton"});
				else
					palObj.scriptBtns[i] = palObj.btnGroup.add("button", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], launchPadData.scripts[i].name.replace(/.jsx$/, "").replace(/%20/g, " "));
				palObj.scriptBtns[i].scriptFile = launchPadData.scripts[i].fsName;		// Store file name with button (sneaky that JavaScript is)
				palObj.scriptBtns[i].helpTip = File(launchPadData.scripts[i]).name.replace(/.jsx(bin)?$/, "").replace(/%20/g, " ") + "\n\n(" + launchPadData.scripts[i].fsName + ")";
				palObj.scriptBtns[i].onClick = function()
				{
					var scriptFile = new File(this.scriptFile);
					if (scriptFile.exists)
					{
						scriptFile.open("r");
						var scriptContent = scriptFile.read();
						scriptFile.close();
						eval(scriptContent);
						//aftereffects.executeScript(scriptContent);
						//$.evalFile(scriptFile);
					}
					else
						alert(launchPadData.strErrCantLaunchScript.replace(/%s/, this.scriptFile.fsName), launchPadData.scriptName);
				}
				
				leftEdge += (btnSize + 5);
			}
			
			// Add the settings and help buttons
			var settingsBtnIconFile = new File(launchPadData.thisScriptsFolder.fsName + "/Launch Pad_settings.png");
			if (settingsBtnIconFile.exists)
				palObj.settingsBtn = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize/2], settingsBtnIconFile, {style:"toolbutton"});
			else
				palObj.settingsBtn = palObj.btnGroup.add("button", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize/2], launchPadData.strSettings);
			palObj.settingsBtn.helpTip = launchPadData.strSettingsTip;
			palObj.settingsBtn.onClick = function ()
			{
				// Get the scripts in the selected scripts folder
				var scriptsFolder = Folder.selectDialog(launchPadData.strSelScriptsFolder, Folder(launchPadData.scriptsFolder));
				if ((scriptsFolder != null) && scriptsFolder.exists)
				{
					launchPadData.scriptsFolder = scriptsFolder;
					// Get all scripts in the selected folder, but not this one, cuz that would be weird :-)
					launchPadData.scripts = scriptsFolder.getFiles(launchPad_filterJSXFiles);
					
					// Remember the scripts folder for the next session
					app.settings.saveSetting("Adobe", "launchPad_scriptsFolder", launchPadData.scriptsFolder.fsName);
					
					// Refresh the palette
					launchPad_rebuildButtons(launchPadPal);
					launchPad_doResizePanel();
					
					// Refreshing the panel's buttons while it's open is not working as expected right now, so it's safer to reopen the panel/palette.
					//alert(launchPadData.strRefreshPanel, launchPadData.strAboutTitle);
				}
			}
			
			var helpBtnIconFile = new File(launchPadData.thisScriptsFolder.fsName + "/Launch Pad_help.png");
			if (helpBtnIconFile.exists)
				palObj.helpBtn = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge+btnSize/2, leftEdge+btnSize, topEdge+btnSize], helpBtnIconFile, {style:"toolbutton"});
			else
				palObj.helpBtn = palObj.btnGroup.add("button", [leftEdge, topEdge+btnSize/2, leftEdge+btnSize, topEdge+btnSize], launchPadData.strHelp);
			palObj.helpBtn.helpTip = launchPadData.strHelpTip;
			palObj.helpBtn.onClick = function () {alert(launchPadData.strAbout, launchPadData.strAboutTitle);}
		}
		
		
		// launchPad_doResizePanel()
		// Callback function for laying out the buttons in the panel
		function launchPad_doResizePanel()
		{
			var btnSize = launchPadData.btnSize;
			var btnOffset = btnSize + 5;
			var maxRightEdge = launchPadPal.size.width - btnSize;
			var leftEdge = 5;
			var topEdge = 5;
			
			// Reset the background group container's bounds
			launchPadPal.btnGroup.bounds = [0, 0, launchPadPal.size.width, launchPadPal.size.height];
			
			// Reset each button's layer bounds
			for (var i=0; i<launchPadData.scripts.length; i++)
			{
				launchPadPal.scriptBtns[i].bounds = [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize];
				
				leftEdge += btnOffset;
				
				// Create a new row if no more columns available in the current row of buttons
				if (leftEdge > maxRightEdge)
				{
					leftEdge = 5;
					topEdge += btnOffset;
				}
			}
			
			// The settings and help buttons go into the next "slot"
			launchPadPal.settingsBtn.bounds = [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize/2];
			launchPadPal.helpBtn.bounds = [leftEdge, topEdge+btnSize/2, leftEdge+btnSize, topEdge+btnSize];
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 9)
		{
			alert(launchPadData.strErrMinAE90, launchPadData.scriptName);
			return;
		}
		else
		{
			// Keep track of this script's folder so we know where to find the icons used by the script
			launchPadData.thisScriptsFolder = new Folder((new File($.fileName)).path);
			
			// Use the last defined script folder, or ask the user for one (if not previously defined)
			launchPadData.scripts = new Array();
			if (app.settings.haveSetting("Adobe", "launchPad_scriptsFolder"))
			{
				launchPadData.scriptsFolder = new Folder(app.settings.getSetting("Adobe", "launchPad_scriptsFolder").toString());
				if ((launchPadData.scriptsFolder != null) && launchPadData.scriptsFolder.exists)
					launchPadData.scripts = launchPadData.scriptsFolder.getFiles(launchPad_filterJSXFiles);
			}
			else
			{
				launchPadData.scriptsFolder = Folder.selectDialog(launchPadData.strSelScriptsFolder, new Folder(Folder.startup.fsName + "/Scripts/"));
				if ((launchPadData.scriptsFolder != null) && launchPadData.scriptsFolder.exists)
				{
					launchPadData.scripts = launchPadData.scriptsFolder.getFiles(launchPad_filterJSXFiles);
					
					// Remember the scripts folder for the next session
					app.settings.saveSetting("Adobe", "launchPad_scriptsFolder", launchPadData.scriptsFolder.fsName);
				}
			}
			
			// Build and show the UI
			var launchPadPal = launchPad_buildUI(thisObj);
			if (launchPadPal != null)
			{
				if (launchPadPal instanceof Window)
				{
					// Center the palette
					launchPadPal.center();
					
					// Show the UI
					launchPadPal.show();
				}
				else
					launchPad_doResizePanel();
			}
		}
	}
	
	
	LaunchPad(this);
}