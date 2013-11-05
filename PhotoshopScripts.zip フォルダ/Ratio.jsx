/* 
<javascriptresource>
<name>Ratio</name>
<category>web</category>
</javascriptresource>
*/


var savedState = activeDocument.activeHistoryState,
	firstRun = true;


var arg = "dialog {\
alignChildren: 'fill',\
orientation: 'column',\
ratios: Panel { alignChildren: 'left',\
	text: '比率',\
	ratioGp: Group {\
		orientation: 'row',\
		golden: RadioButton {text: '黄金比', value:true},\
		yamato: RadioButton {text: '大和比'}\
	}\
},\
other: Panel { orientation: 'column', alignChildren: 'left',\
	text: 'その他',\
	rectPosGp: Group { orientation: 'row',\
		s:StaticText { text: '正方形の位置'},\
		posGp: Group { orientation: 'row',\
			l:RadioButton {text: '左', value:true},\
			r:RadioButton {text: '右'}\
		}\
	},\
	ColorGp: Group { orientation: 'row',\
		s:StaticText { text: '色' },\
		colorRect:Group { size:[70,43] , s:StaticText { text:''} }\
	}\
},\
btnGp: Group { alignment: 'right', orientation: 'row',\
	okbtn: Button {text:'OK'},\
	applybtn: Button {text:'Apply'},\
	cbtn: Button {text:'Cancel'}\
	}\
}";

var win = new Window(arg,"Ratio");
var colorRect = win.other.ColorGp.colorRect;
var colorRectGraphics = colorRect.graphics;

var leftTop = win.other.rectPosGp.posGp.l,
rightBottom = win.other.rectPosGp.posGp.r,
squareColor = [foregroundColor.rgb.red,foregroundColor.rgb.green,foregroundColor.rgb.blue];

colorRect.onClick = function()
{
	var original_rgb = foregroundColor.rgb;
	showColorPicker();
	var rgb = foregroundColor.rgb;
	var r = rgb.red/255;
	var g = rgb.green/255;
	var b = rgb.blue/255;

	var color = colorRectGraphics.newBrush(colorRectGraphics.BrushType.SOLID_COLOR,[r,g,b]);
	colorRectGraphics.backgroundColor = color;

	foregroundColor.rgb = original_rgb;
	squareColor=[rgb.red, rgb.green, rgb.blue];
}

var color = colorRectGraphics.newBrush(colorRectGraphics.BrushType.SOLID_COLOR,[foregroundColor.rgb.red/255,foregroundColor.rgb.green/255,foregroundColor.rgb.blue/255]);
colorRectGraphics.backgroundColor=color;


function init()
{
	var aLayer = activeDocument.activeLayer;
	var myLayer = new MyLayer(aLayer);
	var HV = (myLayer.width / myLayer.height >= 1) ? "H" : "V";

	if(HV == "V")
	{
		//位置のテキストの変更
		leftTop.text = "上";
		rightBottom.text = "下";
	}

	return HV;

}
var HV = init(); //縦横のどちらを拡張するか
function getAllParameter()
{
	var parameter={squareColor:squareColor};
	//正方形の位置
	if(win.ratios.ratioGp.golden.value)
	{
		parameter.ratio = 1.618;  //golden
	}
	else
	{
		parameter.ratio = 1.414;  //sliver
	}

	if(HV=="H")
	{
		if(leftTop.value){ parameter.position="left"; } else { parameter.position="right"; }
	}
	else
	{
		if(leftTop.value){ parameter.position="top"; } else { parameter.position="bottom"; }
	}
	return parameter;
}

win.btnGp.okbtn.onClick = function(){
	if(firstRun)
	{
		var parameter = getAllParameter();
		var ratio = parameter.ratio,
			fill = parameter.squareColor,
			squarePos = parameter.position;

		activeDocument.suspendHistory('Ratio', 'main(HV,ratio,fill,squarePos)');
		win.close();
	}
	else
	{
		win.close();
	}
};

