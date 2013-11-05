/*
選択したプロパティのグループ内の詳細の表示
*/

function propertyInfo()
{
	//選択したコンポのインデックス
	var compIndex = -1;

	//作成したコードを収納する
	var codeList = "";
	//--------------------------------------------------------------------------------
	//変数をスクリプト用の文字列に変換
	function valueTo(p,isColor)
	{
		if ((p==null)||(p==undefined)) return "/*不正なプロパティ\*/";
		if ( p instanceof Array)
		{
			//配列
			var ret = "[";
			if (p.length>0){
				for ( var i=0; i<p.length; i++){
					if (isColor) {
						var v = p[i];
						var vs = Math.round(v * 255);
						ret +=  vs +"/255";
					}else{
						ret += p[i];
					}
					if (i<p.length-1){
						ret += ",";
					}
				}
			}
			ret += "]";
			return ret;
		}else if (typeof(p)=="string"){
			//文字列
			return "\"" + p + "\"";
		}else{
			//その他
			return p +"";
		}
	}
	
	//--------------------------------------------------------------------------------
	function getPropertyInfo(pro)
	{
		var ret = "";
		if ( (pro instanceof Property)==false) return ret;
		
		//親プロパティグループを獲得
		var p = pro.parentProperty;
		
		ret += "*********** PropertyGroup ***********\r\n";
		ret += "name = " +p.name +"\r\n";
		ret += "matchName = " +p.matchName +"\r\n";

		ret += "active = " +p.active +"\r\n";
		ret += "canSetEnabled = " +p.canSetEnabled +"\r\n";
		ret += "elided = " +p.elided +"\r\n";
		ret += "enabled = " +p.enabled +"\r\n";
		ret += "isEffect = " +p.isEffect +"\r\n";
		ret += "isMask = " +p.isMask +"\r\n";
		ret += "isModified = " +p.isModified +"\r\n";
		ret += "isMask = " +p.isMask +"\r\n";
		ret += "PropertyType = ";
		switch(p.propertyType)
		{
			case PropertyType.PROPERTY: ret += "PropertyType.PROPERTY"; break;
			case PropertyType.INDEXED_GROUP: ret += "PropertyType.INDEXED_GROUP"; break;
			case PropertyType.NAMED_GROUP: ret += "PropertyType.NAMED_GROUP"; break;
		}
		ret +="\r\n";
		ret += "numProperties = " +p.numProperties +"\r\n";
		
		ret += "----\r\n";
		if ( p.numProperties<=0 ) return ret;
		for ( var i=1; i<=p.numProperties; i++){
			var tp = p.property(i);
			ret += tp.propertyIndex + "\t\"" + tp.name +"\"\t(\""+ tp.matchName + "\")\r\n";
			ret += "\tcanSetExpression = " +tp.canSetExpression +"\r\n";
			ret += "\tcanVaryOverTime = " +tp.canVaryOverTime +"\r\n";
			ret += "\tisSpatial = " + tp.isSpatial +"\r\n";
			ret += "\tisTimeVarying = " + tp.isTimeVarying +"\r\n";
			
			
			ret += "\thasMin = " + tp.hasMin +" : ";
			if ( tp.hasMin){
				ret += "minValue = " + tp.minValue;
			}
			ret +="\r\n";

			ret += "\thasmax = " + tp.hasMax +" : ";
			if ( tp.hasMax){
				ret += "maxValue = " + tp.maxValue;
			}
			ret +="\r\n";
			
			ret += "\tnumKeys = " + tp.numKeys +"\r\n";
			ret += "\tunitsText = \"" + tp.unitsText +"\"\r\n";
			ret +="\t";
			var isColor = false;
			var isValue = true;
			switch(tp.propertyValueType)
			{
				case PropertyValueType.NO_VALUE:
					ret += "PropertyValueType.NO_VALUE\r\n";
					isValue = false;
					break;
				case PropertyValueType.ThreeD_SPATIAL: ret +="PropertyValueType.ThreeD_SPATIAL\r\n"; break;
				case PropertyValueType.ThreeD: ret +="PropertyValueType.ThreeD\r\n"; break;
				case PropertyValueType.TwoD_SPATIAL: ret +="PropertyValueType.TwoD_SPATIAL\r\n"; break;
				case PropertyValueType.TwoD: ret +="PropertyValueType.TwoD\r\n"; break;
				case PropertyValueType.OneD: ret +="PropertyValueType.OneD\r\n"; break;
				case PropertyValueType.COLOR:
					ret +="PropertyValueType.COLOR\r\n";
					isColor = true;
					break;
				case PropertyValueType.CUSTOM_VALUE:
					ret +="PropertyValueType.CUSTOM_VALUE\r\n";
					isValue = false;
					break;
				case PropertyValueType.MARKER_MarkerValue: ret +="PropertyValueType.MARKER MarkerValue\r\n"; break;
				case PropertyValueType.LAYER_INDEX: ret +="PropertyValueType.LAYER_INDEX\r\n"; break;
				case PropertyValueType.MASK_INDEX: ret +="PropertyValueType.MASK_INDEX\r\n"; break;
				case PropertyValueType.SHAPE:
					ret +="PropertyValueType.SHAPE\r\n";
					isValue = false;
					break;
				case PropertyValueType.TEXT_DOCUMENT_TextDocument: ret +="PropertyValueType.TEXT_DOCUMENT\r\n"; break;
			}
			if (isValue) ret += "\tvalue = " + valueTo(tp.value,isColor)+"\r\n";
			ret += "\texpressionEnabled = " +tp.expressionEnabled +"\r\n";
			ret += "\texpressionError = \"" +tp.expressionError +"\"\r\n";
			ret +="\r\n";
		}
		return ret;
	}
	//--------------------------------------------------------------------------------
	//ターゲットのコンポのインデックス
	//アクティブなアイテムを得る
	var ac = app.project.activeItem;
	if ( ac instanceof CompItem)
	{
		//姑息なやり方でインデックスを獲得
		var idBk = ac.id;
		for ( var i=1; i<=app.project.numItems; i++)
		{
			if (app.project.item(i).id == idBk) {
				compIndex = i;
				break;
			}
		}
		var sp = ac.selectedProperties;
		if ( sp.length>0){
			for ( var i=0; i<sp.length; i++){
				if ( sp[i] instanceof Property){
					codeList = getPropertyInfo(sp[i]);
				}
			}
		}else{
			codeList = "プロパティを一つだけ選択してください。";
		}
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "プロパティグループの詳細", [154, 203, 154+905, 203+600]);
	var gb1 = winObj.add("panel", [13, 13, 13+880, 13+550], "After Effects Script code" );
	var tbProp = gb1.add("edittext", [15, 18, 15+848, 18+510], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [659, 570, 659+98, 570+23], "Save");
	var btnClose = winObj.add("button", [759, 570, 759+98, 570+23], "Close");
	winObj.center();

	var fnt = tbProp.graphics.font;
	tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

	btnClose.onClick = function(){ winObj.close();}

	//---------------
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
	this.run = function()
	{
		return winObj.show();
	}
	//---------------
}
var dlg = new propertyInfo;
dlg.run();


