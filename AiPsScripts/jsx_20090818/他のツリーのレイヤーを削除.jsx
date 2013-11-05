//////////////////////////////////////////////////
//
// 他のツリーのレイヤーを削除 ver0.1
//
//////////////////////////////////////////////////
// var
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function start(){
	main();
}
function main(){
	//duplicateAndActive();
	var parentLayer = getTopParentLayer(activeDocument.activeLayer);
	deleteOtherTree(parentLayer);
}

//ドキュメントを複製してアクティブにセット
function duplicateAndActive(){
	var temp = activeDocument.duplicate();
	acriveDocument = temp;
}

//指定したオブジェクトのトップレベルレイヤーの取得
function getTopParentLayer(obj){
	var parentLayer = obj.parent
	
	if(parentLayer != activeDocument){
		obj = getTopParentLayer(parentLayer)
	}
	return obj;
}

//指定したオブジェクトのレイヤー数の取得
function getLayerList(obj){
	var i;
	var l = obj.layers.length;
	var layerList = new Array();
	for(i = 0; i < l; i++){
		layerList[i] = obj.layers[i]
	}
	return layerList;
}

//他の階層のレイヤーを削除
function deleteOtherTree(obj){
	var i;
	var l = activeDocument.layers.length;
	var layerList = getLayerList(activeDocument)
	for(i = 0; i < l; i++){
		var layer = layerList.pop();
		if(layer != obj ){
			layer.remove();
		}
	}
}

//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
