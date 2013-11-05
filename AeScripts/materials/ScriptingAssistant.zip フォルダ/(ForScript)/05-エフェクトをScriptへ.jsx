/*
	エフェクトパラメータをスクリプトに変換
*/

function effectsToScript()
{
	var EffectGroupStr = "ADBE Effect Parade";

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
			return p.toString();
		}
	}
	//--------------------------------------------------------------------------------
	//エクスプレッション文字列の処理
	function expressionStr(s)
	{
		//カンマの処理
		var ss = s.split("\"").join("\\\"");
		
		//改行の処理
		ss = ss.split("\n").join("\r");
		ss = ss.split("\r\r").join("\r");
		//改行で配列へ
		var sa = ss.split("\r");
		var ret = "\r\n";
		for ( var i=0; i<sa.length; i++){
			var ss = sa[i].replace(/(^\s+)|(\s+$)/g, ""); 
			if (ss ==""){
				ret += "\t\"\\r\\n\"";
			}else{
				ret += "\t\"" + ss + "\\r\\n\"";
			}
			if ( i<sa.length -1) {
				ret += " +";
			}else{
				ret += ";";
			}
			ret += "\r\n";
		}
		ret += "\r\n";
		return ret;
	}
	//--------------------------------------------------------------------------------
	function listupEffects(fx)
	{
		var ret = "";
		ret += "\t//---------\r\n";
		ret += "\tvar fx = eg.addProperty(\"" + fx.matchName + "\");\r\n";
		if ( fx.matchName != fx.name){
			ret += "\tfx.name = \"" + fx.name +"\"\r\n";
		}
		ret += "\tfx.enabled = " + fx.enabled +";\r\n";
		
		if ( fx.numProperties>0){
			for ( var i=1; i<=fx.numProperties; i++){
				var pro = fx.property(i);
				var tName = pro.matchName;
				if ( pro instanceof Property){
					var pp = "\tfx.property(\""+ pro.matchName +"\")";
					
					if ( pro.propertyValueType == PropertyValueType.CUSTOM_VALUE){
						ret += "//　" + fx.name +"/" +pro.name +"　このプロパティはScript化できません！\r\n";
					}else if ( pro.propertyValueType == PropertyValueType.NO_VALUE){
						//何もしない
					}else{
						var isColor = (pro.propertyValueType == PropertyValueType.COLOR)
						if ( pro.numKeys<=0){
							ret += pp + ".setValue(" + valueTo(pro.value,isColor) + ");//"+pro.name +"\r\n";
						}else{
							for ( var j=1; j<=fx.property(i).numKeys; j++){
								ret += pp +".setValueAtTime(" + pro.keyTime(j) + ","+ valueTo(pro.keyValue(j),isColor) + ");\r\n";
							}
						}
						if ( pro.expression !=""){
							var s = expressionStr(pro.expression);
							ret += "\tfx.property(\"" + tName +"\").expression = " + s;
							ret += "\tfx.property(\"" + tName +"\").expressionEnabled = " + pro.expressionEnabled + ";\r\n";
						}
						ret += "\r\n";
					}
				}
			}
		}
		return ret;
	}
	//--------------------------------------------------------------------------------
	function getEffectsPrms(lyr)
	{
		var ret = "function setFx(lyr)\r\n";
		ret += "{\r\n";
		var ef = lyr.property("ADBE Effect Parade");
		if ( ef.numProperties>0){
			ret += "\tvar eg = lyr.property(\"ADBE Effect Parade\");\r\n";
			for ( var i=1; i<=ef.numProperties; i++){
				ret += listupEffects(ef.property(i));
			}
		}
		ret += "}\r\n";
		
		ret += "if ( app.project.activeItem instanceof CompItem) {\r\n";
		ret += "\tvar sl = app.project.activeItem.selectedLayers;\r\n";
		ret += "\tif ( sl.length>0){\r\n";
		ret += "\t\tsetFx(sl[0]);\r\n";
		ret += "\t}\r\n";
		ret += "}\r\n";
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
	}
	var sl = ac.selectedLayers;
	if ( sl.length==1){
		codeList = getEffectsPrms(sl[0]);
	}else{
		codeList = "レイヤーを一つだけ選択してください。";
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "選択したレイヤのEffectsをスクリプトへ変換", [154, 203, 154+905, 203+600]);
	var gb1 = winObj.add("panel", [13, 13, 13+880, 13+550], "After Effects Script code" );
	var tbProp = gb1.add("edittext", [15, 18, 15+848, 18+510], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [659, 570, 659+98, 570+23], "Save");
	var btnClose = winObj.add("button", [759, 570, 759+98, 570+23], "Close");
	winObj.center();

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
var dlg = new effectsToScript;
dlg.run();


