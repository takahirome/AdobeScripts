//////////////////////////////////////////////////
//
// 選択したレイヤー以外を非表示 ver0.1
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// var
//////////////////////////////////////////////////
var document = activeDocument;
var active = document.activeLayer;

var visibilityList;
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function main(){
	var visibilityList = new Array();
	visibilityList = getVisibilityList(active);

	selectAllLayers();
	hideLayers();

	setVisibilityList(active, visibilityList);

	displayParentLayers(active);
	selectLayer(active);	
}

//アクションIDの取得
//ref: http://morris-photographics.com/photoshop/scripts/index.html
function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}

//全てのレイヤーを選択
function selectAllLayers() {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	desc.putReference(cTID("null"), ref);
	executeAction(sTID("selectAllLayers"), desc, DialogModes.NO);
}

//指定したレイヤーを選択
function selectLayer(obj) {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putName(cTID("Lyr "), obj.name );
	desc.putReference(cTID("null"), ref);
	executeAction( cTID("slct"), desc, DialogModes.NO );
}

//選択したレイヤーを非表示
function hideLayers() {
	var desc = new ActionDescriptor();
	var list = new ActionList();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	list.putReference(ref);
	desc.putList(cTID("null"), list);
	executeAction(cTID("Hd  "), desc, DialogModes.NO);
}

//指定したレイヤーの親レイヤーを表示
function displayParentLayers(obj){
	var parentLayer = obj.parent
	parentLayer.visible = true;

	if(parentLayer != activeDocument){
		displayParentLayers(parentLayer);
	}else{
		return;
	}
}

//指定したレイヤー以下の表示状態を取得
function getVisibilityList(obj){
	var list = new Array();

	list.push(obj.visible);

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			list = list.concat(getVisibilityList(obj.layers[i]));
		}
	}
	return list;
}

//指定したレイヤー以下の表示状態をリストから反映
function setVisibilityList(obj, list){
	obj.visible = list.shift();

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			setVisibilityList(obj.layers[i], list);
		}
	}
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
main();
