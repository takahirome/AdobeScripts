
function getItem_forin()
{
	//---------------
	//作成したコードを収納する
	var codeList = "";
	var captions = "FootageItem Properties";
	var errMes = "プロジェクトのアイテムを何か選択してくださいまし。";
	
	
	//-------------------------------------------------
	function getItemP(tItem)
	{
		var ss = "----------------------------------------------\r\n";
		
		if ( tItem instanceof FootageItem) {
			ss += "FootageItem:" + tItem.name + "\r\n";
		} else if ( tItem instanceof CompItem) {
			ss += "CompItem:" + tItem.name + "\r\n";
		}else if ( tItem instanceof FolderItem) {
			ss += "FolderItem:" + tItem.name + "\r\n";
		}
		for ( var s in tItem){
			ss += s+"\r\n";
		}
		ss += "\r\n";
		return ss;
	}
	//-------------------------------------------------
	var targets = app.project.selection;
	
		
	for ( var i=0; i<targets.length; i++)
	{
		codeList += getItemP(targets[i]);
	}

	if ( codeList == ""){
		codeList = errMes;
	}
	
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	this.winObj = new Window("dialog", "Propertyへのアクセス", [154, 200, 154+900, 200+600]);
	this.gb1 = this.winObj.add("panel", [15, 15, 15+870, 15+550], captions );
	this.tbProp = this.gb1.add("edittext", [15, 15, 15+840, 15+520], codeList,{multiline: true,readonly:true } );
	this.btnOK = this.winObj.add("button", [759, 570, 759+98, 570+23], "OK", {name:'ok'});
	this.winObj.center();
	var fnt = this.tbProp.graphics.font;
	this.tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);


	//---------------
	this.show = function()
	{
		return this.winObj.show();
	}
	//---------------
}
var dlg = new getItem_forin;
dlg.show();


