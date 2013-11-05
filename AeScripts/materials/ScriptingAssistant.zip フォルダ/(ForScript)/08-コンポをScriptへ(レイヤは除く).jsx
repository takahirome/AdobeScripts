
function compToScript()
{
	//***********************************************************************
	function compTo(cmp)
	{
		ret = "var targetFolder = app.project.rootFolder;\r\n";
		ret += "if (app.project.activeItem instanceof FolderItem) {\r\n";
		ret += "\ttargetFolder = app.project.activeItem;\r\n";
		ret += "}\r\n";
		ret += "var cmp = targetFolder.items.addComp(\"" + cmp.name + "\","+ cmp.width + "," + cmp.height +"," + cmp.pixelAspect + "," + cmp.duration + "," + cmp.frameRate+");\r\n";
		ret += "cmp.duration = " + cmp.duration +";\r\n";
		ret += "cmp.comment = \"" + cmp.comment +"\";\r\n";
		return ret;	
	}
	//***********************************************************************
	//---------------
	//作成したコードを収納する
	var codeList = "";

	var ac = app.project.activeItem;
	if ( ac instanceof CompItem)
	{
			codeList = compTo(ac);
	}
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "compToScript", [150, 200, 150+1000, 200+640]);
	var gb1 = winObj.add("panel", [15, 15, 15+970, 15+570], "After Effects Properties" );
	var tbProp = gb1.add("edittext", [15, 15, 15+940, 15+540], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [750, 590, 750+98, 590+23], "Save");
	var btnClose = winObj.add("button", [850, 590, 850+98, 590+23], "Close");
	winObj.center();

	btnClose.onClick = function(){ winObj.close();}

	function saveToFile()
	{
		if ( codeList == "") return;
		var fileObj = File.saveDialog("save jsx.","*.jsx");
		if ( fileObj == null) return;
		var flag = fileObj.open("w");
		if (flag == true)
		{
			try{
				fileObj.encoding = "UTF-8";
				fileObj.write(codeList);
				fileObj.close();
				winObj.close();
			}catch(e){
			}
		}
	}
	//---------------
	btnSave.onClick = saveToFile;
	//---------------
	this.show = function()
	{
		return winObj.show();
	}
	//---------------
}
var dlg = new compToScript;
dlg.show();


