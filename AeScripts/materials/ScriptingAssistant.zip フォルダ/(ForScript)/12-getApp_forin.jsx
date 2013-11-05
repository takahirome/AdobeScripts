
function getApp_forin()
{
	//---------------
	//作成したコードを収納する
	var codeList = "";
	var captions = "Application Properties";
	var errMes = "プロジェクトのアイテムを何か選択してくださいまし。";
	
	
	//-------------------------------------------------
	codeList += "-----------------------------------\r\n";
	codeList += "Application\r\n";
	codeList += "\r\n";
	for ( var s in app){
		codeList += s+"\r\n";
	}
	codeList += "\r\n";
	//-------------------------------------------------
	codeList += "-----------------------------------\r\n";
	codeList += "Project\r\n";
	codeList += "\r\n";
	for ( var s in app.project){
		codeList += s+"\r\n";
	}
	codeList += "\r\n";
	//-------------------------------------------------
	codeList += "-----------------------------------\r\n";
	codeList += "Doller\r\n";
	codeList += "\r\n";
	for ( var s in $){
		codeList += s+"\r\n";
	}
	codeList += "\r\n";
	//-------------------------------------------------
	codeList += "-----------------------------------\r\n";
	codeList += "Doller.global\r\n";
	codeList += "\r\n";
	for ( var s in $.global){
		codeList += s+"\r\n";
	}
	codeList += "\r\n";
	//-------------------------------------------------
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
var dlg = new getApp_forin;
dlg.show();


