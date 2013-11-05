/*
	マスクをスクリプトに変換
*/

function maskToScript()
{

	//作成したコードを収納する
	var codeList = "";
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
	//変数をスクリプト用の文字列に変換
	function valueTo(p)
	{
		if ((p==null)||(p==undefined)) return "/*不正なプロパティ\*/";
		if ( p instanceof Array)
		{
			//配列
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
			//文字列
			return "\"" + p + "\"";
		}else{
			//その他
			return p.toString();
		}
	}
	//--------------------------------------------------------------------------------
	function getProArray(pro)
	{
		var ret = new Array;
		ret.push(pro);
		var p = pro.parentProperty;
		while( p != null){
			ret.push(p);
			p = p.parentProperty;
		}
		ret = ret.reverse();
		return ret;
	}
	/*
	//--------------------------------------------------------------------------------
	function getScriptCode(ary)
	{
		var ret = "";
		for ( var i=0; i<ary.length; i++){
			var pro = ary[i];
			if ( pro instanceof AVLayer){
				ret += ".layer(\"" + pro.name +"\")";
			}else if ( pro instanceof Property){
				ret += ".property(\"" + pro.matchName +"\")";
			}else if ( pro instanceof PropertyGroup){
				var nm = pro.name;
				var canNameChange = ( (ary[i].propertyType == PropertyType.NAMED_GROUP)&&(ary[i].matchName !="ADBE Transform Group" ));
				
				if (canNameChange == true){
					ret += ".property(\"" + pro.name +"\")";
				}else{
					ret += ".property(\"" + pro.matchName +"\")";
				}
			}
		}
		return ret;
	}
	//--------------------------------------------------------------------------------
	function proToScript(pro)
	{
		return getScriptCode(getProArray(pro));
	}
	*/
	//--------------------------------------------------------------------------------
	function getPath(sp)
	{
		var ret = "";
		
		ret += "\tvar sp = new Shape();\r\n"
		ret += "\tsp.closed = " + sp.closed +";\r\n";
		var cnt = sp.vertices.length;
		if (cnt>0){
			var a = "[";
			for ( var i=0; i<cnt; i++){
				a += "[" + sp.vertices[i][0] + "," + sp.vertices[i][1] +"]";
				if ( i< cnt-1)  a += ",";
				else a += "]";
			}
			ret += "\tsp.vertices = " + a +";\r\n";
		}
		var cnt = sp.inTangents.length;
		if (cnt>0){
			var a = "[";
			var f = false;
			for ( var i=0; i<cnt; i++){
				if ( (sp.inTangents[i][0] !=0)||(sp.inTangents[i][1] !=0)) f = true;
				a += "[" + sp.inTangents[i][0] + "," + sp.inTangents[i][1] +"]";
				if ( i< cnt-1)  a += ",";
				else a += "]";
			}
			if ( f == true)
				ret += "\tsp.inTangents = " + a +";\r\n";
		}
		var cnt = sp.outTangents.length;
		if (cnt>0){
			var a = "[";
			var f = false;
			for ( var i=0; i<cnt; i++){
				if ( (sp.outTangents[i][0] !=0)||(sp.outTangents[i][1] !=0)) f = true;
				a += "[" + sp.outTangents[i][0] + "," + sp.outTangents[i][1] +"]";
				if ( i< cnt-1)  a += ",";
				else a += "]";
			}
			if ( f == true)
				ret += "\tsp.outTangents = " + a +";\r\n";
		}
		return ret;
	}

	//--------------------------------------------------------------------------------
	function getMaskProperties(mg)
	{
		var ret = "\t//********************************\r\n";
		if ( ( mg instanceof MaskPropertyGroup)==false) return ret;

		//マスクパス
		ret += "\t//-------\r\n";
		var path = mg.property("ADBE Mask Shape");
		ret += "\tvar mskShape = msk.property(\"ADBE Mask Shape\");\r\n"; 
		if (path.numKeys<=0){
			ret += getPath(path.value);
			ret += "\tmskShape.setValue(sp);\r\n";
		}else{
			for ( var i=1; i<=path.numKeys; i++){
				ret += getPath( path.keyValue(i) );
				ret += "\tmskShape.setValueAtTime(" + path.keyTime(i)+",sp);\r\n";
			}
		}
		ret += "\t//-------\r\n";
		var feather = mg.property("ADBE Mask Feather");
		ret += "\tvar mskFeather = msk.property(\"ADBE Mask Feather\");\r\n"; 
		if (feather.numKeys<=0){
			ret += "\tmskFeather.setValue(" + valueTo(feather.value) + ");\r\n";
		}else{
			for ( var i=1; i<=feather.numKeys; i++){
				ret += "\tmskFeather.setValueAtTime(" + feather.keyTime(i)+","+ valueTo(feather.keyValue(i)) + ");\r\n";
			}
		}
		if ( feather.expression !=""){
			var s = expressionStr(feather.expression);
			ret += "\tmskFeather.expression = " + s;
			ret += "\tmskFeather.expressionEnabled = " + feather.expressionEnabled + ";\r\n";
			
		}
		ret += "\t//-------\r\n";
		var opacity = mg.property("ADBE Mask Opacity");
		ret += "\tvar mskOpacity = msk.property(\"ADBE Mask Opacity\");\r\n"; 
		if (opacity.numKeys<=0){
			ret += "\tmskOpacity.setValue(" + valueTo(opacity.value) + ");\r\n";
		}else{
			for ( var i=1; i<=opacity.numKeys; i++){
				ret += "\tmskOpacity.setValueAtTime(" + opacity.keyTime(i)+","+ valueTo(opacity.keyValue(i)) + ");\r\n";
			}
		}
		if ( opacity.expression !=""){
			var s = expressionStr(opacity.expression);
			ret += "\tmskOpacity.expression = " + s;
			ret += "\tmskOpacity.expressionEnabled = " + opacity.expressionEnabled + ";\r\n";
			
		}
		ret += "\t//-------\r\n";
		var offset = mg.property("ADBE Mask Offset");
		ret += "\tvar mskOffset = msk.property(\"ADBE Mask Offset\");\r\n"; 
		if (offset.numKeys<=0){
			ret += "\tmskOffset.setValue(" + valueTo(offset.value) + ");\r\n";
		}else{
			for ( var i=1; i<=offset.numKeys; i++){
				ret += "\tmskOffset.setValueAtTime(" + offset.keyTime(i)+","+ valueTo(offset.keyValue(i)) + ");\r\n";
			}
		}
		if ( offset.expression !=""){
			var s = expressionStr(offset.expression);
			ret += "\tmskOffset.expression = " + s;
			ret += "\tmskOffset.expressionEnabled = " + offset.expressionEnabled + ";\r\n";
			
		}
		
		ret +="\r\n";
		return ret;
	}
	//--------------------------------------------------------------------------------
	function getMask(mg)
	{
		var ret = "function setMask(lyr)\r\n";
		ret += "{\r\n";
		ret += "\tvar msk = lyr.mask.addProperty(\"ADBE Mask Atom\");\r\n";
		ret += "\tmsk.name = \"" + mg.name + "\";\r\n";
		ret += getMaskProperties(mg);
		ret += "}\r\n";
		
		ret += "if ( app.project.activeItem instanceof CompItem) {\r\n";
		ret += "\tvar sl = app.project.activeItem.selectedLayers;\r\n";
		ret += "\tif ( sl.length>0){\r\n";
		ret += "\t\setMask(sl[0]);\r\n";
		ret += "\t}\r\n";
		ret += "}\r\n";
		return ret;		
	}
	//--------------------------------------------------------------------------------
	//ターゲットのコンポのインデックス
	//アクティブなアイテムを得る
	var ac = app.project.activeItem;
	if (ac instanceof CompItem){
	var sp = ac.selectedProperties;
		if ( sp.length>=1){
			codeList = "";
			for (var i=0; i<sp.length;i++){
				if ( sp[i] instanceof MaskPropertyGroup){
					codeList = getMask(sp[i]);
					break;
				}
			}
		}
	}
	if(codeList == ""){
		codeList = "マスクを選択してください。";
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "選択したパスをスクリプトへ変換", [154, 203, 154+905, 203+500]);
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
var dlg = new maskToScript;
dlg.run();


