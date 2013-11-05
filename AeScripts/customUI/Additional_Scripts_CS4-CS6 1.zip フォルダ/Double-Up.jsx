{
	// Double-Up.jsx
	// Copyright (c) 2009 Adobe Systems, Incorporated. All rights reserved.
	// 
	// The unofficial script for doubling and arranging the layers in a 
	// composition for comparison purposes for Adobe(R) After Effects(R) 
	// CS4 or later. Use at your own risk. Brought to you by Jeff and DaveS 
	// of the After Effects crew.
	// 
	// Notes:
	// This script works best when it is initially applied to a footage layer 
	// that's the same size as and centered within its composition. 
	// Re-running the script allows you to double-up the previous layers.
	
	
	function DoubleUp()
	{
		var doubleUpData = new Object();
		doubleUpData.scriptName = "Double-Up";
		doubleUpData.version = "1.0";
		
		doubleUpData.strAboutTitle = "About " + doubleUpData.scriptName;
		doubleUpData.strAbout = doubleUpData.scriptName + " " + doubleUpData.version + "\n" +
			"Copyright (c) 2009 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"The unofficial script for doubling and arranging the layers in a composition for comparison purposes for Adobe(R) After Effects(R) CS4 or later. Use at your own risk. Brought to you by Jeff and DaveS of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"This script works best when it is initially applied to a footage layer that's the same size as and centered within its composition. Re-running the script allows you to double-up the previous layers.";
		doubleUpData.strHelp = "?";
		doubleUpData.strErrNoCompSel = "Select or open a composition, then try again.";
		doubleUpData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
		
		doubleUpData.favorLongerDim = 0;	// set to 1 to lay side-by-side along longest dimension (width or height)
		
		var comp = app.project.activeItem;
		if ((comp == null) || !(comp instanceof CompItem)) {
			alert(doubleUpData.strErrNoCompSel, doubleUpData.scriptName);
			return;
		}
		
		var selLayers = new Array();
		for (var i=1; i<=comp.numLayers; i++)
			selLayers[selLayers.length] = comp.layer(i);
		
		// first layer is the first selected layer; this controls width and height
		var firstLayer = selLayers[0];
		
		// revised comp settings
		var widthIsLonger = (comp.width > comp.height);
		var xOffset = (doubleUpData.favorLongerDim == widthIsLonger) ? comp.width : 0;
		var yOffset = (doubleUpData.favorLongerDim == widthIsLonger) ? 0 : comp.height;
		
		app.beginUndoGroup(doubleUpData.scriptName);
		
		comp.width = comp.width * ((doubleUpData.favorLongerDim == widthIsLonger) ? 2 : 1);
		comp.height = comp.height * ((doubleUpData.favorLongerDim == widthIsLonger) ? 1 : 2);
		
		for (var i=0; i<selLayers.length; i++) {
			var newLayer = selLayers[i].duplicate();
			newLayer.name = selLayers[i].name;
			newLayer.moveToEnd();
			newLayer.position.setValue([selLayers[i].position.value[0] + xOffset, selLayers[i].position.value[1] + yOffset]);
		}
		
		app.endUndoGroup();
	}
	
	DoubleUp();
}