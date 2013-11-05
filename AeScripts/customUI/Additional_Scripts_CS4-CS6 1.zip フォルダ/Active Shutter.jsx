{
	// Active Shutter.jsx
	// Copyright (c) 2007-2008 Adobe Systems, Incorporated. All rights reserved.
	// 
	// A script for interactively adjusting motion blur (Shutter Angle 
	// and Shutter Phase) settings for the current composition, 
	// for Adobe(R) After Effects(R) CS4 or later. Use at your own 
	// risk. Brought to you by Jeff of the After Effects crew.
	// 
	// Notes:
	// This script allows you to adjust the Shutter Angle and 
	// Shutter Phase settings for the current composition, 
	// without having to reopen the Composition Settings dialog 
	// box and switch to the Advanced tab each time. You can 
	// also use the "Centered motion blur" option to produce 
	// a blur with half the motion before and half after the 
	// current frame in time.
	// 
	// As a convenience, you can scrub through time by 
	// adjusting the CTI slider. However, if the Composition 
	// viewer turns white, close the composition in the 
	// viewer and turn off OpenGL in the Previews 
	// Preferences dialog box.
	// 
	// You can use this script launcher as a dockable panel by 
	// placing it in a ScriptUI Panels subfolder of the Scripts 
	// folder, and then choosing the Active Shutter.jsx script from 
	// the Window menu.
	
	
	function ActiveShutter(thisObj)
	{
		var activeShutterData = new Object();
		activeShutterData.scriptName = "Active Shutter";
		activeShutterData.version = "1.1";
		
		activeShutterData.strHelp = "?";
		activeShutterData.strShutterAngle = "Shutter Angle:";
		activeShutterData.strShutterPhase = "Shutter Phase:";
		activeShutterData.strCenteredBlur = "Centered motion blur (phase = -1/2 * angle)";
		activeShutterData.strCTI = "CTI:";
		activeShutterData.strAboutTitle = "About " + activeShutterData.scriptName;
		activeShutterData.strAbout = activeShutterData.scriptName + " " + activeShutterData.version + "\n" +
			"Copyright (c) 2007-2008 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"A script for interactively adjusting motion blur (Shutter Angle and Shutter Phase) settings for the current composition, for Adobe(R) After Effects(R) CS4 or later. Use at your own risk. Brought to you by Jeff of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"This script allows you to adjust the Shutter Angle and Shutter Phase settings for the current composition, without having to reopen the Composition Settings dialog box and switch to the Advanced tab each time. You can also use the \"Centered motion blur\" option to produce a blur with half the motion before and half after the current frame in time.\n" +
			"\n" +
			"As a convenience, you can scrub through time by adjusting the CTI slider. However, if the Composition viewer turns white, close the composition in the viewer and turn off OpenGL in the Previews Preferences dialog box.\n" +
			"\n" +
			"You can use this script launcher as a dockable panel by placing it in a ScriptUI Panels subfolder of the Scripts folder, and then choosing the Active Shutter.jsx script from the Window menu.";
		activeShutterData.strErrNoProj = "Create or open a project and a composition in it, and try again";
		activeShutterData.strErrNoActiveComp = "Select or open a single composition, and try again.";
		activeShutterData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
		
		
		// activeShutter_buildUI()
		// Function for creating the user interface
		function activeShutter_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", activeShutterData.scriptName, undefined, {resizeable:true});
			if (pal != null)
			{
				var res = 
				"""group { 
					orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], 
					shutterAngle: Group { 
						alignment:['fill','top'], 
						lbl: StaticText { text:'""" + activeShutterData.strShutterAngle + """', alignment:['left','center'] }, 
						sld: Slider { value:180, minvalue:0, maxvalue:720, alignment:['fill','center'], preferredSize:[-1,20] }, 
						val: EditText { text:'?', characters:4, alignment:['right','center'] }, 
					}, 
					shutterPhase: Group { 
						alignment:['fill','top'], 
						lbl: StaticText { text:'""" + activeShutterData.strShutterPhase + """', alignment:['left','center'] }, 
						sld: Slider { value:0, minvalue:-360, maxvalue:360, alignment:['fill','center'], preferredSize:[-1,20] }, 
						val: EditText { text:'?', characters:4, alignment:['right','center'] }, 
					}, 
					centeredBlur: Checkbox { text:'""" + activeShutterData.strCenteredBlur + """' }, 
					cti: Group { 
						alignment:['fill','top'], margins:[0,10,0,0], 
						lbl: StaticText { text:'""" + activeShutterData.strCTI + """', alignment:['left','center'] }, 
						sld: Slider { value:0, minvalue:0, maxvalue:100, alignment:['fill','center'], preferredSize:[-1,20] }, 
					}, 
					statusBar: Group { 
						orientation:'row', alignment:['fill','bottom'], 
						msg: StaticText { text:'', alignment:['fill','center'] }, 
						helpBtn: Button { text:'""" + activeShutterData.strHelp + """', alignment:['right','bottom'], preferredSize:[25,20] }, 
					}, 
				}""";
				
				pal.margins = [10,10,10,10];
				pal.grp = pal.add(res);
				
				pal.grp.shutterAngle.sld.onChanging = function ()
				{
					if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
						return;
					
					var newVal = this.value;
					this.parent.val.text = parseInt(newVal).toString();
					app.project.activeItem.shutterAngle = parseInt(newVal);
					
					if (this.parent.parent.centeredBlur.value) {
						newVal = parseInt(-0.5 * newVal);
						if (newVal < -360)
							newVal = -360;
						else if (newVal > 360)
							newVal = 360;
						this.parent.parent.shutterPhase.sld.value = newVal;
						this.parent.parent.shutterPhase.val.text = newVal.toString();
						app.project.activeItem.shutterPhase = newVal;
					}
					this.parent.parent.statusBar.msg.text = "";
				}
				pal.grp.shutterAngle.val.onChange = function ()
				{
					if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
						return;
					
					var newVal = this.text;
					if (isNaN(parseInt(newVal)))
						newVal = 0;
					else {
						newVal = parseInt(newVal);
						if (newVal < 0)
							newVal = 0;
						else if (newVal > 720)
							newVal = 720;
					}
					this.text = newVal.toString();
					this.parent.sld.value = newVal;
					app.project.activeItem.shutterAngle = newVal;
					
					if (this.parent.parent.centeredBlur.value) {
						newVal = parseInt(-0.5 * newVal);
						if (newVal < -360)
							newVal = -360;
						else if (newVal > 360)
							newVal = 360;
						this.parent.parent.shutterPhase.sld.value = newVal;
						this.parent.parent.shutterPhase.val.text = newVal.toString();
						app.project.activeItem.shutterPhase = newVal;
					}
					this.parent.parent.statusBar.msg.text = "";
				}
				
				pal.grp.shutterPhase.sld.onChanging = function ()
				{
					if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
						return;
					
					var newVal = this.value;
					this.parent.val.text = parseInt(newVal).toString();
					app.project.activeItem.shutterPhase = parseInt(newVal);
					
					if (this.parent.parent.centeredBlur.value) {
						newVal = parseInt(-2.0 * newVal);
						if (newVal < 0)
							newVal = 0;
						else if (newVal > 720)
							newVal = 720;
						this.parent.parent.shutterAngle.sld.value = newVal;
						this.parent.parent.shutterAngle.val.text = newVal.toString();
						app.project.activeItem.shutterAngle = newVal;
					}
					this.parent.parent.statusBar.msg.text = "";
				}
				pal.grp.shutterPhase.val.onChange = function ()
				{
					if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
						return;
					
					var newVal = this.text;
					if (isNaN(parseInt(newVal)))
						newVal = 0;
					else {
						newVal = parseInt(newVal);
						if (newVal < -360)
							newVal = 360;
						else if (newVal > 360)
							newVal = 360;
					}
					this.text = newVal.toString();
					this.parent.sld.value = newVal;
					app.project.activeItem.shutterPhase = newVal;
					
					if (this.parent.parent.centeredBlur.value) {
						newVal = parseInt(-2.0 * newVal);
						if (newVal < 0)
							newVal = 0;
						else if (newVal > 720)
							newVal = 720;
						this.parent.parent.shutterAngle.sld.value = newVal;
						this.parent.parent.shutterAngle.val.text = newVal.toString();
						app.project.activeItem.shutterAngle = newVal;
					}
					this.parent.parent.statusBar.msg.text = "";
				}
				
				pal.grp.centeredBlur.onClick = function ()
				{
					if (this.value) {
						if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
							return;
						
						var newVal = parseInt(-0.5 * this.parent.shutterAngle.sld.value);
						if (newVal < -360)
							newVal = -360
						else if (newVal > 360)
							newVal = 360;
						this.parent.shutterPhase.sld.value = newVal;
						this.parent.shutterPhase.val.text = newVal.toString();
						app.project.activeItem.shutterPhase = newVal;
						this.parent.statusBar.msg.text = "";
					}
				}
				
				pal.grp.cti.sld.onChanging = function ()
				{
					if (!activeShutter_haveValidSelection())	// Ensure we have a valid selection (active comp)
						return;
					
					app.project.activeItem.time = this.value / 100.0 * (app.project.activeItem.duration - app.project.activeItem.frameDuration);
					this.parent.parent.statusBar.msg.text = "";
				}
				
				pal.grp.statusBar.helpBtn.onClick = function () {alert(activeShutterData.strAbout, activeShutterData.strAboutTitle);}
				
				// If available, use the current comp's defaults
				if ((app.project != null) && (app.project.activeItem != null) && (app.project.activeItem instanceof CompItem)) {
					var comp = app.project.activeItem;
					
					pal.grp.shutterAngle.sld.value = comp.shutterAngle;
					pal.grp.shutterAngle.val.text = comp.shutterAngle.toString();
					pal.grp.shutterPhase.sld.value = comp.shutterPhase;
					pal.grp.shutterPhase.val.text = comp.shutterPhase.toString();
					pal.grp.cti.sld.value = comp.time / (comp.duration-comp.frameDuration) * 100.0;
				}
				
				pal.layout.layout(true);
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
			}
			
			return pal;
		}
		
		
		// activeShutter_haveValidSelection()
		// Function for determining if there's a current (active) composition.
		function activeShutter_haveValidSelection()
		{
			if (app.project == null)
			{
				asPal.grp.statusBar.msg.text = activeShutterData.strErrNoProj;
				return false;
			}
			if ((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem)))
			{
				asPal.grp.statusBar.msg.text = activeShutterData.strErrNoActiveComp;
				return false;
			}
			
			return true;
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 9)
		{
			alert(activeShutterData.strErrMinAE90, activeShutterData.scriptName);
			return;
		}
		else
		{
			var asPal = activeShutter_buildUI(thisObj);
			if (asPal != null)
			{
				if (asPal instanceof Window)
				{
					asPal.center();
					asPal.show();
				}
				else
					asPal.layout.layout(true);
			}
		}
	}
	
	ActiveShutter(this);
}