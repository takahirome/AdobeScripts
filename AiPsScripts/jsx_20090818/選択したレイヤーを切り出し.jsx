//////////////////////////////////////////////////
//
// 選択したレイヤーを切り出し ver0.2
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// const
//////////////////////////////////////////////////
var DEFAULT_LIMIT = 255;
//////////////////////////////////////////////////
// var
//////////////////////////////////////////////////
var document = activeDocument;
var active = document.activeLayer;

var tempLayerComp;
var newDocument;

var visibilityList = new Array();

var copyFlag;
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function start(){
	checkNumberOfLayers(DEFAULT_LIMIT);
}
//レイヤー数の確認
function checkNumberOfLayers(limit){
	var num = getNumberOfLayers();
	if(num >  limit){
		try {
			var dlg = new Window("dialog");
			dlg.text = "レイヤー数の確認";
			dlg.alignChildren = "left";

			dlg.add("statictext", undefined, "総レイヤー数:"+num);
			dlg.add("statictext", undefined, "レイヤー数が"+limit+"を超えています。このまま実行すると動作が遅くなる可能性があります。");
			dlg.add("statictext", undefined, "このまま操作を続けますか？");
			
			var buttons = dlg.add("group");
			buttons.orientation = "row";
			buttons.alignment = "center";

				var okBtn = buttons.add("button");
				okBtn.text = "OK";
				okBtn.properties = {name: "ok"};

				var cancelBtn = buttons.add("button");
				cancelBtn.text = "Cancel";
				cancelBtn.properties = {name: "cancel"};

			dlg.center();
			// end dialog layout
			if (dlg.show() == 1) {
				main();
			}else{
				//alert("操作を中止しました。");
			}
		}catch(e) {
		}
	}else{
		main();
	}
}

//総レイヤー数を取得
function getNumberOfLayers(){
	var ref = new ActionReference();
	ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID("NmbL") )
	ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	return executeActionGet(ref).getInteger(charIDToTypeID("NmbL"));
}

function main(){
	saveActiveDocument();
	saveLayerComp();

	var visibilityList = new Array();
	visibilityList = getVisibilityList(active);

	selectAllLayers();
	hideLayers();

	setVisibilityList(active, visibilityList);

	displayParentLayers(active);
	selectLayer(active);

	clippingActiveLayer(active);

	loadActiveDocument();
	loadLayerComp();

	if(copyFlag){
		activeNewDocument();
	}
}

//アクティブなドキュメントを保存
function saveActiveDocument(){
	document = activeDocument;
}

//アクティブなドキュメントを読み込み
function loadActiveDocument(){
	activeDocument = document;
}

//レイヤーカンプを保存
function saveLayerComp(){
	document.layerComps.add("tempLayerComp");
	tempLayerComp = document.layerComps["tempLayerComp"];
}

//レイヤーカンプを読み込み
function loadLayerComp(){
	tempLayerComp.apply();
	tempLayerComp.remove();
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
	
	if(parentLayer != activeDocument){
		parentLayer.visible = true;
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

//指定したレイヤーを切り出し
function clippingActiveLayer(obj){

	//レイヤーの画像範囲を取得
	var boundsObj = obj.bounds;
	x1 = parseInt(boundsObj[0]);
	y1 = parseInt(boundsObj[1]);
	x2 = parseInt(boundsObj[2]);
	y2 = parseInt(boundsObj[3]);

　//指定範囲を選択
	selectReg = [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];
	activeDocument.selection.select(selectReg);

	try {
		copyFlag = true;

		//選択範囲を結合してコピー
		activeDocument.selection.copy(true);
		
		//選択を解除
		activeDocument.selection.deselect();

		//新規ドキュメントを作成
		var width = x2 - x1;
		var height = y2 - y1;
		var resolution = 72;
		var name = obj.name;
		var mode = NewDocumentMode.RGB;
		var initialFill = DocumentFill.TRANSPARENT;

		preferences.rulerUnits = Units.PIXELS;
		newDocument = documents.add(width, height, resolution, name, mode, initialFill);

		//画像をペースト
		newDocument.paste();

		//新規レイヤーの画像範囲を取得
		var newBoundsObj = newDocument.activeLayer.bounds;
		nx1 = parseInt(newBoundsObj[0]);
		ny1 = parseInt(newBoundsObj[1]);
		nx2 = parseInt(newBoundsObj[2]);
		ny2 = parseInt(newBoundsObj[3]);
		
		//空白がある場合は切り抜き
		if((nx2 - nx1) != (x2 - x1) || (ny2 - ny1) != (y2 - y1)){
			newDocument.crop(newBoundsObj);
		}
	
	}catch(e){
		copyFlag = false;
		alert("選択したレイヤーに何も含まれていません。");
	}
}

//切り出したドキュメントをアクティブに設定
function activeNewDocument(){
	activeDocument = newDocument;
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
