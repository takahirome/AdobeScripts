//////////////////////////////////////////////////
//
// 選択範囲を切り出し ver 0.1
//
// by yoshihiko@goodmix.net
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
	clippingSelection();
}

//選択範囲を切り出し
function clippingSelection(){
	try {
		//選択範囲を取得
		var boundsObj = activeDocument.selection.bounds;
		x1 = parseInt(boundsObj[0]);
		y1 = parseInt(boundsObj[1]);
		x2 = parseInt(boundsObj[2]);
		y2 = parseInt(boundsObj[3]);
		
		//選択範囲を結合してコピー
		activeDocument.selection.copy(true);
		
		//新規ドキュメントを作成
		var width = x2 - x1;
		var height = y2 - y1;
		var resolution = 72;
		var name = activeDocument.activeLayer.name;
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
		alert("選択範囲がありません。");
		
	}
}

//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
