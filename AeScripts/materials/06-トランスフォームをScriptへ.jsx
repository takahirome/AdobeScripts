/*
	トランスフォームパラメータをスクリプトに変換
*/

function transformToScript()
{
	var transformGroupStr = "ADBE Transform Group";

	//作成したコードを収納する
	var codeList = "";
	//ターゲットのコンポのインデックス
	var compIndex = -1;
	//--------------------------------------------------------------------------------
	function valueTo(p)
	{
		if ((p==null)||(p==undefined)) return "/*不正なプロパティ\*/";
	
		if ( p instanceof Array)
		{
			var ret = "[";
			if (p.length>0){
				for ( var i=0; i<p.length; i++){
					ret += p[i];
					if (i<p.length-1){
						ret += ",";
					}
				}
			}
			ret += "]";
			return ret;
		}else if (typeof(p)=="string"){
			return "\"" + p + "\"";
		}else{
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
	function getTransformPrms(lyr)
	{

		var ret = "";
		
		ret += "\tlyr.threeDLayer = " + lyr.threeDLayer +";\r\n";
		var tflg = lyr.threeDLayer;
		ret += "\r\n";
		
		var tf = lyr.property(transformGroupStr);
		ret += "\tvar tf = lyr.property(\"" + transformGroupStr +"\");\r\n"
			
		//-----------------------------------
		var anc = tf.property("ADBE Anchor Point");
		ret += "\tvar anc = tf.property(\"ADBE Anchor Point\");\r\n";
		if ( anc.numKeys <=0){
			ret += "\tanc.setValue("+ valueTo(anc.value) + ");\r\n";
		}else{
			for ( var i=1; i<=anc.numKeys; i++){
				ret += "\tanc.setValueAtTime("+ anc.keyTime(i)+ "," + valueTo(anc.keyValue(i)) + ");\r\n";
			}
		}
		if ( anc.expression !=""){
			var s = expressionStr(anc.expression);
			ret += "\tanc.expression = " + s;
			ret += "\tanc.expressionEnabled = " + anc.expressionEnabled + ";\r\n";
		}
		ret += "\r\n";
		//-----------------------------------
		var pos = tf.property("ADBE Position");
		ret += "\tvar pos = tf.property(\"ADBE Position\");\r\n";
		if ( pos.numKeys <=0){
			ret += "\tpos.setValue("+ valueTo(pos.value) + ");\r\n";
		}else{
			for ( var i=1; i<=pos.numKeys; i++){
				ret += "\tpos.setValueAtTime("+ pos.keyTime(i)+ "," + valueTo(pos.keyValue(i)) + ");\r\n";
			}
		}
		if ( pos.expression !=""){
			var s = expressionStr(pos.expression);
			ret += "\tpos.expression = " + s;
			ret += "\tpos.expressionEnabled = " + pos.expressionEnabled + ";\r\n";
		}
		ret += "\r\n";
		//-----------------------------------
		var scl = tf.property("ADBE Scale");
		ret += "\tvar scl = tf.property(\"ADBE Scale\");\r\n";
		if ( scl.numKeys <=0){
			ret += "\tscl.setValue("+ valueTo(scl.value) + ");\r\n";
		}else{
			for ( var i=1; i<=scl.numKeys; i++){
				ret += "\tscl.setValueAtTime("+ scl.keyTime(i)+ "," + valueTo(scl.keyValue(i)) + ");\r\n";
			}
		}
		if ( scl.expression !=""){
			var s = expressionStr(scl.expression);
			ret += "\tscl.expression = " + s;
			ret += "\tscl.expressionEnabled = " + scl.expressionEnabled + ";\r\n";
		}
		ret += "\r\n";
		
		//-----------------------------------
		if (tflg == true){
			//-------------
			var ori = tf.property("ADBE Orientation");
			ret += "\tvar ori = tf.property(\"ADBE Orientation\");\r\n";
			if ( ori.numKeys <=0){
				ret += "\tori.setValue("+ valueTo(ori.value) + ");\r\n";
			}else{
				for ( var i=1; i<=ori.numKeys; i++){
					ret += "\tori.setValueAtTime("+ ori.keyTime(i)+ "," + valueTo(ori.keyValue(i)) + ");\r\n";
				}
			}
			if ( ori.expression !=""){
				var s = expressionStr(ori.expression);
				ret += "\tori.expression = " + s;
				ret += "\tori.expressionEnabled = " + ori.expressionEnabled + ";\r\n";
			}
			ret += "\r\n";
			//-------------
			var rX = tf.property("ADBE Rotate X");
			ret += "\tvar rX = tf.property(\"ADBE Rotate X\");\r\n";
			if ( rX.numKeys <=0){
				ret += "\trX.setValue("+ valueTo(rX.value) + ");\r\n";
			}else{
				for ( var i=1; i<=rX.numKeys; i++){
					ret += "\trX.setValueAtTime("+ rX.keyTime(i)+ "," + valueTo(rX.keyValue(i)) + ");\r\n";
				}
			}
			if ( rX.expression !=""){
				var s = expressionStr(rX.expression);
				ret += "\trX.expression = " + s;
				ret += "\trX.expressionEnabled = " + rX.expressionEnabled + ";\r\n";
			}
			ret += "\r\n";
			//-------------
			var rY = tf.property("ADBE Rotate Y");
			ret += "\tvar rY = tf.property(\"ADBE Rotate Y\");\r\n";
			if ( rY.numKeys <=0){
				ret += "\trY.setValue("+ valueTo(rY.value) + ");\r\n";
			}else{
				for ( var i=1; i<=rY.numKeys; i++){
					ret += "\trY.setValueAtTime("+ rY.keyTime(i)+ "," + valueTo(rY.keyValue(i)) + ");\r\n";
				}
			}
			if ( rY.expression !=""){
				var s = expressionStr(rY.expression);
				ret += "\trY.expression = " + s;
				ret += "\trY.expressionEnabled = " + rY.expressionEnabled + ";\r\n";
			}
			ret += "\r\n";
		}
		//-------------
		var rZ = tf.property("ADBE Rotate Z");
		ret += "\tvar rZ = tf.property(\"ADBE Rotate Z\");\r\n";
		if ( rZ.numKeys <=0){
			ret += "\trZ.setValue("+ valueTo(rZ.value) + ");\r\n";
		}else{
			for ( var i=1; i<=rZ.numKeys; i++){
				ret += "\trZ.setValueAtTime("+ rZ.keyTime(i)+ "," + valueTo(rZ.keyValue(i)) + ");\r\n";
			}
		}
		if ( rZ.expression !=""){
			var s = expressionStr(rZ.expression);
			ret += "\trZ.expression = " + s;
			ret += "\trZ.expressionEnabled = " + rZ.expressionEnabled + ";\r\n";
		}
		ret += "\r\n";
		//-------------
		var opa = tf.property("ADBE Opacity");
		ret += "\tvar opa = tf.property(\"ADBE Opacity\");\r\n";
		if ( opa.numKeys <=0){
			ret += "\topa.setValue("+ valueTo(opa.value) + ");\r\n";
		}else{
			for ( var i=1; i<=opa.numKeys; i++){
				ret += "\topa.setValueAtTime("+ opa.keyTime(i)+ "," + valueTo(opa.keyValue(i)) + ");\r\n";
			}
		}
		if ( opa.expression !=""){
			var s = expressionStr(opa.expression);
			ret += "\topa.expression = " + s;
			ret += "\topa.expressionEnabled = " + opa.expressionEnabled + ";\r\n";
		}
		ret += "\r\n"; 
		return ret;
	}
	//--------------------------------------------------------------------------------
	function getTransform(lyr)
	{
		var ret = "function setTransform(lyr)\r\n";
		ret += "{\r\n";
		ret += getTransformPrms(lyr);
		ret += "}\r\n";
		
		ret += "if ( app.project.activeItem instanceof CompItem) {\r\n";
		ret += "\tvar sl = app.project.activeItem.selectedLayers;\r\n";
		ret += "\tif ( sl.length>0){\r\n";
		ret += "\t\tsetTransform(sl[0]);\r\n";
		ret += "\t}\r\n";
		ret += "}\r\n";
		return ret;
	}
	//--------------------------------------------------------------------------------
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
	if ( sl.length>0){
		codeList = getTransform(sl[0]);
	}else{
		codeList = "レイヤーを一つだけ選択してくださいまし。";
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "選択したレイヤのtransformパラメータをスクリプトへ変換", [154, 203, 154+905, 203+500]);
	var gb1 = winObj.add("panel", [13, 13, 13+880, 13+450], "After Effects Script code" );
	var tbProp = gb1.add("edittext", [15, 18, 15+848, 18+410], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [659, 470, 659+98, 470+23], "Save");
	var btnClose = winObj.add("button", [759, 470, 759+98, 470+23], "Close");
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
var dlg = new transformToScript;
dlg.run();