win.btnGp.applybtn.onClick = function(){
	if(firstRun){ firstRun=false; }else{ activeDocument.activeHistoryState = savedState; }
	var parameter = getAllParameter();
	var ratio = parameter.ratio,
		fill = parameter.squareColor,
		squarePos = parameter.position;
			
	activeDocument.suspendHistory('Ratio', 'main(HV,ratio,fill,squarePos)');
};

win.btnGp.cbtn.onClick = function(){
	activeDocument.activeHistoryState = savedState;
	win.close();
};


win.show();



//------------------ functions ----------------------

/*            MyLayer (Class)          */

function getSize(layer)
{
	var height = parseInt (layer.bounds[3]) - parseInt (layer.bounds[1]);
	var width = parseInt (layer.bounds[2]) - parseInt (layer.bounds[0]);
	return {height:height, width:width};
}

function getPosition(layer)
{

	var left = parseInt(layer.bounds[0]);
	var top = parseInt(layer.bounds[1]);
	
	return {left:left,top:top};

}

  // Class statement
  function MyLayer(layer)
  {
  	var size = getSize(layer),
  	position = getPosition(layer);

  	this.layer = layer;
  	this.width = size.width;
  	this.height = size.height;
  	this.left = position.left;
  	this.top = position.top;
  }

  MyLayer.prototype.translate = function(x,y){
  	this.layer.translate(x - this.left , y - this.top);
  }

  /*            MyLayer (Class) end          */

//================================= functions ======================================

function addGroup(groupName)
{
	var newgroup = activeDocument.layerSets.add();
	if(groupName)
	{
		newgroup.name = groupName;
	}
	return newgroup;
}

function addLayer(layerName)
{
	var newlayer = activeDocument.artLayers.add();
	if(layerName)
	{
		newlayer.name = layerName;
	}
	return newlayer;
}

