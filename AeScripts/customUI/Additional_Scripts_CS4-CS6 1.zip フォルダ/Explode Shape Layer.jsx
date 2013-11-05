{
	// Explode Shape Layer.jsx
	// Copyright (c) 2011-2012 Adobe Systems, Incorporated. All rights reserved.
	// 
	// The unofficial script for separating multiple shapes in a single shape 
	// layer into separate shape layers for Adobe(R) After Effects(R) 
	// CS5 or later. Use at your own risk. Brought to you by Jeff of the
	// After Effects crew.
	// 
	// Notes:
	// The exploded shape layers will appear above the selected shape 
	// layer in the order they appear as shape groups. Each shape group 
	// will use the original shape layer name, with the shape group name 
	// appended to it. The original shape layer will be muted.
	
	
	function ExplodeShapeLayer()
	{
		var explodeShapeLayerData = new Object();
		explodeShapeLayerData.scriptName = "Explode Shape Layer";
		explodeShapeLayerData.version = "1.0";
		
		explodeShapeLayerData.strAboutTitle = "About " + explodeShapeLayerData.scriptName;
		explodeShapeLayerData.strAbout = explodeShapeLayerData.scriptName + " " + explodeShapeLayerData.version + "\n" +
			"Copyright (c) 2011-2012 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"The unofficial script for separating multiple shapes in a single shape layer into separate shape layers for Adobe(R) After Effects(R) CS5 or later. Use at your own risk. Brought to you by Jeff of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"The exploded shape layers will appear above the selected shape layer in the order they appear as shape groups. Each shape group will use the original shape layer name, with the shape group name appended to it. The original shape layer will be muted.";
		explodeShapeLayerData.strHelp = "?";
		
		explodeShapeLayerData.strErrNoCompSel = "Select or open a composition, then try again.";
		explodeShapeLayerData.strErrNoShapeLayerSel = "Select a single shape layer, then try again.";
		explodeShapeLayerData.strErrFAIL = "Could not explode shape layer.";
		explodeShapeLayerData.strErrMinAE100 = "This script requires Adobe After Effects CS5 or later.";
		
		////
		var scriptName = "Explode Shape Layer";
		
		var comp = app.project.activeItem;
		if ((comp == null) || !(comp instanceof CompItem)) {
			alert(explodeShapeLayerData.strErrNoCompSel, explodeShapeLayerData.scriptName);
			return;
		}
		
		if (comp.selectedLayers.length != 1) {
			alert(explodeShapeLayerData.strErrNoShapeLayerSel, explodeShapeLayerData.scriptName);
			return;
		}
		var shapeLayer = comp.selectedLayers[0];
		if (!(shapeLayer instanceof ShapeLayer)) {
			alert(explodeShapeLayerData.strErrNoShapeLayerSel, explodeShapeLayerData.scriptName);
			return;
		}

		var rootGroup = shapeLayer.property("ADBE Root Vectors Group");
		var dupes = rootGroup.numProperties;


		app.beginUndoGroup(explodeShapeLayerData.scriptName);

		try {
			for (var i=1; i<=dupes; i++) {
				var dupeLayer = shapeLayer.duplicate();
				dupeLayer.moveBefore(shapeLayer);
				dupeLayer.name = shapeLayer.name + " - " + dupeLayer.property("ADBE Root Vectors Group").property(i).name;
				
				// delete all but the current subgroup
				for (var j=dupes; j>i; j--) {
					dupeLayer.property("ADBE Root Vectors Group").property(j).remove();
				}
				for (var j=i-1; j>=1; j--) {
					dupeLayer.property("ADBE Root Vectors Group").property(j).remove();
				}
			}
			
			shapeLayer.enabled = false;
		}
		catch (e) {
			alert(explodeShapeLayerData.strErrFAIL + " - " + e.toString());
		}

		app.endUndoGroup();
	}

	ExplodeShapeLayer();
}
