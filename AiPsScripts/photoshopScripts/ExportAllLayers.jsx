/**
 * ■概要：すべてのレイヤーをPNGに書きだすPhotoshop用スクリプトです。
 * とりあえずライセンスとか何にも考えてないのですが公開します。
 * ■簡単な使用法の説明：PSDファイルと同名のフォルダに、PNGがレイヤー名で保存されます。一緒に書き出されるJSFLを実行するとFlaファイルにそれらの画像を読み込んで配置が復元されます。
 * ■注意事項；必ずバックアップをとって素材用にファイルを用意して実行してください。またPNG書き出できる(スマートオブジェクト→結合して再現できる)表現に限るため、レイヤー効果やフィルタがかかっているとうまくいかない場合があります。乗算等の描画モードも失われます。
 * doke@kayac.com
 */

///// GLOBAL SETTINGS /////
preferences.rulerUnits = Units.PIXELS;	// 単位をピクセルに
var document = activeDocument;
var result = [];
var baseURL = String(File(document.path).fsName).replace(/\\/g, "/" )+"/";
var baseDir = "";

var currentFolder = "";

var LIMIT = 200;
var count = 0;
var offsetMargin = 0;

///// USER SETTINGS /////
var useFolder = false;
var TYPE_JPEG = "JPEG";
var TYPE_PNG = "PNG";
var saveFileFlag = true;
var saveFileType = TYPE_PNG;
var pngBit = 24;
var jpegQuality = 100;

var structureObj = [];
///// RUN /////
main();

///// MAIN METHODS /////
function main(){
    setVisible(document.layers, false);

    if( !useFolder ) {
    baseDir = getNameRemovedExtendType(document) + "/";
    _createFolder(baseURL + baseDir );
    }

    outputLayers(document.layers, null );

    structureObj.reverse();
    printStructure(structureObj);

    setVisible(document.layers, true);

    result.push("complete!");

    report();
}