//...................................................................................
//location : {x,y,width,height}
//property : {fillcolor,strokeWidth,strokeColor}
function rectangle(location , property){
	var defaultProperty = { fillcolor:[0,0,0] , strokeWidth:1 , strokeColor:[0,0,0] },
	fill = true,
	stroke = true,
	fillcolor,
	strokeWidth,
	strokeColor,
	bounds={};

	if(property)
	{
		fillcolor = property.fillcolor ? property.fillcolor : defaultProperty.fillcolor;
		strokeWidth = property.strokeWidth ? property.strokeWidth : defaultProperty.strokeWidth;
		strokeColor = property.strokeColor ? property.strokeColor : defaultProperty.strokeColor;
		if(!property.fillcolor){ fill = false; }
		if(!property.strokeWidth){ stroke = false; }
	}
	else
	{
		fillcolor = defaultProperty.fillcolor;
		strokeWidth = defaultProperty.strokeWidth;
		strokeColor = defaultProperty.strokeColor;
	}


	bounds.top = location.y;
	bounds.left = location.x;
	bounds.bottom = location.y + location.height;
	bounds.right = location.x + location.width;

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
var desc209 = new ActionDescriptor();
var idnull = charIDToTypeID( "null" );
var ref87 = new ActionReference();
var idcontentLayer = stringIDToTypeID( "contentLayer" );
ref87.putClass( idcontentLayer );
desc209.putReference( idnull, ref87 );
var idUsng = charIDToTypeID( "Usng" );
var desc210 = new ActionDescriptor();
var idType = charIDToTypeID( "Type" );
var desc211 = new ActionDescriptor();
var idClr = charIDToTypeID( "Clr " );
var desc212 = new ActionDescriptor();
var idRd = charIDToTypeID( "Rd  " );
desc212.putDouble( idRd, fillcolor[0] );
var idGrn = charIDToTypeID( "Grn " );
desc212.putDouble( idGrn, fillcolor[1] );
var idBl = charIDToTypeID( "Bl  " );
desc212.putDouble( idBl, fillcolor[2] );
var idRGBC = charIDToTypeID( "RGBC" );
desc211.putObject( idClr, idRGBC, desc212 );
var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
desc210.putObject( idType, idsolidColorLayer, desc211 );
var idShp = charIDToTypeID( "Shp " );
var desc213 = new ActionDescriptor();
var idTop = charIDToTypeID( "Top " );
var idPxl = charIDToTypeID( "#Pxl" );
desc213.putUnitDouble( idTop, idPxl, bounds.top );
var idLeft = charIDToTypeID( "Left" );
var idPxl = charIDToTypeID( "#Pxl" );
desc213.putUnitDouble( idLeft, idPxl, bounds.left );
var idBtom = charIDToTypeID( "Btom" );
var idPxl = charIDToTypeID( "#Pxl" );
desc213.putUnitDouble( idBtom, idPxl, bounds.bottom );
var idRght = charIDToTypeID( "Rght" );
var idPxl = charIDToTypeID( "#Pxl" );
desc213.putUnitDouble( idRght, idPxl, bounds.right );
var idRctn = charIDToTypeID( "Rctn" );
desc210.putObject( idShp, idRctn, desc213 );
var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
var desc214 = new ActionDescriptor();
var idstrokeStyleVersion = stringIDToTypeID( "strokeStyleVersion" );
desc214.putInteger( idstrokeStyleVersion, 2 );
var idstrokeEnabled = stringIDToTypeID( "strokeEnabled" );
desc214.putBoolean( idstrokeEnabled, stroke );
var idfillEnabled = stringIDToTypeID( "fillEnabled" );
desc214.putBoolean( idfillEnabled, fill );
var idstrokeStyleLineWidth = stringIDToTypeID( "strokeStyleLineWidth" );
var idPxl = charIDToTypeID( "#Pxl" );
desc214.putUnitDouble( idstrokeStyleLineWidth, idPxl, strokeWidth );
var idstrokeStyleLineDashOffset = stringIDToTypeID( "strokeStyleLineDashOffset" );
var idPnt = charIDToTypeID( "#Pnt" );
desc214.putUnitDouble( idstrokeStyleLineDashOffset, idPnt, 0.000000 );
var idstrokeStyleMiterLimit = stringIDToTypeID( "strokeStyleMiterLimit" );
desc214.putDouble( idstrokeStyleMiterLimit, 100.000000 );
var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
var idstrokeStyleButtCap = stringIDToTypeID( "strokeStyleButtCap" );
desc214.putEnumerated( idstrokeStyleLineCapType, idstrokeStyleLineCapType, idstrokeStyleButtCap );
var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
var idstrokeStyleMiterJoin = stringIDToTypeID( "strokeStyleMiterJoin" );
desc214.putEnumerated( idstrokeStyleLineJoinType, idstrokeStyleLineJoinType, idstrokeStyleMiterJoin );
var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
var idstrokeStyleAlignInside = stringIDToTypeID( "strokeStyleAlignInside" );
desc214.putEnumerated( idstrokeStyleLineAlignment, idstrokeStyleLineAlignment, idstrokeStyleAlignInside );
var idstrokeStyleScaleLock = stringIDToTypeID( "strokeStyleScaleLock" );
desc214.putBoolean( idstrokeStyleScaleLock, false );
var idstrokeStyleStrokeAdjust = stringIDToTypeID( "strokeStyleStrokeAdjust" );
desc214.putBoolean( idstrokeStyleStrokeAdjust, false );
var idstrokeStyleLineDashSet = stringIDToTypeID( "strokeStyleLineDashSet" );
var list16 = new ActionList();
desc214.putList( idstrokeStyleLineDashSet, list16 );
var idstrokeStyleBlendMode = stringIDToTypeID( "strokeStyleBlendMode" );
var idBlnM = charIDToTypeID( "BlnM" );
var idNrml = charIDToTypeID( "Nrml" );
desc214.putEnumerated( idstrokeStyleBlendMode, idBlnM, idNrml );
var idstrokeStyleOpacity = stringIDToTypeID( "strokeStyleOpacity" );
var idPrc = charIDToTypeID( "#Prc" );
desc214.putUnitDouble( idstrokeStyleOpacity, idPrc, 100.000000 );
var idstrokeStyleContent = stringIDToTypeID( "strokeStyleContent" );
var desc215 = new ActionDescriptor();
var idClr = charIDToTypeID( "Clr " );
var desc216 = new ActionDescriptor();
var idRd = charIDToTypeID( "Rd  " );
desc216.putDouble( idRd, strokeColor[0] );
var idGrn = charIDToTypeID( "Grn " );
desc216.putDouble( idGrn, strokeColor[1] );
var idBl = charIDToTypeID( "Bl  " );
desc216.putDouble( idBl, strokeColor[2] );
var idRGBC = charIDToTypeID( "RGBC" );
desc215.putObject( idClr, idRGBC, desc216 );
var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
desc214.putObject( idstrokeStyleContent, idsolidColorLayer, desc215 );
var idstrokeStyleResolution = stringIDToTypeID( "strokeStyleResolution" );
desc214.putDouble( idstrokeStyleResolution, 300.000000 );
var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
desc210.putObject( idstrokeStyle, idstrokeStyle, desc214 );
var idcontentLayer = stringIDToTypeID( "contentLayer" );
desc209.putObject( idUsng, idcontentLayer, desc210 );
executeAction( idMk, desc209, DialogModes.NO );
}


