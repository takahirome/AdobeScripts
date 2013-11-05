{
	// KeyEd Up.jsx
	// Copyright (c) 2007-2012 Adobe Systems, Incorporated. All rights reserved.
	// 
	// The unofficial keyboard shortcuts editor for Adobe(R) 
	// After Effects(R) CS4 or later. Use at your own risk.
	// Brought to you by Jeff and Chad of the After Effects crew.
	// 
	// Notes:
	// The script will attempt to locate the shortcuts file 
	// automatically, but might need your assistance. If so, help 
	// it find its way.
	// 
	// After you change a shortcut, be sure to click Update Shortcut. 
	// Changes are not saved automatically, especially if you click 
	// another command or shortcut or choose a different category. 
	// You have been warned! When done making changes, click OK 
	// to update the shortcuts file. The existing shortcuts file 
	// will be renamed with a .bak file name extension, 'cuz we care. 
	// Also, you can save the current shortcuts under a different 
	// file name (to back up or create variations for different uses) 
	// or load a previously saved shortcuts file (such as one your 
	// buddy in the After Effects community sent to you). Although 
	// you can load a different file or save under a different 
	// name, clicking OK will always update the shortcuts file 
	// opened when you ran the script.
	// 
	// In other "puppy ran away"/"ice cream melted" type of news, 
	// there is no way to change the number of shortcuts per 
	// command (other than setting them to <unassigned>) or make 
	// your custom shortcuts appear in the tooltips in the user 
	// interface. Hey, what do you want for a freebie? :-)
	
	
	function KeyEd_Up()
	{
		var keyedUpData = new Object();
		keyedUpData.scriptName = "KeyEd Up";
		keyedUpData.version = "1.3";
		
		keyedUpData.onWindows = ($.os.indexOf("Windows") != -1);
		keyedUpData.aeVersion = parseFloat(app.version);
		
		keyedUpData.minShortcutsFileVer = 47;		// major_version = 47 for After Effects 7.0
		keyedUpData.loadedShortcutsFileVer = 0;	// major_version found in the shortcuts file
		keyedUpData.savedShortcutsFileVer = 50;	// major_version to save in the shortcuts file (50 for After Effects CS3)
		if (keyedUpData.aeVersion >= 9)
			keyedUpData.savedShortcutsFileVer = 56;	// major_version to save in the shortcuts file (54 for After Effects CS4)
		if (keyedUpData.aeVersion >= 10)
			keyedUpData.savedShortcutsFileVer = 62;	// major_version to save in the shortcuts file (62 for After Effects CS5)
		keyedUpData.isModified = false;				// true, when loaded shortcuts have been modified
		keyedUpData.strCategory = "Category:";
		keyedUpData.strCommands = "Commands:";
		keyedUpData.strShortcuts = "Shortcuts:";
		if (keyedUpData.onWindows)
		{
			keyedUpData.strCtrl = "Ctrl";
			keyedUpData.strAlt = "Alt";
			keyedUpData.strMacCtrl = "MacCtrl";
		}
		else
		{
			keyedUpData.strCtrl = "Cmd";
			keyedUpData.strAlt = "Option";
			keyedUpData.strMacCtrl = "Ctrl";
		}
		keyedUpData.strShift = "Shift";
		keyedUpData.strPlus = "+";
		keyedUpData.strUnicodePrefix = "Ux";
		keyedUpData.strUnassigned = "<unassigned>";
		keyedUpData.strKeyPad = "KeyPad";
		keyedUpData.strConflicts = "Show Usage";
		keyedUpData.strUpdate = "Update Shortcut";
		keyedUpData.strMerge = "Merge...";
		keyedUpData.strLoad = "Load...";
		keyedUpData.strSaveAs = "Save As...";
		keyedUpData.strSaveHTML = "Save HTML...";
		keyedUpData.strBatchReplace = "Batch Replace...";
		keyedUpData.strBatchReplaceTitle = keyedUpData.scriptName + ": Batch Replace";
		keyedUpData.strFind = "Find Key:";
		keyedUpData.strReplace = "Replace With:";
		keyedUpData.strReplaceAll = "Replace All";
		keyedUpData.strOK = "OK";
		keyedUpData.strCancel = "Cancel";
		keyedUpData.strHelp = "?";
		keyedUpData.strAboutTitle = "About " + keyedUpData.scriptName;
		keyedUpData.strAbout = keyedUpData.scriptName + " " + keyedUpData.version + "\n" +
			"Copyright (c) 2007-2012 Adobe Systems, Incorporated. All rights reserved.\n" +
			"\n" +
			"The unofficial keyboard shortcuts editor for Adobe(R) After Effects(R) CS4 or later. Use at your own risk. Brought to you by Jeff and Chad of the After Effects crew.\n" +
			"\n" +
			"Notes:\n" +
			"The script will attempt to locate the shortcuts file automatically, but might need your assistance. If so, help it find its way.\n" +
			"\n" +
			"After you change a shortcut, be sure to click Update Shortcut. Changes are not saved automatically, especially if you click another command or shortcut or choose a different category. You have been warned! When done making changes, click OK to update the shortcuts file. The existing shortcuts file will be renamed with a .bak file name extension, 'cuz we care. Also, you can save the current shortcuts under a different file name (to back up or create variations for different uses) or load a previously saved shortcuts file (such as one your buddy in the After Effects community sent to you). Although you can load a different file or save under a different name, clicking OK will always update the shortcuts file opened when you ran the script.\n" +
			"\n" +
			"In other \"puppy ran away\"/\"ice cream melted\" type of news, there is no way to change the number of shortcuts per command (other than setting them to <unassigned>) or make your custom shortcuts appear in the tooltips in the user interface. Hey, what do you want for a freebie? :-)";
		keyedUpData.strConflictsIntro = "The selected key sequence (%s) is also used by the following command(s):";
		keyedUpData.strConflictsNone = "No other commands use the selected key sequence (%s).";
		keyedUpData.strSaveChanges = "Save the changes you made to the current shortcuts?";
		keyedUpData.strSelectShortcutsToMerge = "Locate the shortcuts file to merge with the current shortcuts";
		keyedUpData.strSelectShortcutsToLoad = "Locate the shortcuts file to load";
		keyedUpData.strSaveShortcutsAs = "Save current shortcuts as";
		keyedUpData.strSaveAsHTML = "Save current shortcuts as HTML page";
		keyedUpData.strOverwriteFile = "Overwrite existing file?";
		keyedUpData.strRestartAE = "Shortcuts have been updated. Please restart After Effects for these changes to take effect.";
		keyedUpData.strErrSecurityPrefNotEnabled = "Please enable the \"Allow Scripts to Write Files and Access Network\" option in the General Preferences dialog box, and run this script again.";
		keyedUpData.strErrCantBackupShortcutsFile = "Could not back up your existing shortcuts file '%s'."
		keyedUpData.strErrCantMergeShortcutsFile = "Could not merge all of the shortcuts from the selected shortcuts file '%s'.";
		keyedUpData.strErrCantLoadShortcutsFile = "Could not load the selected shortcuts file '%s'. Restoring the current shortcuts.";
		keyedUpData.strErrMinShortcutsFileVer = "The shortcuts file was saved for an older version of After Effects, and is not supported by this script.";
		keyedUpData.strErrMissingShortcutsFile = "Could not find the shortcuts file at '%s'. Maybe it hasn't been created yet?\nMaybe try restarting After Effects, and running this script again.";
		keyedUpData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
		
		// Associative array (dictionary) of category/command ids and their user-friendly names
		keyedUpData.cmdNames =
		{
			"AE_TopLevelWindow": ["General Panel/Window",
			{
				"SelectNextTab": "Select Next Panel in Frame",
				"SelectPrevTab": "Select Previous Panel in Frame",
				"ToggleTabPanelMaximize": "Maximize Panel",
				"ZoomWindowMega": "Maximize App Window",
				"ZoomWindowMegaMainMonitor": "Maximize App Window on Primary Monitor",
			}],
			"CCompCloneCmd": ["Clone Tool Presets",
			{
				"CloneSelectPreset1": "Preset 1",
				"CloneSelectPreset2": "Preset 2",
				"CloneSelectPreset3": "Preset 3",
				"CloneSelectPreset4": "Preset 4",
				"CloneSelectPreset5": "Preset 5",
			}],
			"CCompCmd": ["Timeline Layers",
			{
				"AddLayerMarkerWithDialog": "Add Layer Marker Using Dialog Box",
				"AddMarker": "Add Layer Marker",
				"Clear": "Clear (Delete)",
				"ClearMask": "~~~ ClearMask - (Alt+Delete)(Alt+FwdDel)",
				"OpenSource": "Open Layer Source in Layer Panel",
				"PasteAlt": "Paste Layers at Current Time",
				"ReverseLayer": "Reverse Layer",
				"SelectNext": "Select Next Layer",
				"SelectNextAdd": "Extend Selection to Next Layer",
				"SelectPrevious": "Select Previous Layer",
				"SelectPreviousAdd": "Extend Selection to Previous Layer",
				"SetWorkAreaEnd": "Set Work Area End",
				"SetWorkAreaStart": "Set Work Area Start",
				"SetWorkAreaToSelection": "Set Work Area to Selected Layers",
				"StretchLayerToFit": "Fit Layer to Comp",
				"StretchLayerToFitHorizontal": "Fit Layer to Comp Width",
				"StretchLayerToFitVertical": "Fit Layer to Comp Height",
			}],
			"CCompCompCmd": ["Timeline Layer Properties",
			{
				"CompOpenCompStuff": "Open Composition",
				"CompScollSelectedLayerToTop": "Scroll Selected Layer to Top",
				"CompScrollToCurrentTime": "Scroll to Current Time",
				"CompSelectLayer1": "Select Layer by Number: 1",
				"CompSelectLayer2": "Select Layer by Number: 2",
				"CompSelectLayer3": "Select Layer by Number: 3",
				"CompSelectLayer4": "Select Layer by Number: 4",
				"CompSelectLayer5": "Select Layer by Number: 5",
				"CompSelectLayer6": "Select Layer by Number: 6",
				"CompSelectLayer7": "Select Layer by Number: 7",
				"CompSelectLayer8": "Select Layer by Number: 8",
				"CompSelectLayer9": "Select Layer by Number: 9",
				"CompTimeZoomFrames": "Zoom In to Frame Intervals",
				"CompTimeZoomIn": "Zoom In",
				"CompTimeZoomOut": "Zoom Out",
				"CompToggleEffects": "Show/Hide Effects (Double-Tap: Expressions)",
				"CompToggleEffectsAddState": "Show/Hide Effects (Extend; Double-Tap: Expressions)",
				"CompToggleMaskFeathers": "Show/Hide Mask Feather (Double-Tap)",
				"CompToggleMaskFeathersAddState": "Show/Hide Mask Feather (Extend; Double-Tap)",
				"CompToggleMaskFeathersAddStateNewKF": "Add/Delete Mask Feather Keyframe at Current Time",
				"CompToggleMaskFeathersNewKF": "~~~ CompToggleMaskFeathersNewKF - ()",
				"CompToggleMaskShapes": "Show/Hide Mask Shape (Double-Tap)",
				"CompToggleMaskShapesAddState": "Show/Hide Mask Shape (Extend; Double-Tap)",
				"CompToggleMaskShapesAddStateNewKF": "Add/Delete Mask Shape Keyframe at Current Time",
				"CompToggleMaskShapesNewKF": "~~~ CompToggleMaskShapesNewKF - ()",
				"CompToggleUberAnimatingKeyframes": "Show/Hide Modified Properties (Double-Tap)",
				"CompToggleSelectLayer1": "Toggle Selection of Layer by Number: 1",
				"CompToggleSelectLayer2": "Toggle Selection of Layer by Number: 2",
				"CompToggleSelectLayer3": "Toggle Selection of Layer by Number: 3",
				"CompToggleSelectLayer4": "Toggle Selection of Layer by Number: 4",
				"CompToggleSelectLayer5": "Toggle Selection of Layer by Number: 5",
				"CompToggleSelectLayer6": "Toggle Selection of Layer by Number: 6",
				"CompToggleSelectLayer7": "Toggle Selection of Layer by Number: 7",
				"CompToggleSelectLayer8": "Toggle Selection of Layer by Number: 8",
				"CompToggleSelectLayer9": "Toggle Selection of Layer by Number: 9",
				"CompToggleUberAnimatingKeyframes": "Show/Hide Modified Properties (Double-Tap)",
				"CompToggleUberAnimatingKeyframesAddState": "Show/Hide Modified Properties (Extend; Double-Tap)",
				"CompTwirlAnchorPoint": "Show/Hide Anchor Point or Position of Interest",
				"CompTwirlAnchorPointAddState": "Show/Hide Anchor Point or Position of Interest (Extend)",
				"CompTwirlAnchorPointAddStateNewKF": "Add/Delete Anchor Point or Position of Interest Keyframe at Current Time",
				"CompTwirlAnchorPointNewKF": "~~~ CompTwirlAnchorPointNewKF - ()",
				"CompTwirlAudio": "Show/Hide Audio Levels",
				"CompTwirlAudioAddState": "Show/Hide Audio Levels (Extend)",
				"CompTwirlAudioAddStateNewKF": "Add/Delete Audio Levels Keyframe at Current Time",
				"CompTwirlAudioNewKF": "~~~ CompTwirlAudioNewKF - ()",
				"CompTwirlOpacity": "Show/Hide Opacity",
				"CompTwirlOpacityAddState": "Show/Hide Opacity (Extend)",
				"CompTwirlOpacityAddStateNewKF": "Add/Delete Opacity Keyframe at Current Time",
				"CompTwirlOpacityNewKF": "~~~ CompTwirlOpacityNewKF - ()",
				"CompTwirlPosition": "Show/Hide Position",
				"CompTwirlPositionAddState": "Show/Hide Position (Extend)",
				"CompTwirlPositionAddStateNewKF": "Add/Delete Position Keyframe at Current Time",
				"CompTwirlPositionNewKF": "~~~ CompTwirlPositionNewKF - ()",
				"CompTwirlRotation": "Show/Hide Rotation and Orientation Properties",
				"CompTwirlRotationAddState": "Show/Hide Rotation and Orientation Properties (Extend)",
				"CompTwirlRotationAddStateNewKF": "Add/Delete Rotation or Orientation Keyframe at Current Time",
				"CompTwirlRotationNewKF": "~~~ CompTwirlRotationNewKF - ()",
				"CompTwirlScale": "Show/Hide Scale",
				"CompTwirlScaleAddState": "Show/Hide Scale (Extend)",
				"CompTwirlScaleAddStateNewKF": "Add/Delete Scale Keyframe at Current Time",
				"CompTwirlScaleNewKF": "~~~ CompTwirlScaleNewKF - ()",
				"NextKeyframe": "Go to Next Keyframe",
				"NudgeDown": "Move Layer 1 Screen Pixel Down",
				"NudgeDownMore": "Move Layer 10 Screen Pixels Down",
				"NudgeEarlier": "Shift Layer 1 Frame Earlier",
				"NudgeEarlierMore": "Shift Layer 10 Frames Earlier",
				"NudgeKeyframesEarlier": "Shift Selected Keyframes 1 Frame Earlier",
				"NudgeKeyframesEarlierMore": "Shift Selected Keyframes 10 Frames Earlier",
				"NudgeKeyframesLater": "Shift Selected Keyframes 1 Frame Later",
				"NudgeKeyframesLaterMore": "Shift Selected Keyframes 10 Frames Later",
				"NudgeLater": "Shift Layer 1 Frame Later",
				"NudgeLaterMore": "Shift Layer 10 Frames Later",
				"NudgeLeft": "Move Layer 1 Screen Pixel to the Left",
				"NudgeLeftMore": "Move Layer 10 Screen Pixels to the Left",
				"NudgeRight": "Move Layer 1 Screen Pixel to the Right",
				"NudgeRightMore": "Move Layer 10 Screen Pixels to the Right",
				"NudgeRotCCW": "Rotate Layer 1 Degree Counterclockwise",
				"NudgeRotCCWMore": "Rotate Layer 10 Degrees Counterclockwise",
				"NudgeRotCW": "Rotate Layer 1 Degree Clockwise",
				"NudgeRotCWMore": "Rotate Layer 10 Degrees Clockwise",
				"NudgeScaleLarger": "Scale Layer 1% Larger",
				"NudgeScaleLargerMore": "Scale Layer 10% Larger",
				"NudgeScaleSmaller": "Scale Layer 1% Smaller",
				"NudgeScaleSmallerMore": "Scale Layer 10% Smaller",
				"NudgeUp": "Move Layer 1 Screen Pixel Up",
				"NudgeUpMore": "Move Layer 10 Screen Pixels Up",
				"PrevKeyframe": "Go to Previous Keyframe",
				"SelectAllVisibleKeyframes": "Select All Visible Keyframes and Exposed Properties",
				"TemporalAlignEnd": "Align Selected Layers' In Points to End of Composition",
				"TemporalAlignStart": "Align Selected Layers' In Points to Start of Composition",
				"ToggleGraph": "Show/Hide Graph Editor",
				"ToggleTlwParentColumn": "Show/Hide Parent Column",
				"Twirl": "~~~ Twirl - ()",
				"TwirlExplode": "Show/Hide All of the Selected Layers' Properties",
				"TwirlPreserveSolo": "~~~ TwirlPreserveSolo - (Shift+`)",
				"TwirlPreserveSoloExplode": "~~~ TwirlPreserveSoloExplode - (Ctrl+Shift+`)",
			}],
			"CCompMarkerCmd": ["Markers",
			{
				"CompGotoMarker0": "Go to Composition Marker '0'",
				"CompGotoMarker1": "Go to Composition Marker '1'",
				"CompGotoMarker2": "Go to Composition Marker '2'",
				"CompGotoMarker3": "Go to Composition Marker '3'",
				"CompGotoMarker4": "Go to Composition Marker '4'",
				"CompGotoMarker5": "Go to Composition Marker '5'",
				"CompGotoMarker6": "Go to Composition Marker '6'",
				"CompGotoMarker7": "Go to Composition Marker '7'",
				"CompGotoMarker8": "Go to Composition Marker '8'",
				"CompGotoMarker9": "Go to Composition Marker '9'",
				"CompMarker0": "Create Composition Marker '0'",
				"CompMarker1": "Create Composition Marker '1'",
				"CompMarker2": "Create Composition Marker '2'",
				"CompMarker3": "Create Composition Marker '3'",
				"CompMarker4": "Create Composition Marker '4'",
				"CompMarker5": "Create Composition Marker '5'",
				"CompMarker6": "Create Composition Marker '6'",
				"CompMarker7": "Create Composition Marker '7'",
				"CompMarker8": "Create Composition Marker '8'",
				"CompMarker9": "Create Composition Marker '9'",
			}],
			"CCompPaintCmd": ["Paint Panel",
			{
				"PaintColorResetBW": "Reset Foreground/Background to Black/White",
				"PaintColorSwapFgBg": "Swap Foreground/Background Colors",
				"PaintSetFlow10": "Set Paint Flow to  10%",
				"PaintSetFlow100": "Set Paint Flow to 100%",
				"PaintSetFlow20": "Set Paint Flow to  20%",
				"PaintSetFlow30": "Set Paint Flow to  30%",
				"PaintSetFlow40": "Set Paint Flow to  40%",
				"PaintSetFlow50": "Set Paint Flow to  50%",
				"PaintSetFlow60": "Set Paint Flow to  60%",
				"PaintSetFlow70": "Set Paint Flow to  70%",
				"PaintSetFlow80": "Set Paint Flow to  80%",
				"PaintSetFlow90": "Set Paint Flow to  90%",
				"PaintSetOpacity10": "Set Paint Opacity to  10%",
				"PaintSetOpacity100": "Set Paint Opacity to 100%",
				"PaintSetOpacity20": "Set Paint Opacity to  20%",
				"PaintSetOpacity30": "Set Paint Opacity to  30%",
				"PaintSetOpacity40": "Set Paint Opacity to  40%",
				"PaintSetOpacity50": "Set Paint Opacity to  50%",
				"PaintSetOpacity60": "Set Paint Opacity to  60%",
				"PaintSetOpacity70": "Set Paint Opacity to  70%",
				"PaintSetOpacity80": "Set Paint Opacity to  80%",
				"PaintSetOpacity90": "Set Paint Opacity to  90%",
				"PaintTimeStepBack": "Go Back Stroke-Duration Number of Frames",
				"PaintTimeStepForward": "Go Forward Stroke-Duration Number of Frames",
			}],
			"CCompTime": ["Time",
			{
				"TimeFastForward": "Go to End of Composition, Layer, or Footage Item",
				"TimeJumpToIn": "Go to Earliest In Point of Selected Layers",
				"TimeJumpToNextInOut": "Go to Next Layer In or Out Point",
				"TimeJumpToOut": "Go to Latest Out Point of Selected Layers",
				"TimeJumpToPrevInOut": "Go to Previous Layer In or Out Point",
				"TimeJumpToWAEnd": "Go to End of Work Area",
				"TimeJumpToWAStart": "Go to Start of Work Area",
				"TimePlay": "Play",
				"TimeRewind": "Go to Start of Composition, Layer, or Footage Item",
				"TimeSetIn": "Set Layer In Point at Current Time",
				"TimeSetOut": "Set Layer Out Point at Current Time",
				"TimeStepBack": "Go Back 1 Frame",
				"TimeStepBackMore": "Go Back 10 Frames",
				"TimeStepForward": "Go Forward 1 Frame",
				"TimeStepForwardMore": "Go Forward 10 Frames",
				"TimeStretchIn": "Stretch Layer In Point to Current Time",
				"TimeStretchOut": "Stretch Layer Out Point to Current Time",
				"TimeTrimIn": "Trim Layer In Point to Current Time",
				"TimeTrimOut": "Trim Layer Out Point to Current Time",
			}],
			"CDirItemTabPanelTime": ["Time Controls Panel",
			{
				"TimeFastForward": "Go to End of Composition",
				"TimePlay": "Play",
				"TimeRewind": "Go to Start of Composition",
				"TimeStepBack": "Go Back 1 Frame",
				"TimeStepBackMore": "Go Back 10 Frames",
				"TimeStepForward": "Go Forward 1 Frame",
				"TimeStepForwardMore": "Go Forward 10 Frames",
			}],
			"CDirTabPanel": ["Viewer Panel",
			{
				"NewViewer": "New Viewer",
				"NewViewerNewFrame": "Split New Viewer, and Toggle Lock",
			}],
			"CEggApp": ["Previewing",
			{
				"BrowseInBridge": "Browse in Bridge",
				"New": "~~~ New Project",
				"OpenComp": "Switch Between Composition/Timeline Panels",
				"Preview": "RAM Preview",
				"PreviewAlt": "RAM Preview (Alternate)",
				"PreviewAudio": "Audio Preview (Here Forward)",
				"PreviewAudioWorkArea": "Audio Preview (Work Area)",
				"PreviewBlitTest": "~~~ PreviewBlitTest - (Ctrl+Alt+Shift+Pad0)(Ctrl+Alt+Shift+PadInsert)",
				"PreviewWire": "Wireframe Preview, Leaving Panel Contents",
				"PreviewWireClear": "Wireframe Preview",
				"PreviewWireTrails": "Wireframe Preview with Trails",
				"PreviewWireTrailsClear": "~~~ PreviewWireTrailsClear - (Alt+macControl+Pad0)(Alt+macControl+PadInsert)",
				"ToggleVOutEnabled": "Toggle Output Device (Desktop Only / External Video Monitor)",
				"WriteKeybindingsFile": "~~~ WriteKeybindingsFile - (Alt+K)",
				"WriteStringFile": "~~~ WriteStringFile - (Ctrl+Alt+Shift+macControl+S)",
				"WriteVersionFile": "~~~ WriteVersionFile - (Ctrl+Shift+HELP)",
				"WriteVersionFileExtra": "~~~ WriteVersionFileExtra - (Ctrl+Alt+Shift+HELP)",
			}],
			"CEggAppTool": ["Tools",
			{
				"ToolArrow": "Selection",
				"ToolCamera": "Camera (Cycle Forward)",
				"ToolCameraToggle": "Camera (Cycle Backward)",
				"ToolHand": "Hand",
				"ToolMagnify": "Zoom",
				"ToolMask": "Shape / Mask (Cycle Forward)",
				"ToolMaskToggle": "Shape / Mask (Cycle Backward)",
				"ToolPaint": "Paint (Brush/Clone/Eraser)",
				"ToolPan": "Pan Behind",
				"ToolPen": "Pen (Cycle Forward)",
				"ToolPenToggle": "Pen (Cycle Backward)",
				"ToolPin": "Puppet (Pin/Overlap/Starch)",
				"ToolRotate": "Rotate",
				"ToolText": "Text",
			}],
			"CItem": ["Composition Panel - Views",
			{
				"PurgeSnapshot1": "Purge Snapshot 1",
				"PurgeSnapshot2": "Purge Snapshot 2",
				"PurgeSnapshot3": "Purge Snapshot 3",
				"PurgeSnapshot4": "Purge Snapshot 4",
				"ShowAlphaChannel": "Show/Hide Alpha Channel (Grayscale)",
				"ShowAlphaChannelAlt": "Show/Hide RGB Straight Color",
				"ShowBlueChannel": "Show/Hide Blue Channel (Grayscale)",
				"ShowBlueChannelAlt": "Show/Hide Blue Channel (Colorized)",
				"ShowGreenChannel": "Show/Hide Green Channel (Grayscale)",
				"ShowGreenChannelAlt": "Show/Hide Green Channel (Colorized)",
				"ShowRedChannel": "Show/Hide Red Channel (Grayscale)",
				"ShowRedChannelAlt": "Show/Hide Red Channel (Colorized)",
				"ShowSnapshot1": "Show Snapshot 1",
				"ShowSnapshot2": "Show Snapshot 2",
				"ShowSnapshot3": "Show Snapshot 3",
				"ShowSnapshot4": "Show Snapshot 4",
				"TakeSnapshot1": "Take Snapshot 1",
				"TakeSnapshot2": "Take Snapshot 2",
				"TakeSnapshot3": "Take Snapshot 3",
				"TakeSnapshot4": "Take Snapshot 4",
				"TitleActionGridAnim": "Show/Hide Proportional Grid",
				"TitleActionGridRotate": "Show/Hide Title/Action Safe Guides",
				"TitleActionSafeToggle": "Show/Hide Grid",
				"VOutPushFrame": "Show Current Frame on External Video Monitor",
			}],
			"COutline": ["Property Groups and Properties",
			{
				"Clear": "Delete",
				"Rename": "Rename",
			}],
			"CPanoECOutline": ["Effect Controls Panel",
			{
				"NOP": "~~~",
				"OpenComp": "Switch to Composition Panel",
				"SelectNext": "Select Next Effect",
				"SelectNextAdd": "Extend Selection to Next Effect",
				"SelectPrevious": "Select Previous Effect",
				"SelectPreviousAdd": "Extend Selection to Previous Effect",
			}],
			"CPanoProjFootage": ["Footage Panel",
			{
				"TimeJumpToIn": "Go to In Point",
				"TimeJumpToOut": "Go to Out Point",
				"TimeStepBack": "Go to Previous Frame",
				"TimeStepForward": "Go to Next Frame",
				"TimeTrimIn": "Set In Point at Current Time",
				"TimeTrimOut": "Set Out Point at Current Time",
			}],
			"CPanoProjItem": ["Composition Panel - Zoom & Masks",
			{
				"FitItemView": "Fit",
				"FitItemViewUpTo100": "Fit up to 100%",
				"ProofColors": "Enable/Disable Display Color Management",
				"SelectNextMask": "Select Next Mask",
				"SelectPreviousMask": "Select Previous Mask",
				"Zoom100Percent": "Zoom to 100%",
				"ZoomIn": "Zoom In",
				"ZoomInResize": "~~~ ZoomInResize - (Alt+.)(Ctrl+=)",
				"ZoomNoScroll": "~~~ ZoomNoScroll - (Ctrl+Alt+/)",
				"ZoomOut": "Zoom Out",
				"ZoomOutResize": "~~~ ZoomOutResize - (Alt+Comma)(Ctrl+-)",
			}],
			"CPanoProjLayer": ["Layer Panel",
			{
				"Clear": "Clear (Delete)",
				"ClearMask": "~~~ ClearMask - (Alt+Delete)(Alt+FwdDel)",
				"OpenComp": "Switch to Composition Panel",
				"TimeJumpToIn": "Go to Layer In Point",
				"TimeJumpToOut": "Go to Layer Out Point",
				"TimeSetIn": "Set Layer In Point at Current Time",
				"TimeSetOut": "Set Layer Out Point at Current Time",
				"TimeStretchIn": "Stretch Layer In Point to Current Time",
				"TimeStretchOut": "Stretch Layer Out Point to Current Time",
				"TimeTrimIn": "Trim Layer In Point to Current Time",
				"TimeTrimOut": "Trim Layer Out Point to Current Time",
			}],
			"CPanoProjLayerPano": ["~~~ - CPanoProjLayerPano",
			{
				"NudgeDown": "Move Layer 1 Screen Pixel Down",
				"NudgeDownMore": "Move Layer 10 Screen Pixels Down",
				"NudgeLeft": "Move Layer 1 Screen Pixel to the Left",
				"NudgeLeftMore": "Move Layer 10 Screen Pixels to the Left",
				"NudgeRight": "Move Layer 1 Screen Pixel to the Right",
				"NudgeRightMore": "Move Layer 10 Screen Pixels to the Right",
				"NudgeRotCCW": "Rotate Layer 1 Degree Counterclockwise",
				"NudgeRotCCWMore": "Rotate Layer 10 Degrees Counterclockwise",
				"NudgeRotCW": "Rotate Layer 1 Degree Clockwise",
				"NudgeRotCWMore": "Rotate Layer 10 Degrees Clockwise",
				"NudgeScaleLarger": "Scale Layer 1% Larger",
				"NudgeScaleLargerMore": "Scale Layer 10% Larger",
				"NudgeScaleSmaller": "Scale Layer 1% Smaller",
				"NudgeScaleSmallerMore": "Scale Layer 10% Smaller",
				"NudgeUp": "Move Layer 1 Screen Pixel Up",
				"NudgeUpMore": "Move Layer 10 Screen Pixels Up",
			}],
			"CPanoProjLayerPanoMask": ["Layer Panel Magnification",
			{
				"Zoom100Percent": "Zoom to 100%",
				"ZoomIn": "Zoom In",
				"ZoomOut": "Zoom Out",
			}],
			"CPanoRender": ["Rendering",
			{
				"StartStopRender": "Stop Render",
			}],
			"CSwitchboard": ["General",
			{
				"AddCompToRenderQueue": "Add Comp to Render Queue",
				"AddItemToComp": "Add Footage Item to Comp",
				"AddItemToCompReplaceLayer": "Replace Selected Layer with Selected Footage Item",
				"AutoOrient": "Auto-Orient",
				"BestQuality": "Set Layer Quality to Best",
				"BestQualityRecurse": "~~~ BestQualityRecurse - (Ctrl+macControl+U)",
				"BringCloser": "Bring Layer Forward",
				"BringToFront": "Bring Layer to Front",
				"Clear": "Clear (Delete)",
				"Close": "Close Current Panel or Viewer Contents",
				"CloseAll": "~~~ CloseAll - (Ctrl+Alt+W)",
				"CloseWindow": "Close Current Viewer or All Viewers of Same Type",
				"CompSettings": "Composition Settings",
				"CompToggleUberAnimatingKeyframes": "Show/Hide Modified Properties (Double-Tap)",
				"CompToggleUberAnimatingKeyframesAddState": "Show/Hide Modified Properties (Extend; Double-Tap)",
				"CompViewOptions": "View Options",
				"Compify": "Pre-compose",
				"Copy": "Copy",
				"CustResNoDialog": "Set Comp Resolution to Custom",
				"CustResNoDialogRecurse": "~~~ CustResNoDialogRecurse - (Ctrl+Alt+macControl+J)",
				"Cut": "Cut",
				"DebugDroverCreateNewTab": "~~~ DebugDroverCreateNewTab - (Ctrl+Shift+Alt+D)",
				"DebugGDIBenchmark": "~~~ DebugGDIBenchmark - (Shift+Esc)",
				"DeselectAll": "Deselect All Layers",
				"DeselectAllKeyframes": "Deselect All Keyframes and Properties",
				"DraftQuality": "Set Layer Quality to Draft",
				"DraftQualityRecurse": "~~~ DraftQualityRecurse - (Ctrl+Shift+macControl+U)",
				"Duplicate": "Duplicate",
				"EasyEase": "Set Keyframe to Easy Ease",
				"EasyEaseIn": "Set Keyframe to Easy Ease In",
				"EasyEaseOut": "Set Keyframe to Easy Ease Out",
				"EditFileExternally": "Edit Original",
				"EnableTimeRemap": "Enable Time Remapping",
				"ExecuteScript": "Run Script File",
				"ExecuteScriptMenuItem01": "Run Script # 1",
				"ExecuteScriptMenuItem02": "Run Script # 2",
				"ExecuteScriptMenuItem03": "Run Script # 3",
				"ExecuteScriptMenuItem04": "Run Script # 4",
				"ExecuteScriptMenuItem05": "Run Script # 5",
				"ExecuteScriptMenuItem06": "Run Script # 6",
				"ExecuteScriptMenuItem07": "Run Script # 7",
				"ExecuteScriptMenuItem08": "Run Script # 8",
				"ExecuteScriptMenuItem09": "Run Script # 9",
				"ExecuteScriptMenuItem10": "Run Script #10",
				"ExecuteScriptMenuItem11": "Run Script #11",
				"ExecuteScriptMenuItem12": "Run Script #12",
				"ExecuteScriptMenuItem13": "Run Script #13",
				"ExecuteScriptMenuItem14": "Run Script #14",
				"ExecuteScriptMenuItem15": "Run Script #15",
				"ExecuteScriptMenuItem16": "Run Script #16",
				"ExecuteScriptMenuItem17": "Run Script #17",
				"ExecuteScriptMenuItem18": "Run Script #18",
				"ExecuteScriptMenuItem19": "Run Script #19",
				"ExecuteScriptMenuItem20": "Run Script #20",
				"FilterNone": "Delete All Effects from Selected Layers",
				"Find": "Find Matching Project Item",
				"FindNext": "Find Next Matching Project Item",
				"ForceScanForChangedFootage": "Reload Selected Footage Items",
				"GoToTime": "Go to Time",
				"Group": "Group Shapes",
				"HelpAfterEffectsHelp": "Help",
				"HideOtherVideo": "Hide Other Layers' Video",
				"HighResolution": "Set Comp Resolution to High",
				"HighResolutionRecurse": "~~~ HighResolutionRecurse - (Ctrl+macControl+J)",
				"ImportFootage": "Import File",
				"ImportMultiple": "Import Multiple Files",
				"IncrementAndSave": "Increment and Save Project",
				"InterpretFootage": "Interpret Footage",
				"KeyframeInterpDialog": "Keyframe Interpolation (Edit in Dialog Box)",
				"KeyframeVelocityDialog": "Keyframe Velocity (Edit in Dialog Box)",
				"LastEffect": "Apply Last Effect",
				"LayerSettings": "Layer Settings",
				"LookAtSelected": "Move Camera and its POI to Look at Selected Layers",
				"LowResolution": "Set Comp Resolution to Low",
				"LowResolutionRecurse": "~~~ LowResolutionRecurse - (Ctrl+Alt+Shift+macControl+J)",
				"MacSysMenuMinimize": "~~~ MacSysMenuMinimize - (Ctrl+macControl+M)",
				"MakeMovie": "Make Movie",
				"Mask": "Mask Shape (Edit in Dialog Box)",
				"MaskFeather": "Mask Feather (Edit in Dialog Box)",
				"MaskInverse": "Invert Mask",
				"MaskReshape": "Mask Free-Transform",
				"MedResolution": "Set Comp Resolution to Half",
				"MedResolutionRecurse": "~~~ MedResolutionRecurse - (Ctrl+Shift+macControl+J)",
				"MemoryModeToggle": "~~~ MemoryModeToggle - (Ctrl+Alt+Shift+macControl+Enter)",
				"New": "New Project",
				"NewCamera": "New Camera Layer",
				"NewComp": "New Composition",
				"NewDebugComp": "~~~ NewDebugComp - (Shift+Alt+D)",
				"NewLight": "New Light Layer",
				"NewMask": "New Mask",
				"NewNullObject": "New Null Object",
				"NewSolidInComp": "New Solid Layer",
				"NewTextLayer": "New Text Layer",
				"NextXferMode": "Next Layer Blending Mode",
				"Offset": "Position (Edit in Dialog Box)",
				"Opacity": "Opacity (Edit in Dialog Box)",
				"Open": "Open Project",
				"OpenEffectControls": "~~~ OpenEffectControls - ()",
				"OpenLayerSourceWindow": "~~~ OpenLayerSourceWindow - (Alt+Enter)",
				"Orientation": "Orientation (Edit in Dialog Box)",
				"Paste": "Paste",
				"PrefsGeneral": "Preferences",
				"PrevXferMode": "Previous Layer Blending Mode",
				"Print": "~~~ Print - (Ctrl+P)",
				"ProjectSettings": "Project Settings",
				"ProofColors": "Toggle Use Display Color Management",
				"PurgeAll": "Purge All Caches",
				"Quit": ((keyedUpData.onWindows) ? "Exit" : "Quit"),
				"RecentFavorite00": "Apply Recently Used Animation Preset",
				"RecentProject00": "Open Most Recent Project",
				"Redo": "Redo Last Action",
				"ReplaceFootage": "Replace Footage",
				"RotateAll": "Rotation (Edit in Dialog Box)",
				"Save": "Save Project",
				"SaveAs": "Save Project As",
				"SaveFrameAs": "Save Frame As",
				"SavePreview": "Save RAM Preview",
				"SavePreviewAlt": "Save RAM Preview (Alternate)",
				"SavePreviewAltCompactMem": "~~~ SavePreviewAltCompactMem - (Ctrl+Shift+macControl+Pad0)(Ctrl+Shift+macControl+PadInsert)",
				"SavePreviewCompactMem": "~~~ SavePreviewCompactMem - (Ctrl+macControl+Pad0)(Ctrl+macControl+PadInsert)",
				"ScanForChangedFootage": "Scan for Changed Footage",
				"SelectAll": "Select All",
				"SelectNextViewerContext": "Switch to Next Item in Viewer",
				"SelectPrevViewerContext": "Switch to Previous Item in Viewer",
				"SendFarther": "Send Layer Backward",
				"SendToBack": "Send Layer to Back",
				"SetBackColor": "Background Color for Composition",
				"SetProxyFile": "Set Proxy for Selected Footage Item",
				"ShowCompTree": "Show Flowchart for Composition",
				"ShowFrameFileName": "Show File Name of Frame's Footage in Info Panel",
				"ShowHideAudio": "Show/Hide Audio Panel",
				"ShowHideBrushPal": "Show/Hide Brush Tips Panel",
				"ShowHideCharPal": "Show/Hide Character Panel",
				"ShowHideFxPal": "Show/Hide Effects & Presets Panel",
				"ShowHideInfo": "Show/Hide Info Panel",
				"ShowHidePaintPal": "Show/Hide Paint Panel",
				"ShowHideParaPal": "Show/Hide Paragraph Panel",
				"ShowHideProject": "Show/Hide Project Panel",
				"ShowHideRenderQueue": "Show/Hide Render Queue Panel",
				"ShowHideTimePanel": "Show/Hide Time Controls Panel",
				"ShowHideTools": "Show/Hide Tools Panel",
				"ShowProjectTree": "Show Flowchart for Project",
				"ShowRulers": "Toggle Show Rulers",
				"SplitLayer": "Split Layer at Current Time",
				"SwitchTo3DViewB": "Switch to 3D View #2",
				"SwitchTo3DViewC": "Switch to 3D View #3",
				"SwitchTo3DViewFirst": "Switch to 3D View #1",
				"SwitchToLast3DView": "Switch to Last 3D View",
				"SwitchToWorkspaceA": "Switch to Workspace #1",
				"SwitchToWorkspaceB": "Switch to Workspace #2",
				"SwitchToWorkspaceC": "Switch to Workspace #3",
				"ToggleCastsShadows": "Toggle Casts Shadows for Selected 3D Layers",
				"ToggleEffectControls": "Show/Hide Effect Controls Panel for Selected Layers",
				"ToggleExpression": "Toggle Expression for Selected Properties",
				"ToggleKeyframeHoldInterp": "Toggle Hold Interpolation for Selected Keyframes",
				"ToggleLayerControls": "Toggle Show Layer Controls",
				"ToggleLock": "Toggle Lock Switch for Selected Layers",
				"ToggleLockGuides": "Toggle Lock Guides",
				"ToggleShowGrid": "Toggle Show Grid",
				"ToggleShowGuides": "Toggle Show Guides",
				"ToggleSnapGrid": "Toggle Snap to Grid",
				"ToggleSnapGuides": "Toggle Snap to Guides",
				"ToggleSwitchesModes": "Toggle Switches / Modes Column",
				"ToggleVideo": "Toggle Video Switch for Selected Layers",
				"Undo": "Undo Last Action",
				"Ungroup": "Ungroup Shapes",
				"UnlockAllLayers": "Unlock All Layers",
				"WireframeQuality": "Set Layer Quality to Wireframe",
				"WireframeQualityRecurse": "~~~ WireframeQualityRecurse - (Ctrl+Alt+Shift+macControl+U)",
				"XFactorPreview": "~~~ XFactorPreview - ()",
				"XFactorPreviewMisc": "~~~ XFactorPreviewMisc - ()",
				"XFactorPreviewStop": "~~~ XFactorPreviewStop - ()",
			}],
			"CSwitchboardModal": ["Clipboard",
			{
				"Clear": "Clear (Delete)",
				"Copy": "Copy",
				"Cut": "Cut",
				"Paste": "Paste",
				"Redo": "Redo Last Action",
				"SelectAll": "Select All",
				"Undo": "Undo Last Action",
			}],
			"CTopic": ["Layer Properties",
			{
				"Twirl": "~~~ Twirl - ()",
				"TwirlExplode": "Show/Hide All of the Selected Layers' Properties",
				"TwirlPreserveSolo": "~~~ TwirlPreserveSolo - (Shift+`)",
				"TwirlPreserveSoloExplode": "~~~ TwirlPreserveSoloExplode - (Ctrl+Shift+`)",
			}],
			"FloPano": ["Flowchart Panel",
			{
				"Clear": "Delete",
				"ClearWithoutWarning": "~~~ ClearWithoutWarning - (Ctrl+Delete)",
				"OpenComp": "Switch to Composition Panel",
				"Zoom100Percent": "Zoom to 100%",
				"ZoomIn": "Zoom In",
				"ZoomOut": "Zoom Out",
			}],
			"MacSysShortcutsAlt": ["~~~ - MacSysShortcutsAlt",
			{
				"MacSysMenuHideMe": "~~~ MacSysMenuHideMe - ()",
				"MacSysMenuHideOthers": "~~~ MacSysMenuHideOthers - ()",
				"MacSysMenuMinimize": "~~~ MacSysMenuMinimize - ()",
			}],
			"MacSysShortcutsStd": ["~~~ - MacSysShortcutsStd",
			{
				"MacSysMenuHideMe": "~~~ MacSysMenuHideMe - ()",
				"MacSysMenuHideOthers": "~~~ MacSysMenuHideOthers - ()",
				"MacSysMenuMinimize": "~~~ MacSysMenuMinimize - ()",
			}],
			"POutlinePano": ["Project Panel",
			{
				"AddItemToComp": "Add Project Item to Current Composition",
				"AddItemToCompReplaceLayer": "Replace Selected Layers with Selected Project Item",
				"ApplyInterpretation": "Apply Remembered Interpretation of Footage Item",
				"ClearWithoutWarning": "Delete Without Confirmation",
				"NewFolder": "New Folder",
				"OpenItemForceNewWindow": "Open Footage Item in New Footage Panel",
				"OpenItemWindow": "Open Footage Item in Footage Panel",
				"RememberInterpretation": "Remember Interpretation of Footage Item",
				"SelectNext": "Select Next Project Item",
				"SelectNextAdd": "Extend Selection to Next Project Item",
				"SelectPrevious": "Select Previous Project Item",
				"SelectPreviousAdd": "Extend Selection to Previous Project Item",
			}],
			"RQOutlinePano": ["Render Queue Panel",
			{
				"SelectNext": "Select Previous RQ Item or Output Module",
				"SelectNextAdd": "Extend Selection to Next RQ Item or Output Module",
				"SelectPrevious": "Select Previous RQ Item or Output Module",
				"SelectPreviousAdd": "Extend Selection to Previous RQ Item or Output Module",
				"StartStopRender": "Start Render",
				"StopRender": "Stop Render",
			}],
			"TLOutlinePano": ["Timeline Navigation",
			{
				"CompTimeZoomFrames": "Zoom In to Frame Intervals",
				"CompTimeZoomIn": "Zoom In to Current Time",
				"CompTimeZoomOut": "Zoom Out from Current Time",
				"TimeJumpToIn": "Go to In Point of Topmost Selected Layer",
				"TimeJumpToOut": "Go to Out Point of Topmost Selected Layer",
				"TimeSetIn": "Set Layer In Point at Current Time",
				"TimeSetOut": "Set Layer Out Point at Current Time",
				"TimeStretchIn": "Stretch Layer In Point to Current Time",
				"TimeStretchOut": "Stretch Layer Out Point to Current Time",
				"TimeTrimIn": "Trim Layer In Point to Current Time",
				"TimeTrimOut": "Trim Layer Out Point to Current Time",
				"ToggleGraph": "Show/Hide Graph Editor",
			}],
			"TextLayerUI": ["Text Layer",
			{
				"TextAlignCenter": "Align Selected Text Center (Horiz or Vert)",
				"TextAlignLeft": "Align Selected Text Left (Horiz) or Top (Vert)",
				"TextAlignRight": "Align Selected Text Right (Horiz) or Bottom (Vert)",
				"TextAllCaps": "Toggle All Caps for Selected Text",
				"TextAutoLeading": "Auto Leading for Selected Text",
				"TextCancel": "Cancel Changes to Text",
				"TextCommit": "Commit Changes to Text",
				"TextCursorToDocumentEnd": "Move Insertion Point to End of Text Frame",
				"TextCursorToDocumentStart": "Move Insertion Point to Beginning of Text Frame",
				"TextCursorToDown": "Move Insertion Point to Next Line (Horiz) or Char (Vert)",
				"TextCursorToLeft": "Move Insertion Point to Previous Char (Horiz) or Line (Vert)",
				"TextCursorToLineEnd": "Move Insertion Point to End of Line",
				"TextCursorToLineStart": "Move Insertion Point to Beginning of Line",
				"TextCursorToRight": "Move Insertion Point to Next Char (Horiz) or Line (Vert)",
				"TextCursorToUp": "Move Insertion Point to Previous Line (Horiz) or Char (Vert)",
				"TextCursorToWordDown": "Move Insertion Point to Next Paragraph (Horiz) or Word (Vert)",
				"TextCursorToWordLeft": "Move Insertion Point to Previous Word (Horiz) or Paragraph (Vert)",
				"TextCursorToWordRight": "Move Insertion Point to Next Word (Horiz) or Paragraph (Vert)",
				"TextCursorToWordUp": "Move Insertion Point to Previous Paragraph (Horiz) or Word (Vert)",
				"TextDecreaseBaselineShift": "Decrease Baseline Shift by 2 px",
				"TextDecreaseBaselineShiftALot": "Decrease Baseline Shift by 10 px",
				"TextDecreaseFontSize": "Decrease Font Size by 2 px",
				"TextDecreaseFontSizeALot": "Decrease Font Size by 10 px",
				"TextDecreaseKerning": "Decrease Kerning or Tracking by 20 units",
				"TextDecreaseKerningALot": "Decrease Kerning or Tracking by 100 units",
				"TextDecreaseLeading": "Decrease Leading by 2 px",
				"TextDecreaseLeadingALot": "Decrease Leading by 10 px",
				"TextDeleteBackward": "Backspace (Previous Character)",
				"TextDeleteForward": "Delete (Next Character)",
				"TextIgnoreKey": "~~~",
				"TextIncreaseBaselineShift": "Increase Baseline Shift by 2 px",
				"TextIncreaseBaselineShiftALot": "Increase Baseline Shift by 10 px",
				"TextIncreaseFontSize": "Increase Font Size by 2 px",
				"TextIncreaseFontSizeALot": "Increase Font Size by 10 px",
				"TextIncreaseKerning": "Increase Kerning or Tracking by 20 px",
				"TextIncreaseKerningALot": "Increase Kerning or Tracking by 100 px",
				"TextIncreaseLeading": "Increase Leading by 2 px",
				"TextIncreaseLeadingALot": "Increase Leading by 10 px",
				"TextJustifyAll": "Justify Paragraph; Force Last Line",
				"TextJustifyLeft": "Justify Paragraph; Left Align Last Line",
				"TextJustifyRight": "Justify Paragraph; Right Align Last Line",
				"TextResetHorizontalScale": "Reset Horizontal Scale of Selected Text",
				"TextResetTracking": "Reset Tracking of Selected Text",
				"TextResetVerticalScale": "Reset Vertical Scale of Selected Text",
				"TextSelectToDocumentEnd": "Extend Selection to End of Text Frame",
				"TextSelectToDocumentStart": "Extend Selection to Beginning of Text Frame",
				"TextSelectToDown": "Extend Selection 1 Line Down (Horiz) or 1 Char Down (Vert)",
				"TextSelectToLeft": "Extend Selection 1 Char to Left (Horiz) or 1 Line to Left (Vert)",
				"TextSelectToLineEnd": "Extend Selection to End of Line",
				"TextSelectToLineStart": "Extend Selection to Beginning of Line",
				"TextSelectToRight": "Extend Selection 1 Char to Right (Horiz) or 1 Line to Right (Vert)",
				"TextSelectToUp": "Extend Selection 1 Line Up (Horiz) or 1 Char Up (Vert)",
				"TextSelectToWordDown": "Extend Selection 1 Word Down (Vert)",
				"TextSelectToWordLeft": "Extend Selection 1 Word to Left (Horiz)",
				"TextSelectToWordRight": "Extend Selection 1 Word to Right (Horiz)",
				"TextSelectToWordUp": "Extend Selection 1 Word Up (Vert)",
				"TextSmallCaps": "Toggle Small Caps for Selected Text",
				"TextSubScript": "Toggle Subscript for Selected Text",
				"TextSuperScript": "Toggle Superscript for Selected Text",
				"TextToggleComposer": "Toggle Composer for Selected Paragraphs",
				//****** no support for Ctrl+Shift+UpArrow/Ctrl+Shift+DownArrow for extending selection one line up/down (horizontal text) or one word up/down (vertical text)?
			}],
			"Tracker": ["Motion Tracker",
			{
				"MTNudgeDown": "Move Track Point Down 1 Screen Pixel",
				"MTNudgeDownHoldPos": "Move Track Point (Not Attach Point) Down 1 Screen Pixel",
				"MTNudgeDownHoldPosMore": "Move Track Point (Not Attach Point) Down 10 Screen Pixels",
				"MTNudgeDownMore": "Move Track Point Down 10 Screen Pixels",
				"MTNudgeLeft": "Move Track Point Left 1 Screen Pixel",
				"MTNudgeLeftHoldPos": "Move Track Point (Not Attach Point) Left 1 Screen Pixel",
				"MTNudgeLeftHoldPosMore": "Move Track Point (Not Attach Point) Left 10 Screen Pixels",
				"MTNudgeLeftMore": "Move Track Point Left 10 Screen Pixels",
				"MTNudgeRight": "Move Track Point Right 1 Screen Pixel",
				"MTNudgeRightHoldPos": "Move Track Point (Not Attach Point) Right 1 Screen Pixel",
				"MTNudgeRightHoldPosMore": "Move Track Point (Not Attach Point) Right 10 Screen Pixels",
				"MTNudgeRightMore": "Move Track Point Right 10 Screen Pixels",
				"MTNudgeUp": "Move Track Point Up 1 Screen Pixel",
				"MTNudgeUpHoldPos": "Move Track Point (Not Attach Point) Up 1 Screen Pixel",
				"MTNudgeUpHoldPosMore": "Move Track Point (Not Attach Point) Up 10 Screen Pixels",
				"MTNudgeUpMore": "Move Track Point Up 10 Screen Pixels",
				"MTSetEnd": "Set Out Point of 'Motion Tracker Points' Bar in Layer Panel",
				"MTSetStart": "Set In Point of 'Motion Tracker Points' Bar in Layer Panel",
			}],
		};
		
		// Reassign specific commands based on After Effects version
		if (keyedUpData.aeVersion >= 9) {
			// New/revised shortcuts in After Effects CS4
			keyedUpData.cmdNames["CCompCmd"][1]["FlipHorizontal"] = "Flip Horizontal";
			keyedUpData.cmdNames["CCompCmd"][1]["FlipVertical"] = "Flip Vertical";
			keyedUpData.cmdNames["CCompCmd"][1]["CenterLayerInView"] = "Center Layer in View";
			keyedUpData.cmdNames["CCompCompCmd"][1]["NudgeOpacityDown"] = "Decrease Layer Opacity by 1%";
			keyedUpData.cmdNames["CCompCompCmd"][1]["NudgeOpacityDownMore"] = "Decrease Layer Opacity by 10%";
			keyedUpData.cmdNames["CCompCompCmd"][1]["NudgeOpacityUp"] = "Increase Layer Opacity by 1%";
			keyedUpData.cmdNames["CCompCompCmd"][1]["NudgeOpacityUpMore"] = "Increase Layer Opacity by 10%";
			keyedUpData.cmdNames["CDirItemTabPanelTime"][0] = "Preview Panel";
			keyedUpData.cmdNames["CEggApp"][1]["OpenMRUContext"] = "Switch Between Current and Last Accessed Composition";
			keyedUpData.cmdNames["CSwitchboard"][1]["AddToAdobeMediaEncoderRenderQueue"] = "~~~ Add Comp to Adobe Media Encoder Queue";
			keyedUpData.cmdNames["CSwitchboard"][1]["NewEffectsLayer"] = "New Adjustment Layer";
			keyedUpData.cmdNames["CSwitchboard"][1]["Find"] = "Find (Search Filter)";
			keyedUpData.cmdNames["CSwitchboard"][1]["FindNext"] = "~~~ Find Next Matching Project Item - (Shift+Alt+G)";
			keyedUpData.cmdNames["CSwitchboard"][1]["ShowHideBrushPal"] = "Show/Hide Brushes Panel";
			keyedUpData.cmdNames["CSwitchboard"][1]["ShowHideTimePanel"] = "Show/Hide Preview Panel";
		}
		if (keyedUpData.aeVersion >= 10) {
			// New/revised shortcuts in After Effects CS5
			keyedUpData.cmdNames["CameraToolUI"] = ["Tools, Unified Camera", {}];
			keyedUpData.cmdNames["CameraToolUI"][1]["LookAtAll"] = "Move Camera to Look At All Layers";
			keyedUpData.cmdNames["CameraToolUI"][1]["LookAtSelected"] = "Move Camera to Look At Selected Layers";
			keyedUpData.cmdNames["CEggApp"][1]["PreviewNFrames"] = "RAM Preview (Previous n Frames)";
			keyedUpData.cmdNames["CEggAppTool"][1]["ToolRotoBrush"] = "Roto Brush";
			keyedUpData.cmdNames["CItem"][1]["ShowAlphaOutline"] = "Toggle Alpha Boundary";
			keyedUpData.cmdNames["CItem"][1]["ShowAlphaOverlay"] = "Toggle Alpha Overlay";
			keyedUpData.cmdNames["CPanoECOutline"][1]["TwirlClosed"] = "Collapse Selected Property Group";
			keyedUpData.cmdNames["CPanoECOutline"][1]["TwirlOpen"] = "Expand Selected Property Group";
			keyedUpData.cmdNames["POutlinePano"][1]["TwirlClosed"] = "Collapse Selected Folder";
			keyedUpData.cmdNames["POutlinePano"][1]["TwirlOpen"] = "Expand Selected Folder";
			keyedUpData.cmdNames["RQOutlinePano"][1]["TwirlClosed"] = "Collapse Selected Render Queue Item";
			keyedUpData.cmdNames["RQOutlinePano"][1]["TwirlOpen"] = "Expand Selected Render Queue Item";
			keyedUpData.cmdNames["CCompCompCmd"][1]["CompTimeZoomToggleFullCustom"] = "Toggle Zoom Level";
			keyedUpData.cmdNames["TLOutlinePano"][1]["CompTimeZoomToggleFullCustom"] = "Toggle Zoom Level";
		}
		if (keyedUpData.aeVersion >= 11) {
			// New/revised shortcuts in After Effects CS6
			keyedUpData.cmdNames["CItem"][1]["FastPreviewsOff"] = "Switch Fast Preview to Off (Final Quality)";
			keyedUpData.cmdNames["CItem"][1]["FastPreviewsAdaptiveResolution"] = "Switch Fast Preview to Adaptive Resolution";
			keyedUpData.cmdNames["CItem"][1]["FastPreviewsDraft"] = "Switch Fast Preview to Draft";
			keyedUpData.cmdNames["CItem"][1]["FastPreviewsFastDraft"] = "Switch Fast Preview to Fast Draft";
			keyedUpData.cmdNames["CItem"][1]["FastPreviewsWireframe"] = "Switch Fast Preview to Wireframe";
			keyedUpData.cmdNames["CSwitchboard"][1]["CacheWorkAreaInBackground"] = "Cache Work Area in Background";
			keyedUpData.cmdNames["CEggApp"][1]["ShowConsole"] = "~~~ Show Console - (Ctrl+F12)";
			keyedUpData.cmdNames["CEggAppTool"][1]["ToolPan"] = "Pan Behind (Anchor Point)";
			keyedUpData.cmdNames["CEggAppTool"][1]["ToolPen"] = "Pen / Mask Feather (Cycle Forward)";
			keyedUpData.cmdNames["CEggAppTool"][1]["ToolPenToggle"] = "Pen / Mask Feather (Cycle Backward)";
		}
		
		// Array of available key names
		keyedUpData.baseKeys = ["Enter", "Delete", "Backspace", "Tab", "Return", "Esc", "LeftArrow", "RightArrow", "UpArrow", "DownArrow", "Space", "!", "DoubleQuote", "#", "$", "%", "&", "SingleQuote", "LParen", "RParen", "*", "Plus", "Comma", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "Backslash", "]", "^", "_", "`", "{", "|", "}", "~", "Umlaut_A", "Ring_A", "Cedilla_C", "Acute_E", "Tilde_N", "Umlaut_O", "Umlaut_U", "Acute_a", "Grave_a", "Circumflex_a", "Umlaut_a", "Tilde_a", "Ring_a", "Cedilla_c", "Acute_e", "Grave_e", "Circumflex_e", "Umlaut_e", "Acute_i", "Grave_i", "Circumflex_i", "Umlaut_i", "Tilde_n", "Acute_o", "Grave_o", "Circumflex_o", "Umlaut_o", "Tilde_o", "Acute_u", "Grave_u", "Circumflex_u", "Umlaut_u", "Section", "German_dbl_s", "Acute", "Yen", "Grave_A", "Tilde_A", "Tilde_O", "Umlaut_y", "Umlaut_Y", "Circumflex_A", "Circumflex_E", "Acute_A", "Umlaut_E", "Grave_E", "Acute_I", "Circumflex_I", "Umlaut_I", "Grave_I", "Acute_O", "Circumflex_O", "Grave_O", "Acute_U", "Circumflex_U", "Grave_U", "PadDecimal", "PadComma", "PadMultiply", "PadPlus", "PadClear", "PadSlash", "PadMinus", "PadEqual", "PadInsert", "PadDelete", "PadHome", "PadEnd", "PadPageUp", "PadPageDown", "Pad0", "Pad1", "Pad2", "Pad3", "Pad4", "Pad5", "Pad6", "Pad7", "Pad8", "Pad9", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "HELP", "HOME", "PageUP", "FwdDel", "END", "PageDOWN"/*, "NumLock"*/, "Insert", "Pause"/*, "CapsLock"*/, "Main (Unicode)", "KeyPad (Unicode)"];
		keyedUpData.availableKeys = [keyedUpData.strUnassigned].concat(keyedUpData.baseKeys);
		
		
		// keyedUp_buildUI()
		// Function for creating the user interface.
		// 
		function keyedUp_buildUI()
		{
			var dlg = new Window("dialog", keyedUpData.scriptName, [200, 200, 820, 595]);

			if (dlg != null)
			{
				// Category
				dlg.catListLbl = dlg.add("statictext", [10, 10+3, 65, 30+3], keyedUpData.strCategory);
				dlg.catList = dlg.add("dropdownlist", [dlg.catListLbl.bounds.right+5, dlg.catListLbl.bounds.top-3, 355, dlg.catListLbl.bounds.bottom-3], []);
				dlg.catList.onChange = keyedUp_doSelectCat;
				
				dlg.batchReplaceBtn = dlg.add("button", [dlg.bounds.width-120, dlg.catList.bounds.top, dlg.bounds.width-10, dlg.catList.bounds.bottom], keyedUpData.strBatchReplace);
				dlg.batchReplaceBtn.onClick = keyedUp_doBatchReplace;
				
				// Commands, Shortcuts lists
				dlg.sep1 = dlg.add("panel", [10, dlg.catList.bounds.bottom+10, dlg.bounds.width-10, dlg.catList.bounds.bottom+12]);
				
				dlg.cmdsListLbl = dlg.add("statictext", [10, dlg.sep1.bounds.bottom+10, dlg.catList.bounds.right, dlg.sep1.bounds.bottom+25], keyedUpData.strCommands);
				dlg.cmdsList = dlg.add("listbox", [10, dlg.cmdsListLbl.bounds.bottom+2, dlg.cmdsListLbl.bounds.right, dlg.bounds.height-50], []);
				dlg.cmdsList.onChange = keyedUp_doSelectCmd;
				
				dlg.keysListLbl = dlg.add("statictext", [dlg.cmdsListLbl.bounds.right+10, dlg.cmdsListLbl.bounds.top, dlg.bounds.width-10, dlg.cmdsListLbl.bounds.bottom], keyedUpData.strShortcuts);
				dlg.keysList = dlg.add("listbox", [dlg.keysListLbl.bounds.left, dlg.keysListLbl.bounds.bottom+2, dlg.keysListLbl.bounds.right, dlg.keysListLbl.bounds.bottom+70], []);
				dlg.keysList.onChange = keyedUp_doSelectShortcut;
				
				// Definition controls
				dlg.keyCtrlBtn = dlg.add("checkbox", [dlg.keysList.bounds.left, dlg.keysList.bounds.bottom+15, dlg.keysList.bounds.left+65, dlg.keysList.bounds.bottom+15+20], keyedUpData.strCtrl);
				dlg.keyCtrlBtn.enabled = false;
				dlg.keyAltBtn = dlg.add("checkbox", [dlg.keysList.bounds.left, dlg.keyCtrlBtn.bounds.bottom+5, dlg.keysList.bounds.left+65, dlg.keyCtrlBtn.bounds.bottom+5+20], keyedUpData.strAlt);
				dlg.keyAltBtn.enabled = false;
				dlg.keyShiftBtn = dlg.add("checkbox", [dlg.keysList.bounds.left, dlg.keyAltBtn.bounds.bottom+5, dlg.keysList.bounds.left+65, dlg.keyAltBtn.bounds.bottom+5+20], keyedUpData.strShift);
				dlg.keyShiftBtn.enabled = false;
				dlg.keyMCtrlBtn = dlg.add("checkbox", [dlg.keysList.bounds.left, dlg.keyShiftBtn.bounds.bottom+5, dlg.keysList.bounds.left+65, dlg.keyShiftBtn.bounds.bottom+5+20], keyedUpData.strMacCtrl);
				dlg.keyMCtrlBtn.enabled = false;
				
				dlg.keyPlus = dlg.add("statictext", [dlg.keyCtrlBtn.bounds.right+10, dlg.keyAltBtn.bounds.top+15, dlg.keyCtrlBtn.bounds.right+10+8, dlg.keyAltBtn.bounds.bottom+15], keyedUpData.strPlus);
				
				dlg.keyMainList = dlg.add("listbox", [dlg.keyPlus.bounds.right+10, dlg.keyCtrlBtn.bounds.top, dlg.bounds.width-10, dlg.cmdsList.bounds.bottom-30], keyedUpData.availableKeys);
				dlg.keyMainList.enabled = false;
				dlg.keyMainList.onChange = keyedUp_doSelectKey;
				
				dlg.keyCustKeyPrefix = dlg.add("statictext", [dlg.keyMainList.bounds.left-73, dlg.keyMainList.bounds.bottom-17, dlg.keyMainList.bounds.left-57, dlg.keyMainList.bounds.bottom], keyedUpData.strUnicodePrefix);
				dlg.keyCustKeyPrefix.enabled = false;
				dlg.keyCustKey = dlg.add("edittext", [dlg.keyMainList.bounds.left-55, dlg.keyMainList.bounds.bottom-20, dlg.keyMainList.bounds.left-10, dlg.keyMainList.bounds.bottom], "0000");
				dlg.keyCustKey.enabled = false;
				dlg.keyCustKey.onChanging = keyedUp_doValidateUnicodeField;
				
				// Show Conflicts button
				dlg.conflictsBtn = dlg.add("button", [dlg.keyCtrlBtn.bounds.left, dlg.cmdsList.bounds.bottom-20, dlg.keyMainList.bounds.left-10, dlg.cmdsList.bounds.bottom], keyedUpData.strConflicts);
				dlg.conflictsBtn.onClick = function ()
				{
					keyedUp_showConflicts(keyedUpData.shortcuts[this.parent.catList.selection.index][0], keyedUpData.shortcuts[this.parent.catList.selection.index][2][this.parent.cmdsList.selection.index][0]);
				}
				
				// Update Shortcut button
				dlg.updateBtn = dlg.add("button", [dlg.keyMainList.bounds.left, dlg.cmdsList.bounds.bottom-20, dlg.keyMainList.bounds.right, dlg.cmdsList.bounds.bottom], keyedUpData.strUpdate);
				dlg.updateBtn.onClick = keyedUp_doUpdateShortcut;
				
				// Command buttons: Help (?), Merge, Load, Save As, Save HTML, OK, Cancel
				dlg.sep2 = dlg.add("panel", [10, dlg.bounds.height-40, dlg.bounds.width-10, dlg.bounds.height-38]);
				
				dlg.saveHTMLBtn = dlg.add("button", [dlg.cmdsList.bounds.right-90, dlg.bounds.height-30, dlg.cmdsList.bounds.right, dlg.bounds.height-10], keyedUpData.strSaveHTML);
				dlg.saveHTMLBtn.onClick = keyedUp_doSaveHTML;
				dlg.saveAsBtn = dlg.add("button", [dlg.saveHTMLBtn.bounds.left-80, dlg.bounds.height-30, dlg.saveHTMLBtn.bounds.left-10, dlg.bounds.height-10], keyedUpData.strSaveAs);
				dlg.saveAsBtn.onClick = keyedUp_doSaveAsShortcuts;
				dlg.loadBtn = dlg.add("button", [dlg.saveAsBtn.bounds.left-70, dlg.bounds.height-30, dlg.saveAsBtn.bounds.left-10, dlg.bounds.height-10], keyedUpData.strLoad); 
				dlg.loadBtn.onClick = keyedUp_doLoadShortcuts;
				dlg.mergeBtn = dlg.add("button", [dlg.loadBtn.bounds.left-70, dlg.bounds.height-30, dlg.loadBtn.bounds.left-10, dlg.bounds.height-10], keyedUpData.strMerge);
				dlg.mergeBtn.onClick = keyedUp_doMergeShortcuts;
				
				okBtnLeftEdge = (keyedUpData.onWindows) ? dlg.bounds.width-160 : dlg.bounds.width-80;
				cancelBtnLeftEdge = (keyedUpData.onWindows) ? dlg.bounds.width-80 : dlg.bounds.width-160;
				dlg.okBtn = dlg.add("button", [okBtnLeftEdge, dlg.bounds.height-30, okBtnLeftEdge+70, dlg.bounds.height-10], keyedUpData.strOK);
				dlg.okBtn.onClick = keyedUp_doSaveShortcuts;
				dlg.cancelBtn = dlg.add("button", [cancelBtnLeftEdge, dlg.bounds.height-30, cancelBtnLeftEdge+70, dlg.bounds.height-10], keyedUpData.strCancel);
				dlg.cancelBtn.onClick = keyedUp_doCancel;
				
				dlg.helpBtn = dlg.add("button", [10, dlg.bounds.height-30, 35, dlg.bounds.height-10], keyedUpData.strHelp);
				dlg.helpBtn.onClick = function () {alert(keyedUpData.strAbout, keyedUpData.strAboutTitle);}
			}
			
			return dlg;
		}
		
		
		// keyedUp_loadKeys()
		// Function for loading the specified keyboard shortcuts file.
		// Set loadFreshKeys to true to replace existing keys; false to merge keys.
		// 
		function keyedUp_loadKeys(shortcutsFileName, loadFreshKeys)
		{
			// addCommandAndShortcuts()
			// Function for adding or merging the specified command and its shortcuts to the internal list.
			// 
			function addCommandAndShortcuts(categoryStr, commandStr, shortcutIdStr, shortcutsStr, freshKeys)
			{
				var newCommand, operation;
				
				// Need to standardize on platform-specific keys regardless of what comes in (in case user loads shortcuts from other platform)
				shortcutsStr = shortcutsStr.replace(/\((Ctrl|Cmd)/g, "("+keyedUpData.strCtrl);
				shortcutsStr = shortcutsStr.replace(/\+(Ctrl|Cmd)/g, "+"+keyedUpData.strCtrl);
				shortcutsStr = shortcutsStr.replace(/(Alt|Option)/g, keyedUpData.strAlt);
				shortcutsStr = shortcutsStr.replace(/(Mac)Ctrl/g, keyedUpData.strMacCtrl);
				
				// Add operation and its shortcuts (if loading fresh keys) or merge operation and all of its shortcuts (if merging keys) to internal list
				if (freshKeys)
				{
					newCommand = new Array();
					newCommand[0] = commandStr;		// index 0 = command id name
					operation = keyedUpData.cmdNames[categoryStr];
					if (operation != undefined)
						operation = keyedUpData.cmdNames[categoryStr][1][commandStr];
					newCommand[1] = (operation == undefined) ? " ["+commandStr+"]" : operation;		// index 1 = command full name
					newCommand[2] = shortcutsStr;	// index 2 = string of shortcut sequences for the command
					keyedUpData.shortcuts[shortcutIdStr][2][keyedUpData.shortcuts[shortcutIdStr][2].length] = newCommand;
				}
				else
				{
					// Search for a command in the current category
					for (var commandId=0; commandId<keyedUpData.shortcuts[shortcutIdStr][2].length; commandId++)
						if (keyedUpData.shortcuts[shortcutIdStr][2][commandId][0] == commandStr)
							break;
					//alert("shortcutIdStr="+shortcutIdStr+", categoryStr="+categoryStr+", commandStr="+commandStr+"\n"+"commandId="+commandId+", numCommands="+keyedUpData.shortcuts[shortcutIdStr][2].length);
					
					// If no match found, create a new command; otherwise, update the matched command's shortcuts in whole
					if (commandId == keyedUpData.shortcuts[shortcutIdStr][2].length)
					{
						newCommand = new Array();
						newCommand[0] = commandStr;		// index 0 = command id name
						operation = keyedUpData.cmdNames[categoryStr];
						if (operation != undefined)
							operation = keyedUpData.cmdNames[categoryStr][1][commandStr];
						newCommand[1] = (operation == undefined) ? " ["+commandStr+"]" : operation;		// index 1 = command full name
						newCommand[2] = shortcutsStr;	// index 2 = string of shortcut sequences for the command
						keyedUpData.shortcuts[shortcutIdStr][2][commandId] = newCommand;
					}
					else
					{
						// Eventually, we can do intelligent merging; for now, replace all shortcuts completely
						keyedUpData.shortcuts[shortcutIdStr][2][commandId][2] = shortcutsStr;
					}
				}
			}
			
			
			// refreshCatList()
			// Function for sorting the categories and commands within them, then refreshing the UI list menus.
			// 
			function refreshCatList()
			{
				// Custom sort function for sorting the full name (array index 1) for categories and commands
				function sortCatsOrCmds(a, b)
				{
					if (a[1] < b[1])
						return -1;
					else if (a[1] > b[1])
						return 1;
					else
						return 0;
				}
				
				// Sort all commands within each category
				for (var i=0; i<keyedUpData.shortcuts.length; i++)
					keyedUpData.shortcuts[i][2].sort(sortCatsOrCmds);
				keyedUpData.shortcuts.sort(sortCatsOrCmds);
				
				// Add category names to the list menu
				for (var i=0; i<keyedUpData.shortcuts.length; i++)
					if (keyedUpData.shortcuts[i][1].substr(0,3) != "~~~")
						dlg.catList.add("item", keyedUpData.shortcuts[i][1]);
				
				// Initially select the first category
				if (keyedUpData.shortcuts.length > 0)
					dlg.catList.selection = 0;
			}
			
			
			var file = new File(shortcutsFileName);
			var inHeader = false;
			
			if (file.exists)
			{
				dlg.catList.removeAll();
				dlg.cmdsList.removeAll();
				dlg.keysList.removeAll();
				
				keyedUpData.isModified = false;		// Reset dirty bit
				
				file.open("r");
				var line, matches, continued = false;
				var category = "", command = "", operation = "", shortcuts = "";
				var shortcutId = 0, newCategory;
				
				if (loadFreshKeys)
				{
					// Keep track of header comment lines, required for a valid shortcuts file
					keyedUpData.headerComments = new Array();
					
					// Reset internal shortcuts structure (sections, operations, keys)
					keyedUpData.shortcuts = null;
					keyedUpData.shortcuts = new Array();
				}
				
				// Loop through the file
				while (!file.eof)
				{
					line = file.readln();
					
					// Check for header comment lines (if loading fresh keys only), starting with pound (#) sign
					matches = line.match(/^#/);
					if ((matches != null) && loadFreshKeys)
					{
						// Keep track of header lines, as we need to retain them when saving the file
						keyedUpData.headerComments[keyedUpData.headerComments.length] = line;
						continue;
					}
					
					// Check for section lines, enclosed in brackets
					matches = line.match(/^\["(.*)"\]/);
					if (matches != null)
					{
						// new section
						category = matches[1];
						
						// Parse for header section so that we can check shortcut file's version number
						if (category == "** header **")
							inHeader = true;
						else
						{
							command = "";
							shortcuts = "";
							inHeader = false;
							
							// Add section name to internal list (if loading fresh keys), or find the existing one (if merging keys)
							if (loadFreshKeys)
							{
								shortcutId = keyedUpData.shortcuts.length;
								newCategory = new Array();
								newCategory[0] = category;		// index 0 = category id name
								newCategory[1] = ((keyedUpData.cmdNames[category] == undefined) ? " ["+category+"]" : keyedUpData.cmdNames[category][0]);		// index 1 = category full name
								newCategory[2] = new Array();	// index 2 = array of operation/operation full name/shortcuts arrays
								keyedUpData.shortcuts[shortcutId] = newCategory;
							}
							else
							{
								// Search for a matching category
								for (shortcutId=0; shortcutId<keyedUpData.shortcuts.length; shortcutId++)
									if (keyedUpData.shortcuts[shortcutId][0] == category)
										break;
								
								if (shortcutId == keyedUpData.shortcuts.length)	// No match found, so create a new category
								{
									newCategory = new Array();
									newCategory[0] = category;		// index 0 = category id name
									newCategory[1] = ((keyedUpData.cmdNames[category] == undefined) ? " ["+category+"]" : keyedUpData.cmdNames[category][0]);		// index 1 = category full name
									newCategory[2] = new Array();	// index 2 = array of operation/operation full name/shortcuts arrays
									keyedUpData.shortcuts[shortcutId] = newCategory;
								}
							}
						}
					}
					else
					{
						if (!continued)
						{
							matches = line.match(/\s*"(.*)"\s*=\s*"(.*)"(\\)?/);
							if (matches != null)
							{
								command = matches[1];
								shortcuts = matches[2];
								
								// new definition, possibly start of one
								if (matches[3] == "\\")
									continued = true;
								else
								{
									// done, so parse shortcuts
//									$.writeln("  " + command + " = " + shortcuts);
									
									// Check the shortcut file's version number; stop parsing if not minimum supported
									if (inHeader)
									{
										if (command == "major_version")
										{
											// Check if major_version value meets minimum requirement; stop reading otherwise
//											alert(parseFloat(shortcuts) + " ? " + keyedUpData.minShortcutsFileVer);
											keyedUpData.loadedShortcutsFileVer = parseFloat(shortcuts);
											if (keyedUpData.loadedShortcutsFileVer < keyedUpData.minShortcutsFileVer)
											{
												file.close();
												refreshCatList();
												return false;
											}
										}
									}
									else
										addCommandAndShortcuts(category, command, shortcutId, shortcuts, loadFreshKeys);
								}
							}
						}
						else
						{
							matches = line.match(/\s*"(.*)"(\\)?/);
							if (matches != null)
							{
								shortcuts += matches[1];
								if (matches[2] != "\\")
								{
									// done, so parse shortcuts
									continued = false;
									
//									$.writeln("  " + command + " = " + shortcuts);
									if (!inHeader)
										addCommandAndShortcuts(category, command, shortcutId, shortcuts, loadFreshKeys);
								}
							}
						}
					}
				}
				
				file.close();
			}
			
			refreshCatList();
			
			return true;
		}
		
		
		// keyedUp_doSelectCat()
		// Callback function for when a category is selected.
		// 
		function keyedUp_doSelectCat()
		{
			// Deselect selections in other lists
			dlg.keysList.selection = null;
			dlg.cmdsList.selection = null;
			keyedUp_resetKeyControls(false);
			
			if (dlg.catList.selection != null)
			{
				var selectedCat = dlg.catList.selection.index;
				var catOps = keyedUpData.shortcuts[selectedCat][2];
				
				// Refresh the commands list
				dlg.cmdsList.removeAll();
				for (var i=0; i<catOps.length; i++)
					if (catOps[i][1].substr(0,3) != "~~~")
						dlg.cmdsList.add("item", catOps[i][1]);
				
				// Remove the keys from the keys list
				dlg.keysList.removeAll();
			}
		}
		
		
		// keyedUp_doSelectCmd()
		// Callback function for when a command is selected.
		// 
		function keyedUp_doSelectCmd()
		{
			// Deselect selections in other lists
			dlg.keyMainList.selection = null;
			dlg.keysList.selection = null;
			// Now that we're auto-selecting the first shortcut when selecting a command, 
			// this is not necessary as the refresh will happen when the first shortcut is selected
			// (see later in this function).d
			//keyedUp_resetKeyControls(false);
			
			if (dlg.cmdsList.selection != null)
			{
				var selectedCat = dlg.catList.selection.index;
				var selectedCmd = dlg.cmdsList.selection.index;
				var opKeys = keyedUpData.shortcuts[selectedCat][2][selectedCmd][2];
				
				// Remove the keys from the keys list
				dlg.keysList.removeAll();
				
				// Parse shortcuts string
				var keyStr;
				var matches = opKeys.match(/\([^\)]*\)?/g);
				if (matches != null)
				{
					// Add each shortcut to the keys list
					for (var i=0; i<matches.length; i++)
					{
						keyStr = matches[i];
						keyStr = keyStr.substr(1, keyStr.length-2);	// strip off enclosing parentheses
						if (keyStr == "")
							keyStr = keyedUpData.strUnassigned;
						dlg.keysList.add("item", keyStr);
					}
					
					// Select the first shortcut (for convenience)
					dlg.keysList.selection = 0;
				}
			}
		}
		
		
		// keyedUp_resetKeyControls()
		// Function for enabling or disabling controls based on key selection.
		// 
		function keyedUp_resetKeyControls(enableControls)
		{
			dlg.keyCtrlBtn.enabled = enableControls;
			dlg.keyCtrlBtn.value = false;
			dlg.keyAltBtn.enabled = enableControls;
			dlg.keyAltBtn.value = false;
			dlg.keyShiftBtn.enabled = enableControls;
			dlg.keyShiftBtn.value = false;
			dlg.keyMCtrlBtn.enabled = enableControls;
			dlg.keyMCtrlBtn.value = false;
			dlg.keyMainList.enabled = enableControls;
			dlg.keyCtrlBtn.selection = null;
			dlg.keyPlus.enabled = enableControls;
			
			dlg.updateBtn.enabled = enableControls;
			dlg.conflictsBtn.enabled = enableControls;
			
			// Enable the custom key controls only if using Unicode
			dlg.keyCustKeyPrefix.enabled = false;
			dlg.keyCustKey.enabled = false;
			dlg.keyCustKey.text = "";
		}
		
		
		// keyedUp_getKeyListIndex()
		// Function for finding the array index for the specified key name.
		// 
		function keyedUp_getKeyListIndex(key)
		{
			var listIndex = null;
			
			for (listIndex=0; listIndex<dlg.keyMainList.items.length; listIndex++)
				if (dlg.keyMainList.items[listIndex].toString() == key)
					break;
			
			return listIndex;
		}
		
		
		// keyedUp_doSelectShortcut()
		// Callback function for when a shortcut is selected.
		// 
		function keyedUp_doSelectShortcut()
		{
			if (dlg.keysList.selection != null)
			{
//				alert(dlg.keysList.selection);
				// Initially disable all qualifier and key controls
				keyedUp_resetKeyControls(true);
				
				// Parse keys used in selected shortcut
				var keys = dlg.keysList.selection.toString().split("+");
				var matches;
				
				for (var i=0; i<keys.length; i++)
				{
					// Enable or disable qualifiers as they are found
					switch (keys[i])
					{
						case "Ctrl":
						case "Cmd":
							dlg.keyCtrlBtn.value = true;
							break;
						case "Alt":
						case "Option":
							dlg.keyAltBtn.value = true;
							break;
						case "Shift":
							dlg.keyShiftBtn.value = true;
							break;
						case "macControl":
							dlg.keyMCtrlBtn.value = true;
							break;
						default:
//							alert("found '"+keys[i]+"' at index "+keyedUp_getKeyListIndex(keys[i]));
							// Check for Unicode or PadUnicode key
							matches = keys[i].match(/(Pad)?Ux([0-9((a-f)|(A-F))]{4})/);
							if ((matches == null) || ((matches != null) && (matches.length != 3)))
							{
								// No match for Unicode/PadUnicode, so assume one of the existing keys
								dlg.keyMainList.selection = keyedUp_getKeyListIndex(keys[i]);
							}
							else
							{
								// For Unicode or PadUnicode, determine which and then display value
								dlg.keyMainList.selection = (matches[1] != "Pad") ? dlg.keyMainList.items.length-2 : dlg.keyMainList.items.length-1;
								dlg.keyCustKey.text = matches[2].toString();
								//dlg.keyCustKeyPrefix.enabled = true;
								//dlg.keyCustKey.enabled = true;a
							}
							break;
					}
				}
			}
			else
				keyedUp_resetKeyControls(false);
		}
		
		
		// keyedUp_doSelectKey()
		// Callback function for when a key is selected.
		// 
		function keyedUp_doSelectKey()
		{
			if (dlg.keyMainList.selection != null)
			{
				var enableUnicodeControls = ((dlg.keyMainList.selection.index == dlg.keyMainList.items.length-2) || (dlg.keyMainList.selection.index == dlg.keyMainList.items.length-1));
				
				// Enable or disable the Unicode field based on if the Unicode or PadUnicode key entry is selected
				dlg.keyCustKeyPrefix.enabled = enableUnicodeControls;
				dlg.keyCustKey.enabled = enableUnicodeControls;
				
				// Enable or disable the qualifier checkboxes if <unavailable> is deselected or selected
				var enableQualifiers = (dlg.keyMainList.selection.text != keyedUpData.strUnassigned);
				
				dlg.keyCtrlBtn.enabled = enableQualifiers;
				dlg.keyAltBtn.enabled = enableQualifiers;
				dlg.keyShiftBtn.enabled = enableQualifiers;
				dlg.keyMCtrlBtn.enabled = enableQualifiers;
				dlg.keyPlus.enabled = enableQualifiers;
				
 				dlg.conflictsBtn.enabled = enableQualifiers;
				dlg.updateBtn.enabled = true;
			}
		}
		
		
		// keyedUp_doUpdateBatchControls()
		// Callback function for when the Batch Replace dialog's controls are modified.
		// 
		function keyedUp_doUpdateBatchControls()
		{
			var batchDlg = this.parent;
			
			if (batchDlg == null)	// shouldn't occur, but good to have some error handling just in case things go off the rails
				return;
			
			var enableUnicodeControls, selectedLists=0;
			if (batchDlg.findList.selection != null)
			{
				enableUnicodeControls = ((batchDlg.findList.selection.index == batchDlg.findList.items.length-2) || (batchDlg.findList.selection.index == batchDlg.findList.items.length-1));
				batchDlg.keyCustKeyPrefix1.enabled = enableUnicodeControls;
				batchDlg.keyCustKey1.enabled = enableUnicodeControls;
				selectedLists++;
			}
			if (batchDlg.replaceList.selection != null)
			{
				enableUnicodeControls = ((batchDlg.replaceList.selection.index == batchDlg.replaceList.items.length-2) || (batchDlg.replaceList.selection.index == batchDlg.replaceList.items.length-1));
				batchDlg.keyCustKeyPrefix2.enabled = enableUnicodeControls;
				batchDlg.keyCustKey2.enabled = enableUnicodeControls;
				selectedLists++;
			}
			
			batchDlg.okBtn.enabled = (selectedLists == 2);
		}
		
		
		// keyedUp_doValidateUnicodeField()
		// Callback function for ensuring the Ux (Unicode) field has a valid value.
		// 
		function keyedUp_doValidateUnicodeField()
		{
			this.text = (this.text.replace(/[^0-9((a-f)|(A-F))]/g, "")).substr(0,4);
		}
		
		
		// keyedUp_showConflicts()
		// Function for searching all other commands that use the same shortcut key sequence.
		// 
		function keyedUp_showConflicts(catCode, cmdCode)
		{
			// Build the current shortcut string with enclosing parentheses
			var rawShortcut = keyedUp_buildShortcutStr();
			var newShortcut = "(" + rawShortcut + ")";
			
			// Search the current shortcuts looking for matching shortcuts, and display to the user
			var matches = "", cat, cmd;
			
			for (var c1=0; c1<keyedUpData.shortcuts.length; c1++)
			{
				cat = keyedUpData.shortcuts[c1];
				if (cat[1].substr(0,3) != "~~~")
				{
					for (var c2=0; c2<cat[2].length; c2++)
					{
						cmd = cat[2][c2];
						if (cmd[1].substr(0,3) == "~~~")
							continue;
						
						// If found a match, record the category and command it belongs to
						if ((cmd[2].indexOf(newShortcut) != -1) && !((cat[0] == catCode) && (cmd[0] == cmdCode)))
							matches += (cat[1] + "\n" + "        " + cmd[1] + "\n");
					}
				}
			}
			
			if (matches == "")
				alert(keyedUpData.strConflictsNone.replace(/%s/, rawShortcut), keyedUpData.scriptName);
			else
				alert(keyedUpData.strConflictsIntro.replace(/%s/, rawShortcut) + "\n\n" + matches, keyedUpData.scriptName);
		}
		
		
		// keyedUp_buildShortcutStr()
		// Function for assembling a platform-specific key sequence based on the user's current selections.
		// 
		function keyedUp_buildShortcutStr()
		{
			var newShortcut = "";
			
			if (dlg.keyCtrlBtn.value)
				newShortcut += (keyedUpData.onWindows ? "Ctrl+" : "Cmd+");
			if (dlg.keyAltBtn.value)
				newShortcut += (keyedUpData.onWindows ? "Alt+" : "Option+");
			if (dlg.keyShiftBtn.value)
				newShortcut += "Shift+";
			if (dlg.keyMCtrlBtn.value)
				newShortcut += "macControl+";
			
			// Handle Unicode/PadUnicode selection separately
			if (dlg.keyMainList.selection.index == dlg.keyMainList.items.length-2)
			{
				// Main keyboard Unicode
				newShortcut += ("Ux" + ("0000" + dlg.keyCustKey.text.toUpperCase()).substr(4+dlg.keyCustKey.text.length-4,4));
			}
			else if (dlg.keyMainList.selection.index == dlg.keyMainList.items.length-1)
			{
				// Numeric Keypad Unicode
				newShortcut += ("PadUx" + ("0000" + dlg.keyCustKey.text.toUpperCase()).substr(4+dlg.keyCustKey.text.length-4,4));
			}
			else
			{
				newShortcut += dlg.keyMainList.selection.toString();
			}
						
			return newShortcut;
		}
		
		
		// keyedUp_doUpdateShortcut()
		// Callback function for when the user wants to update the definition of the current key shortcut.
		// 
		function keyedUp_doUpdateShortcut()
		{
			if (dlg.keysList.selection != null)
			{
				var newShortcut = "";
				
				// Build the shortcut string (qualifier(s) + key)
				if (dlg.keyMainList.selection.text != keyedUpData.strUnassigned)
					newShortcut = keyedUp_buildShortcutStr();
				
//				alert("old: '"+dlg.keysList.selection.toString()+"'\nnew: '"+newShortcut+"'");
				// Assign new shortcut, and update command list
				// (for multi-shortcut commands, need to rebuild the entire list of shortcuts)
				var numShortcuts = dlg.keysList.items.length;
				var newShortcutsStr = "";
				for (var i=0; i<numShortcuts; i++)
				{
					if (dlg.keysList.selection.index == i)
						newShortcutsStr += "(" + newShortcut + ")";
					else
						newShortcutsStr += "(" + dlg.keysList.items[i].text + ")";
				}
				keyedUpData.shortcuts[dlg.catList.selection.index][2][dlg.cmdsList.selection.index][2] = newShortcutsStr;
				
				dlg.keysList.selection.text = ((newShortcut != "") ? newShortcut : keyedUpData.strUnassigned);
				
				// Mark the shortcuts as being modified
				keyedUpData.isModified = true;
			}
		}
		
		
		// keyedUp_doBatchReplace()
		// Callback function for replacing all occurrences of a particular key with another, which can be useful 
		// when a key doesn't exist or is cumbersome to use on the current keyboard.
		function keyedUp_doBatchReplace()
		{
			// Deselect selections in other lists
			dlg.keysList.selection = null;
			dlg.keysList.removeAll();
			dlg.cmdsList.selection = null;
			keyedUp_resetKeyControls(false);
			
			// Build/open the UI
			var batchDlg = new Window("dialog", keyedUpData.strBatchReplaceTitle, [230, 230, 610, 460]);
			if (batchDlg != null)
			{
				batchDlg.findLbl = batchDlg.add("statictext", [10, 10, batchDlg.bounds.width/2-10, 25], keyedUpData.strFind);
				batchDlg.findList = batchDlg.add("listbox", [batchDlg.findLbl.bounds.left, batchDlg.findLbl.bounds.bottom+2, batchDlg.findLbl.bounds.right, batchDlg.bounds.height-80], keyedUpData.baseKeys);
				batchDlg.findList.onChange = keyedUp_doUpdateBatchControls;
				
				batchDlg.keyCustKeyPrefix1 = batchDlg.add("statictext", [batchDlg.findList.bounds.left, batchDlg.findList.bounds.bottom+5+3, batchDlg.findList.bounds.left+16, batchDlg.findList.bounds.bottom+5+3+20], keyedUpData.strUnicodePrefix);
				batchDlg.keyCustKeyPrefix1.enabled = false;
				batchDlg.keyCustKey1 = batchDlg.add("edittext", [batchDlg.keyCustKeyPrefix1.bounds.right+5, batchDlg.keyCustKeyPrefix1.bounds.top-3, batchDlg.keyCustKeyPrefix1.bounds.right+5+45, batchDlg.keyCustKeyPrefix1.bounds.bottom-3], "0000");
				batchDlg.keyCustKey1.enabled = false;
				batchDlg.keyCustKey1.onChanging = keyedUp_doValidateUnicodeField;
				
				batchDlg.replaceLbl = batchDlg.add("statictext", [batchDlg.findLbl.bounds.right+20, 10, batchDlg.bounds.width-10, 25], keyedUpData.strReplace);
				batchDlg.replaceList = batchDlg.add("listbox", [batchDlg.replaceLbl.bounds.left, batchDlg.findLbl.bounds.bottom+2, batchDlg.replaceLbl.bounds.right, batchDlg.bounds.height-80], keyedUpData.baseKeys);
				batchDlg.replaceList.onChange = keyedUp_doUpdateBatchControls;
				
				batchDlg.keyCustKeyPrefix2 = batchDlg.add("statictext", [batchDlg.replaceList.bounds.left, batchDlg.replaceList.bounds.bottom+5+3, batchDlg.replaceList.bounds.left+16, batchDlg.replaceList.bounds.bottom+5+3+20], keyedUpData.strUnicodePrefix);
				batchDlg.keyCustKeyPrefix2.enabled = false;
				batchDlg.keyCustKey2 = batchDlg.add("edittext", [batchDlg.keyCustKeyPrefix2.bounds.right+5, batchDlg.keyCustKeyPrefix2.bounds.top-3, batchDlg.keyCustKeyPrefix2.bounds.right+5+45, batchDlg.keyCustKeyPrefix2.bounds.bottom-3], "0000");
				batchDlg.keyCustKey2.enabled = false;
				batchDlg.keyCustKey2.onChanging = keyedUp_doValidateUnicodeField;
				
				// Command buttons: Replace All, Cancel
				batchDlg.sep = batchDlg.add("panel", [10, batchDlg.bounds.height-40, batchDlg.bounds.width-10, batchDlg.bounds.height-38]);
				
				okBtnLeftEdge = (keyedUpData.onWindows) ? batchDlg.bounds.width-180 : batchDlg.bounds.width-100;
				cancelBtnLeftEdge = (keyedUpData.onWindows) ? batchDlg.bounds.width-80 : batchDlg.bounds.width-180;
				batchDlg.okBtn = batchDlg.add("button", [okBtnLeftEdge, batchDlg.bounds.height-30, okBtnLeftEdge+90, batchDlg.bounds.height-10], keyedUpData.strReplaceAll);
				batchDlg.okBtn.onClick = function ()
				{
					var bDlg = this.parent;
					var fromKey, toKey;
					
					// Get the representation of the from (Find) and to (Replace) keys
					
					// Handle Unicode/PadUnicode selection separately
					if (bDlg.findList.selection.index == bDlg.findList.items.length-2)
					{
						// Main keyboard Unicode
						fromKey = ("Ux" + ("0000" + bDlg.keyCustKey1.text.toUpperCase()).substr(4+bDlg.keyCustKey1.text.length-4,4));
					}
					else if (bDlg.findList.selection.index == bDlg.findList.items.length-1)
					{
						// Numeric Keypad Unicode
						fromKey = ("PadUx" + ("0000" + bDlg.keyCustKey1.text.toUpperCase()).substr(4+bDlg.keyCustKey1.text.length-4,4));
					}
					else
					{
						fromKey = bDlg.findList.selection.toString();
					}
					fromKey += ")";	// Append ')' for stricter matching
					
					// Handle Unicode/PadUnicode selection separately
					if (bDlg.replaceList.selection.index == bDlg.replaceList.items.length-2)
					{
						// Main keyboard Unicode
						toKey = ("Ux" + ("0000" + bDlg.keyCustKey2.text.toUpperCase()).substr(4+bDlg.keyCustKey2.text.length-4,4));
					}
					else if (bDlg.replaceList.selection.index == bDlg.replaceList.items.length-1)
					{
						// Numeric Keypad Unicode
						toKey = ("PadUx" + ("0000" + bDlg.keyCustKey2.text.toUpperCase()).substr(4+bDlg.keyCustKey2.text.length-4,4));
					}
					else
					{
						toKey = bDlg.replaceList.selection.toString();
					}
					toKey += ")";		// Append '\)' for stricter matching
					
					// Perform the batch replacement
					//alert("batch replace: "+fromKey+" with "+toKey);
					var opsList, opStr;
					for (var i=0; i<keyedUpData.shortcuts.length; i++)
					{
						opsList = keyedUpData.shortcuts[i][2];
						for (var j=0; j<opsList.length; j++)
						{
							opStr = opsList[j][2];
							while (opStr.indexOf(fromKey) != -1)
								opStr = opStr.replace(fromKey, toKey);
							opsList[j][2] = opStr;
						}
					}
					
					// Mark the shortcuts as being modified
					keyedUpData.isModified = true;
					
					// Close the dialog box
					bDlg.close();
				}
				batchDlg.okBtn.enabled = false;
				batchDlg.cancelBtn = batchDlg.add("button", [cancelBtnLeftEdge, batchDlg.bounds.height-30, cancelBtnLeftEdge+70, batchDlg.bounds.height-10], keyedUpData.strCancel);
				batchDlg.cancelBtn.onClick = function () {this.parent.close();}

				//batchDlg.center();
				batchDlg.show();
			}
		}
		
		
		// keyedUp_doSaveHTML()
		// Callback function for exporting the current shortcuts as a web (HTML) page.
		// 
		function keyedUp_doSaveHTML()
		{
			// Ask for the file name under which to save the current shortcuts
			var htmlFile = File.saveDialog(keyedUpData.strSaveAsHTML, "HTML Files:*.html;*.htm,All Files:*.*");
			if (htmlFile != null)
			{
				// Check if overwriting an existing file
				if (htmlFile.exists)
					if (!confirm(keyedUpData.strOverwriteFile, keyedUpData.scriptName))
						return;
				
				htmlFile.open("w");
				
				htmlFile.writeln("<html>");
				htmlFile.writeln("<head>");
				htmlFile.writeln("\t<title>" + keyedUpData.scriptName + ": Current Shortcuts</title>");
				htmlFile.writeln("\t<style type=\"text/css\">");
				htmlFile.writeln("\t\tbody {font-family: sans-serif;}");
				htmlFile.writeln("\t\th2 {margin-top: 1.5em;}");
				htmlFile.writeln("\t\ttable {margin-left: 2em; border-bottom: 1px solid #333333;}");
				htmlFile.writeln("\t\tth {text-align: left; vertical-align: top; border-bottom: 1px solid #333333; padding-right: 1em;}");
				htmlFile.writeln("\t\ttd {text-align: left; vertical-align: top; padding-right: 1em;}");
				htmlFile.writeln("\t\t.shaded {background-color: #eeeeee;}");
				htmlFile.writeln("\t</style>");
				htmlFile.writeln("</head>");
				htmlFile.writeln("<body>");
				
				htmlFile.writeln("\t<h1>" + keyedUpData.scriptName + ": Current Shortcuts</h1>");
				//htmlFile.writeln("\t<p>major_version = " + keyedUpData.savedShortcutsFileVer + "</p>");
				
				var catStr, cmdStr, keysStr, shadedStr;
				for (var cat=0; cat<keyedUpData.shortcuts.length; cat++)
				{
					catStr = keyedUpData.shortcuts[cat][1]
					if (catStr.substr(0,3) == "~~~")		// Skip hidden categories
						continue;
					
					htmlFile.writeln("\t<h2>" + catStr + "</h2>");
					
					htmlFile.writeln("\t<table>");
					htmlFile.writeln("\t\t<tr><th>Command</th><th>Shortcuts</th></tr>");
					
					maxCmds = keyedUpData.shortcuts[cat][2];
					for (var cmd=0; cmd<maxCmds.length; cmd++)
					{
						cmdStr = maxCmds[cmd][1];
						if (cmdStr.substr(0,3) == "~~~")		// Skip hidden commands
							continue;
						
						keysStr = maxCmds[cmd][2];
						keysStr = keysStr.replace(/\((Ctrl|Cmd)/g, "("+keyedUpData.strCtrl);
						keysStr = keysStr.replace(/\+(Ctrl|Cmd)/g, "+"+keyedUpData.strCtrl);
						keysStr = keysStr.replace(/(Alt|Option)/g, keyedUpData.strAlt);
						keysStr = keysStr.replace(/(Mac)Ctrl/g, keyedUpData.strMacCtrl);
						keysStr = keysStr.replace(/(^\()|(\)$)/g, "");
						keysStr = keysStr.replace(/\)\(/g, ", ");
						
						shadedStr = (cmd % 2) ? "" : " class=\"shaded\"";
						htmlFile.writeln("\t\t<tr><td" + shadedStr + ">" + cmdStr + "</td><td" + shadedStr + ">" + keysStr + "</td></tr>");
					}
					htmlFile.writeln("\t</table>");
				}
				
				htmlFile.writeln("</body>");
				htmlFile.writeln("</html>");
				
				htmlFile.close();
				
				// Launch HTML page using default browser
				htmlFile.execute();
			}
		}
		
		
		// keyedUp_doSaveAsShortcuts()
		// Callback function for when the current shortcuts should be saved to disk under a custom file name.
		// 
		function keyedUp_doSaveAsShortcuts()
		{
			// Ask for the file name under which to save the current shortcuts
			var saveFile = File.saveDialog(keyedUpData.strSaveShortcutsAs);
			if (saveFile != null)
			{
				// Check if overwriting an existing file
				if (saveFile.exists)
					if (!confirm(keyedUpData.strOverwriteFile, keyedUpData.scriptName))
						return;
				
				keyedUp_saveShortcutsToFile(saveFile.fsName);
			}
		}
		
		
		// keyedUp_doMergeShortcuts()
		// Callback function for merging a selected shortcut file's shortcuts with the current set.
		// 
		function keyedUp_doMergeShortcuts()
		{
			// If the current shortcuts have been modified, ask if they should be saved first
			if (keyedUpData.isModified)
			{
				if (confirm(keyedUpData.strSaveChanges, keyedUpData.scriptName))
				{
					keyedUp_saveShortcutsToFile(keyedUpData.shortcutsFName);
					keyedUpData.isModified = false;
				}
			}
			
			// Ask for the name of the file to merge
			var mergeFile = File.openDialog(keyedUpData.strSelectShortcutsToMerge);
			if ((mergeFile != null) && mergeFile.exists)
			{
				var keysMerged = keyedUp_loadKeys(mergeFile.fsName, false);
				
				if (!keysMerged)
					alert(keyedUpData.strErrCantMergeShortcutsFile.replace(/%s/, mergeFile.fsName), keyedUpData.scriptName);
			}
		}
		
		
		// keyedUp_doLoadShortcuts()
		// Callback function for loading a fresh set of shortcuts from a shortcuts file.
		// 
		function keyedUp_doLoadShortcuts()
		{
			// If the current shortcuts have been modified, ask if they should be saved first
			if (keyedUpData.isModified)
			{
				if (confirm(keyedUpData.strSaveChanges, keyedUpData.scriptName))
				{
					keyedUp_saveShortcutsToFile(keyedUpData.shortcutsFName);
					keyedUpData.isModified = false;
				}
			}
			
			// Ask for the name of the file to load
			var loadFile = File.openDialog(keyedUpData.strSelectShortcutsToLoad);
			if ((loadFile != null) && loadFile.exists)
			{
				var keysLoaded = keyedUp_loadKeys(loadFile.fsName, true);
				
				if (!keysLoaded)
				{
					alert(keyedUpData.strErrCantLoadShortcutsFile.replace(/%s/, loadFile.fsName), keyedUpData.scriptName);
					keyedUp_loadKeys(keyedUpData.shortcutsFName, true);	// Assume the restore will work (yeah, I know)
				}
			}
		}
		
		
		// keyedUp_saveShortcutsToFile()
		// Function for saving the current shortcuts to a specified file.
		// 
		function keyedUp_saveShortcutsToFile(filename)
		{
			// Write out the new shortcuts
			var newShortcutsFile = new File(filename);
			
			if (newShortcutsFile != null)
			{
				newShortcutsFile.open("w");
				
				// ...Write out the header comments
				for (var i=0; i<keyedUpData.headerComments.length; i++)
					newShortcutsFile.writeln(keyedUpData.headerComments[i]);
				
				// ...Write out the header section
				newShortcutsFile.writeln();
				newShortcutsFile.writeln();
				newShortcutsFile.writeln("[\"** header **\"]");
				newShortcutsFile.writeln("	\"major_version\" = \"" + keyedUpData.savedShortcutsFileVer + "\"");
				
				// ...Write out the actual categories/commands/shortcuts
				var maxCmds, shortcutsStr, remainingStr;
				for (var cat=0; cat<keyedUpData.shortcuts.length; cat++)
				{
					newShortcutsFile.writeln();
					newShortcutsFile.writeln("[\"" + keyedUpData.shortcuts[cat][0] + "\"]");
					
					maxCmds = keyedUpData.shortcuts[cat][2];
					for (var cmd=0; cmd<maxCmds.length; cmd++)
					{
						shortcutsStr = maxCmds[cmd][2];
						
						// Break up string longer than 80 characters into separate lines (78 chars for subsequent lines), to match the existing format
						if (shortcutsStr.length <= 80)
						{
							newShortcutsFile.writeln("	\"" + maxCmds[cmd][0] + "\" = \"" + shortcutsStr.substr(0,80) + "\"");
						}
						else
						{
							newShortcutsFile.write("	\"" + maxCmds[cmd][0] + "\" = \"" + shortcutsStr.substr(0,80) + "\"");
							shortcutsStr = shortcutsStr.substr(80,shortcutsStr.length-80);
							while (shortcutsStr.length > 0)
							{
								newShortcutsFile.writeln("\\");		// Finish off the previous line with a slash
								newShortcutsFile.write("		\"" + shortcutsStr.substr(0,78) + "\"");
								shortcutsStr = shortcutsStr.substr(78,shortcutsStr.length-78);
							}
							newShortcutsFile.writeln();		// Finish off the last line, with no slash
						}
					}
				}
				
				newShortcutsFile.writeln();
				newShortcutsFile.close();
			}
		}
		
		
		// keyedUp_doSaveShortcuts()
		// Callback function for saving the current set of shortcuts to disk.
		// 
		function keyedUp_doSaveShortcuts()
		{
			if (shortcutsFile != null)
			{
				// Back up the existing shortcuts file (if it exists...which it should)
				if (shortcutsFile.exists)
				{
					if (!shortcutsFile.copy(shortcutsFile.fsName + ".bak"))
						alert(keyedUpData.strErrCantBackupShortcutsFile.replace(/%s/, shortcutsFile.fsName), keyedUpData.scriptName);
				}
				
				keyedUp_saveShortcutsToFile(shortcutsFile.fsName);
				keyedUpData.isModified = false;
				
				alert(keyedUpData.strRestartAE, keyedUpData.scriptName);
				
				// Store the shortcut file's name for use in the next session
				app.settings.saveSetting("Adobe", "keyedUp_shortcutsFName", shortcutsFile.fsName);
			}
			
			dlg.close();	// Seems to be required for CS3
		}
		
		
		// keyedUp_doCancel()
		// Callback function for cancel the operation and discard any changes made.
		// 
		function keyedUp_doCancel()
		{
			if (shortcutsFile != null)
			{
				// Check if any changes were made
				if (keyedUpData.isModified)
				{
					if (confirm(keyedUpData.strSaveChanges, keyedUpData.scriptName))
						keyedUp_doSaveShortcuts();
				}
				
				// Store the shortcut file's name for use in the next session
				app.settings.saveSetting("Adobe", "keyedUp_shortcutsFName", shortcutsFile.fsName);
			}
			
			dlg.close();	// Seems to be required for CS3
		}
		
		
		// main:
		// 
		if (keyedUpData.aeVersion < 9)
		{
			alert(keyedUpData.strErrMinAE90, keyedUpData.scriptName);
			return;
		}
		else
		{
			// Check that we'll be able to save to disk
			if (app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1)
			{
				alert(keyedUpData.strErrSecurityPrefNotEnabled, keyedUpData.scriptName);
				return;
			}
			
			// Build and show the UI
			var dlg = keyedUp_buildUI();
			if (dlg != null)
			{
				// Update UI values, if saved in the settings
				var shortcutsFile = null, shortcutsFileName = null;
				var keysLoaded = false;
				
				if (app.settings.haveSetting("Adobe", "keyedUp_shortcutsFName"))
				{
					shortcutsFile = new File(app.settings.getSetting("Adobe", "keyedUp_shortcutsFName").toString());
					shortcutsFileName = shortcutsFile.name;
				}
				else
				{
					// Find the shortcuts file name (based on language and app version)
					var appVers = app.version.match(/(\d+\.\d+).*/);	// Match the major version number (so 7.0.1 --> 7.0)
					if (appVers != null)
					{
						appVers = appVers[1];
						
						// For AE CS4 or later, use app.isoLanguage
						switch (app.isoLanguage)
						{
							case "fr_FR":
								shortcutsFileName = "Adobe After Effects " + appVers + " Raccourcis" + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "de_DE":
								shortcutsFileName = "Adobe After Effects " + appVers + " Tastaturbefehle" + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "it_IT":
								shortcutsFileName = "Scelte rapide di Adobe After Effects " appVers + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "ja_JP":
								shortcutsFileName = "Adobe After Effects " + appVers + " ショートカット" + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "es_ES":
								shortcutsFileName = "Métodos abreviados Adobe After Effects " + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "en_US":
								shortcutsFileName = "Adobe After Effects " + appVers + " Shortcuts" + (keyedUpData.onWindows ? ".txt" : "");
								break;
							case "ko_KR":
								shortcutsFileName = "Adobe After Effects " + appVers + " 단축키" + (keyedUpData.onWindows ? ".txt" : "");
								break;
							default:
								break;
						}
					}
				}
				
				// Ask user to locate shortcuts file, if it wasn't determined automatically
				while (!keysLoaded)
				{
					if (shortcutsFileName == null)
						shortcutsFile = File.openDialog("Locate the After Effects Shortcuts file");
					else if (shortcutsFile == null)
					{
						if (keyedUpData.onWindows)
							shortcutsFile = new File(Folder.userData.fsName + "/Adobe/After Effects/" + appVers + "/" + shortcutsFileName);
						else
							shortcutsFile = new File("~/Library/Preferences/Adobe/After Effects/" + appVers + "/" + shortcutsFileName);
					}
					
					if (shortcutsFile != null)
					{
						if (shortcutsFile.exists)
						{
							keyedUpData.shortcutsFName = shortcutsFile.fsName;
							keysLoaded = keyedUp_loadKeys(shortcutsFile.fsName, true);
						}
						
						// Show the UI, if keys were loaded OK
						if (keysLoaded)
						{
							// The shortcuts we save will use the version number that we loaded
							keyedUpData.savedShortcutsFileVer = keyedUpData.loadedShortcutsFileVer;
							
							// Show the UI
							//dlg.center();
							dlg.show();
						}
						else
						{
							if (!shortcutsFile.exists)
							{
								// If couldn't find shortcuts file, maybe the shortcuts haven't be saved yet
								// (such as when you haven't quit AE once before).
								alert(keyedUpData.strErrMissingShortcutsFile.replace(/%s/, shortcutsFile.fsName), keyedUpData.scriptName);
							}
							else
							{
								// If error loading shortcuts, retry selecting the file
								alert(keyedUpData.strErrMinShortcutsFileVer, keyedUpData.scriptName);
							}
							shortcutsFile = null;
							shortcutsFileName = null;
						}
					}
					else
						break;
				}
			}
		}
	}
	
	KeyEd_Up();
}