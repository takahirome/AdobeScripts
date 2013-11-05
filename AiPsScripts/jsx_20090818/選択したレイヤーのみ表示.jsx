//////////////////////////////////////////////////
//
// 選択したレイヤーのみ表示 ver0.2
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
	selectAllLayers();
	hideLayers();
	displayLayers(active);
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
	
	if(parentLayer != activeDocument){
		parentLayer.visible = true;
		displayParentLayers(parentLayer);
	}else{
		return;
	}
}

//指定したレイヤー以下を表示
function displayLayers(obj){
	obj.visible = true;

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			displayLayers(obj.layers[i]);
		}
	}
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();