//========================= main ==========================

function main(HV,ratio,fill,squarePos)
{

	var aLayer = activeDocument.activeLayer;
	var myLayer = new MyLayer(aLayer);
	
	

	var
	width, height,
	square_width, square_height,
	rect_width, rect_height,
	fill_square=[];

	for(var i=0;i<fill.length;i++)
	{
		fill_square[i] = fill[i]+30<=255 ? fill[i]+30 : 255;
	}


	if(HV == "H")
	{
		width = myLayer.width;
		height = myLayer.width/ratio;

		//square's width
		square_height = square_width = height;
		
		//rectangle's width & height
		rect_width = width - square_width;
		rect_height = square_height;
	}
	else
	{
		height = myLayer.height;
		width = myLayer.height/ratio;

		//square's width
		square_height = square_width = width;

		//rectangle's width & height
		rect_height = height - square_height;
		rect_width = square_width;
	}

	addGroup("Ratio");
	//rectangle( { x:myLayer.left , y:myLayer.top , width:width , height:height },{fillcolor:fill} );
	
	switch (squarePos)
	{
		case "left" :
		//draw square
		rectangle( {x:myLayer.left , y:myLayer.top, width:square_width, height:square_height},{fillcolor:fill_square} );
		//draw rectangle
		rectangle( {x:myLayer.left+square_width , y:myLayer.top, width:rect_width, height:rect_height},{fillcolor:fill} );
		break;

		case "right" :
		//draw square
		rectangle( {x:(myLayer.left+(myLayer.width-square_width)) , y:myLayer.top, width:square_width, height:square_height},{fillcolor:fill_square} );
		//draw rectangle
		rectangle( {x:myLayer.left , y:myLayer.top, width:rect_width, height:rect_height},{fillcolor:fill} );
		break;

		case "top" :
		//draw square
		rectangle( {x:myLayer.left , y:myLayer.top, width:square_width, height:square_height},{fillcolor:fill_square} );
		//draw rectangle
		rectangle( {x:myLayer.left , y:myLayer.top+square_height, width:rect_width, height:rect_height},{fillcolor:fill} );
		break;

		case "bottom" :
		//draw square
		rectangle( {x:myLayer.left , y:(myLayer.top+(myLayer.height-square_height)), width:square_width, height:square_height},{fillcolor:fill_square} );
		//draw rectangle
		rectangle( {x:myLayer.left , y:myLayer.top, width:rect_width, height:rect_height},{fillcolor:fill} );
		break;
	}
	

	aLayer.remove();
	refresh();
}