///// UTILITY METHODS /////
// 拡張子を除去
function getNameRemovedExtendType(doc) {
	var nameParts = String(doc.name).split(".");
	var name = nameParts.splice(0, nameParts.length-1).join(".");
	return name;
}
function getValidName(name){
	name = name.replace(/\/$/,"");
	return name.replace(/[\/\:\;\.\,\@\"\'\\]/g,"_");
}

// ログ出力
function report(){
	alert( result.join("\n") );
}

///// OUTPUT LAYER METHODS /////
// メイン処理レイヤーリスト
function outputLayers(layers, folder){
    if( !!folder ) createFolder( folder );
    for( var i=0, l=layers.length; i<l; ++i ) {
        var layer = layers[i];
        if( layer.typename == "LayerSet" ){
            var tmp = currentFolder;
            outputLayers(layer.layers, layer.name );
            currentFolder = tmp;
        }
        else {
            if( count++>LIMIT ) return;
            clippingLayer(layer);
        }
    }
}


// メイン処理レイヤー
function clippingLayer(obj){
    //書き出し準備
    //setVisible(document.layers, false);
    setVisible(obj, true);

    //レイヤーの画像範囲を取得
    var boundsObj = obj.bounds;
    x1 = parseInt(boundsObj[0])-offsetMargin;
    y1 = parseInt(boundsObj[1])-offsetMargin;
    x2 = parseInt(boundsObj[2])+offsetMargin;
    y2 = parseInt(boundsObj[3])+offsetMargin;

    　//指定範囲を選択
    selectReg = [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];
    activeDocument.selection.select(selectReg);

    try {
        //選択範囲を結合してコピー
        activeDocument.selection.copy(true);

        //選択を解除
        activeDocument.selection.deselect();

        //新規ドキュメントを作成
        var width = x2 - x1;
        var height = y2 - y1;
        var resolution = 72;
        var name = getValidName(obj.name);
        var mode = NewDocumentMode.RGB;
        var initialFill = DocumentFill.TRANSPARENT;

        preferences.rulerUnits = Units.PIXELS;
        newDocument = documents.add(width, height, resolution, name, mode, initialFill);

        //画像をペースト
        newDocument.paste();

        //新規レイヤーの画像範囲を取得
        var newBoundsObj = newDocument.activeLayer.bounds;
        nx1 = parseInt(newBoundsObj[0])-offsetMargin;
        ny1 = parseInt(newBoundsObj[1])-offsetMargin;
        nx2 = parseInt(newBoundsObj[2])+offsetMargin;
        ny2 = parseInt(newBoundsObj[3])+offsetMargin;

        //空白がある場合は切り抜き
        if((nx2 - nx1) != (x2 - x1) || (ny2 - ny1) != (y2 - y1)){
            newDocument.crop(newBoundsObj);
        }

        //ファイルに書き出し
        //*
        if(saveFileFlag == true){
            switch(saveFileType){
                case TYPE_PNG:
                     var fname = savePNG( currentFolder, name, pngBit );
                break;
                case TYPE_JPEG:
                    var fname = saveJPEG( currentFolder, name, jpegQuality );
                break;
            }
            structureObj.push( { filename:escape(fname),  position: [ Math.max(x1,0), Math.max(y1,0) ] }  );
        }

        newDocument.close( SaveOptions.DONOTSAVECHANGES );
	}
	catch(e){
		//選択範囲に何も含まれていない場合
		result.push( obj.name+": "+e.message);
	}
	finally{
		//元のドキュメントをアクティブに設定
		activeDocument = document;
		setVisible(obj, false);
	}
}

function printStructure( obj ){
	var result = toStringObj( obj );
	if( result == null || result == undefined ) {
		alert("non result");
		return;
	}
	
	var outputPath = baseURL+ baseDir;
	var filePath     = outputPath;
	
    if(File.fs == "Windows" ) {
        filePath.replace(/([A-Za-z]+)\:(.*)/,"file:///" +RegExp.$1+"|"+RegExp.$2 );
        filePath = "file:///" +RegExp.$1+"|"+RegExp.$2;
    }
    else {
        //dir.replace(/([A-Za-z]+)\:(.*)/,"file:///" +RegExp.$1+"|"+RegExp.$2 );
        filePath = "file://Macintosh HD" + filePath;
    }

	var outputFile = new File( outputPath+"buildup.jsfl");
	outputFile.open("w");
	outputFile.encoding = "utf-8";
	outputFile.write([ '(function(){',
	'var structure = '+result+';',
    'var dir = "'+escape(baseDir)+'";',
	'var baseURL = unescape("' +escape(filePath)+ '");',
	'var dom       = fl.getDocumentDOM();',
	'if( !dom ) {',
	'	dom        = fl.createDocument();', 
	'	if( !dom ) return;',
	'}',
	'for( var i in structure ) {',
	'	var obj = structure[i];',
	'	var fileUrl = baseURL + unescape(obj.filename);',
	'	var x = parseInt( obj.position[0] );',
	'	var y = parseInt( obj.position[1] );',
	'	if( !FLfile.exists( fileUrl ) ) continue;',
	'	dom.importFile( fileUrl, false );',
	'	var item = dom.selection[0];',
	'	item.x = x;',
	'	item.y = y;',
	'	dom.selectNone();',
	'}',
	'})()'
    ].join("\n") );
	outputFile.close();
}

function toStringObj( obj ) {
	switch( typeof(obj) ) {
		case "object":
			var result = [];
			for( var i in obj ) {
				result.push( i + " : "+ toStringObj(obj[i]) );
			}
			return "{\n"+ result.join(",\n") + "\n}";
		break;
		default:
			return  '"' + String(obj) +'"';
		break;
	}
}


//フォルダ作成処理
function createFolder( folderName ) {
	currentFolder += getValidName(folderName)+"/";

	if( !useFolder ) return true;
	_createFolder(baseURL+currentFolder);
}
function _createFolder(url) {
	var folder = new Folder(url);
	
	if( folder.exists ) {
		return false;
	}
	else {
		folder.create();
		return true;
	}
}

///// VISIBILITY LAYER METHODS /////
// レイヤー表示処理
function setVisible(obj, bool){
	var i=0, l;
	switch( obj.typename ) {
		//case "LayerSets":
		case "Layers":
			for( l=obj.length; i<l; ++i ) {
				setVisible(obj[i],bool);
			}
		break;
		case "LayerSet":
			obj.visible = bool;
			for( l=obj.layers.length; i<l; ++i ) {
				setVisible(obj.layers[i], bool);
			}
		break;
		default:
			obj.visible = bool;
			if( bool ) displayParent( obj );
		break;
	}
}
function displayParent(obj){
		if(obj.parent){
			obj.parent.visible = true;
			displayParent( obj.parent );
		}

}
function isLayerSet(obj){
	return Boolean(obj.typename == "LayerSet");
}





///// SAVE FILE METHODS /////
// 保存処理
function savePNG(path, name, bit) {
	var exp = new ExportOptionsSaveForWeb();
	exp.format = SaveDocumentType.PNG;
	exp.interlaced　= false;

	if(bit == 8) {
		exp.PNG8 = true;
	}
	else {
		exp.PNG8 = false;
	}

	fileObj = new File(  getFileName( path, name, "png") );
	activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, exp);
	
	return fileObj.name;
}
function saveJPEG(path, name, quality){
	var exp = new ExportOptionsSaveForWeb();
	exp.format = SaveDocumentType.JPEG;
	exp.interlaced　= false;
	exp.optimized= false;
	exp.quality = quality;
    
	fileObj = new File( getFileName(path, name, "jpg"));
	
	activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, exp);
	
	return fileObj.name;
}

// ファイル名の重複回避処理
function getFileName( path, name, ext, doubleCheck ) {
	if( useFolder ) {
		path = baseURL + path;
	}
	else {
		name = getValidName(path+name);
		path = baseURL + baseDir;
	}

	var filename = [ path, name ].join("/");
	var count = 0;
	var newFileName = "";

	newFileName = filename + "." + ext
	
	if( !doubleCheck ) return newFileName;
	
	var file = new File(newFileName);
	while(file.exists != false){
		count +=1;
		newFileName = filename + count + "." + ext
		file = new File(newFileName);
	}
	return newFileName;
}

