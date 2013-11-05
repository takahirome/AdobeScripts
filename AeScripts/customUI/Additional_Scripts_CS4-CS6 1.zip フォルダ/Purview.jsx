{
	// Purview.jsx
	// Copyright (c) 2010 Adobe Systems, Incorporated. All rights reserved.
	// 
	// A script for adjusting the number of frames to RAM Preview when 
	// using the Alt/Option+Numpad 0 keyboard shortcut or Alt/Option-clicking 
	// action on the RAM Preview button, for Adobe(R) After Effects(R) CS5
	// or later. Use at your own risk. Brought to you by Jeff and DaveS of the 
	// After Effects crew.
	// 
	// Notes:
	// You can use this script launcher as a dockable panel by 
	// placing it in a ScriptUI Panels subfolder of the Scripts 
	// folder, and then choosing the Purview.jsx script from 
	// the Window menu.
	
	
	function Purview(thisObj)
	{
		var purviewData = new Object();
		purviewData.scriptName = "Purview";
		purviewData.version = "1.0";
		
		purviewData.strHelp = "?";
		purviewData.strFrames = "Frames (relative to current time):";
		purviewData.strAboutTitle = "About " + purviewData.scriptName;
		purviewData.strAbout = purviewData.scriptName + " " + purviewData.version + "\n" +
			"Copyright (c) 2007-2008 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"A script for adjusting the number of frames to RAM Preview when using the Alt/Option+Numpad 0 keyboard shortcut or Alt/Option-clicking action on the RAM Preview button, for Adobe(R) After Effects(R) CS5 or later. Use at your own risk. Brought to you by Jeff and DaveS of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"You can use this script launcher as a dockable panel by placing it in a ScriptUI Panels subfolder of the Scripts folder, and then choosing the Purview.jsx script from the Window menu.";
		purviewData.strErrSecurityPrefNotEnabled = "Please enable the \"Allow Scripts to Write Files and Access Network\" option in the General Preferences dialog box, and run this script again.";
		purviewData.strErrMinAE100 = "This script requires Adobe After Effects CS5 or later.";
		
		
		// purview_buildUI()
		// Function for creating the user interface
		function purview_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", purviewData.scriptName, undefined, {resizeable:true});
			if (pal != null)
			{
				var res = 
				"""group { 
					orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:10, margins:[0,0,0,0], 
					header: Group { 
						alignment:['fill','top'], 
						pv: StaticText { text:'""" + purviewData.strFrames+ """', alignment:['fill','bottom'] }, 
						helpBtn: Button { text:'""" + purviewData.strHelp + """', alignment:['right','center'], preferredSize:[25,20] }, 
					}, 
					pvSlider: Group { 
						alignment:['fill','top'], 
						sld: Slider { value:-5, minvalue:-60, maxvalue:60, alignment:['fill','center'], preferredSize:[-1,20] }, 
						val: EditText { text:'-5', characters:4, alignment:['right','center'] }, 
					}, 
				}""";
				
				pal.margins = [10,10,10,10];
				pal.grp = pal.add(res);
				
				if (app.preferences.havePref("Time Palette Settings", "Preview N Frames"))
				{
					var val = parseInt(app.preferences.getPrefAsLong("Time Palette Settings", "Preview N Frames"));
					pal.grp.pvSlider.sld.value = val;
					pal.grp.pvSlider.val.text = val.toString();
				}
				
				pal.grp.pvSlider.sld.onChange = pal.grp.pvSlider.sld.onChanging = function ()
				{
					var newVal = parseInt(this.value);
					this.value = newVal;
					this.parent.val.text = newVal.toString();
					
					app.preferences.savePrefAsLong("Time Palette Settings", "Preview N Frames", newVal);
					app.preferences.saveToDisk();
					app.preferences.reload();
				}
				pal.grp.pvSlider.val.onChange = function ()
				{
					var newVal = this.text;
					if (isNaN(parseInt(newVal)))
						newVal = -5;
					else {
						newVal = parseInt(newVal);
						if (newVal < -60)
							newVal = -60;
						else if (newVal > 60)
							newVal = 60;
					}
					this.text = newVal.toString();
					this.parent.sld.value = newVal;
					
					app.preferences.savePrefAsLong("Time Palette Settings", "Preview N Frames", parseInt(newVal));
					app.preferences.saveToDisk();
					app.preferences.reload();
				}
				
				pal.grp.header.helpBtn.onClick = function () {alert(purviewData.strAbout, purviewData.strAboutTitle);}
				
				pal.layout.layout(true);
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
			}
			
			return pal;
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 10)
		{
			alert(purviewData.strErrMinAE100, purviewData.scriptName);
			return;
		}
		else
		{
			// Check that we'll be able to save to disk
			if (app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1)
			{
				alert(purviewData.strErrSecurityPrefNotEnabled, purviewData.scriptName);
				return;
			}
			
			var pvPal = purview_buildUI(thisObj);
			if (pvPal != null)
			{
				if (pvPal instanceof Window)
				{
					pvPal.center();
					pvPal.show();
				}
				else
					pvPal.layout.layout(true);
			}
		}
	}
	
	Purview(this);
}