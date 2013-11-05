// Copyright 2012.  Adobe Systems, Incorporated.  All rights reserved.
// The ScriptListener output can be turned on and off without having to uninstall.
// This one turns it off.

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// in case we double clicked the file
app.bringToFront();

var listenerID = stringIDToTypeID("AdobeScriptListener ScriptListener");
var keyLogID = charIDToTypeID('Log ');
var d = new ActionDescriptor;
d.putBoolean(keyLogID, false);
executeAction(listenerID, d, DialogModes.NO);

