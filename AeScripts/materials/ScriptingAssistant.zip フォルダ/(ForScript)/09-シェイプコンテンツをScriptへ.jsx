/*
	シェイプレイヤのコンテンツを保存する。
*/

function shapeLayerToScript()
{
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
	//***********************************************************************
	function pointToStr(ary)
	{
		if ( ary.length <=0) return "[]";
		var cnt = ary.length;
		var ret = "[";
		for ( var i=0; i<cnt; i++){
			var p = ary[i];
			if ( p instanceof Array){
				if (p.length<=0){
					ret += "[]";
				}else{
					var ss = "[";
					ss += p.toString();
					ss += "]";
					ret += ss;
				}
			}else{
				ret += p.toString();
			}
			if ( i < cnt-1) ret +=",";
		}
		ret += "]";
		return ret;
	}
	//***********************************************************************
	function makeP(pro,parntStr)
	{
		var ret = "";
		switch ( pro.propertyValueType)
		{
			case PropertyValueType.NO_VALUE : 
				ret += "// " + parntStr +"/"+pro.name +" は数値がないプロパティです\r\n";
				break;
			case PropertyValueType.TEXT_DOCUMENT_TextDocument : 
			case PropertyValueType.CUSTOM_VALUE : 
			case PropertyValueType.MARKER_MarkerValue : 
				ret += "// " + parntStr +"/"+pro.name +" は対応していません。\r\n";
				break;
			case PropertyValueType.ThreeD_SPATIAL : 
			case PropertyValueType.ThreeD : 
				ret += "var p = " + parntStr + ".property(\"" + pro.matchName +"\");\r\n";
				if ( pro.numKeys<=0){
					var p = pro.value;
					ret += "p.setValue( [" + p[0] + ", " + p[1] + ", " + p[2] + "]);\r\n"
				}else{
					for ( var i=1; i<=pro.numKeys; i++){
						var p = pro.keyValue(i)
						ret += "p.setValueAtTime("+ pro.keyTime(i)+ ", [" + p[0] + ", " + p[1] + ", " + p[2] + "]);\r\n";
					}
				}
				break;
			case PropertyValueType.TwoD_SPATIAL : 
			case PropertyValueType.TwoD : 
				ret += "var p = " + parntStr + ".property(\"" + pro.matchName +"\");\r\n";
				if ( pro.numKeys<=0){
					var p = pro.value;
					ret += "p.setValue( [" + p[0] + ", " + p[1] + "]);\r\n"
				}else{
					for ( var i=1; i<=pro.numKeys; i++){
						var p = pro.keyValue(i)
						ret += "p.setValueAtTime("+ pro.keyTime(i)+ ", [" + p[0] + ", " + p[1] + "]);\r\n";
					}
				}
				break;
			case PropertyValueType.LAYER_INDEX : 
			case PropertyValueType.MASK_INDEX : 
			case PropertyValueType.OneD :
				//破線は追加になる。
				if (
					(pro.matchName.indexOf("ADBE Vector Stroke Dash")==0)||
					(pro.matchName.indexOf("ADBE Vector Stroke Gap")==0)||
					(pro.matchName =="ADBE Vector Stroke Offset")
					){
					ret += "var p = " + parntStr + ".addProperty(\"" + pro.matchName +"\");\r\n";
				}else{
					ret += "var p = " + parntStr + ".property(\"" + pro.matchName +"\");\r\n";
				}
				if ( pro.numKeys<=0){
					var p = pro.value;
					ret += "p.setValue( " + p + ");\r\n"
				}else{
					for ( var i=1; i<=pro.numKeys; i++){
						ret += "p.setValueAtTime("+ pro.keyTime(i)+ ", " + pro.keyValue(i) + ");\r\n";
					}
				}
				break;
			case PropertyValueType.COLOR : 
				ret += "var p = " + parntStr + ".property(\"" + pro.matchName +"\");\r\n";
				var p = pro.value;
				if ( pro.numKeys<=0){
					ret += "p.setValue( [" + Math.round(p[0]*255) + "/255, " + Math.round(p[1]*255) + "/255, " + Math.round(p[2]*255) + "/255]);\r\n"
				}else{
					for ( var i=1; i<=pro.numKeys; i++){
						var p = pro.keyValue(i);
						ret += "p.setValueAtTime("+ pro.keyTime(i)+ ", [" + Math.round(p[0]*255) + "/255, " + Math.round(p[1]*255) + "/255, " + Math.round(p[2]*255) + "/255]);\r\n";
					}
				}
				break;
			case PropertyValueType.SHAPE : 
				ret += "var p = " + parntStr + ".property(\"" + pro.matchName +"\");\r\n";
				if ( pro.numKeys<=0){
					var p = pro.value;
					ret += "var myShape = new Shape();\r\n";
					ret += "myShape.close = " + p.closed + ";\r\n";
					ret += "myShape.vertices = " + pointToStr(p.vertices) + ";\r\n";
					ret += "myShape.inTangents = " + pointToStr(p.inTangents) + ";\r\n";
					ret += "myShape.outTangents = " + pointToStr(p.outTangents) + ";\r\n";
					ret += "p.setValue(myShape);\r\n";
				}else{
					for ( var i=1; i<=pro.numKeys; i++){
						var p = pro.keyValue(i);
						ret += "var myShape = new Shape();\r\n";
						ret += "myShape.close = " + p.closed + ";\r\n";
						ret += "myShape.vertices = " + pointToStr(p.vertices) + ";\r\n";
						ret += "myShape.inTangents = " + pointToStr(p.inTangents) + ";\r\n";
						ret += "myShape.outTangents = " + pointToStr(p.outTangents) + ";\r\n";
						ret += "p.setValueAtTime("+ pro.keyTime(i)+ ", myShape);\r\n";
					}
				}
		}
		if ( pro.expression != ""){
			ret += "p.expression = " + expressionStr(pro.expression);
			ret += "p.expressionEnabled = " + pro.expressionEnabled + ";\r\n";
		}
		ret += "\r\n";
		
		return ret;
	}
	//***********************************************************************
	function makeG(pro,parntStr)
	{
		var o = new Object;
		o.str = "";
		o.name = "";
		if (( pro.propertyType == PropertyType.INDEXED_GROUP)||(pro.matchName=="ADBE Vector Transform Group")){
			o.name = pro.matchName.split(" ").join("_");
			o.name = o.name.replace("ADBE_","");
			o.str += "var " + o.name + " = "+ parntStr +".property(\"" + pro.matchName +"\");\r\n";
		}else if ( pro.matchName=="ADBE Vector Stroke Dashes"){
			o.name = pro.name.split(" ").join("_");
			o.name = o.name.replace("ADBE_","");
			o.str += "var " + o.name + " = "+ parntStr +".property(\"" + pro.matchName +"\");\r\n";
		}else{
			o.name = pro.name.split(" ").join("_");
			o.name = o.name.replace("ADBE_","");
			o.str += "var " + o.name + " = "+ parntStr +".addProperty(\"" + pro.matchName +"\");\r\n";
			o.str += o.name + ".name = \"" + pro.name + "\";\r\n";
		}
		o.str += "\r\n";
		
		return o;
	}
	//***********************************************************************
	function strList(ary)
	{
		var ret = "\"[";
		var cnt = ary.length;
		if ( cnt>0){
			for ( var i=0; i<cnt; i++){
				ret += ary[i].matchName +","+ ary[i].name;
				if ( i<cnt-1) ret += ",";
			}
		}
		ret += "]\"";
		return ret;
	} 
	//***********************************************************************
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if ( p instanceof Property ){
			var pp = p;
			while ( ( pp != null)&&(pp.matchName != "ADBE Root Vectors Group")){
				ret.push(pp);
				pp = pp.parentProperty;	//このメソッドがキモ
			}
			//配列をひっくり返す
			if ( ret.length>1) ret = ret.reverse();
		}
		//返されるObjectは、Layerからになる
		return ret;
	} 
	//***********************************************************************
	function getShapePrms(pg,pgName)
	{
		var ret = "";
		if ( pg.numProperties>0){
			for ( var i=1; i<=pg.numProperties; i++){
				if ( pg.property(i) instanceof Property){
					var mn = pg.property(i).matchName;
					var cse = pg.property(i).canSetExpression;
					if ( (mn.indexOf("ADBE Vector Stroke Dash") ==0)&&(cse == false)) continue;
					else if ( (mn.indexOf("ADBE Vector Stroke Gap") ==0)&&(cse == false)) continue;
					else if ( (mn == "ADBE Vector Stroke Offset")&&(cse == false)) continue;

					ret += makeP(pg.property(i),pgName);
				}
			}
			for ( var i=1; i<=pg.numProperties; i++){
				if ( pg.property(i) instanceof PropertyGroup){
					var o = makeG(pg.property(i),pgName);
					ret += o.str;
					ret += getShapePrms(pg.property(i),o.name);
				}
			}
		}
		return ret;
	}
	//***********************************************************************
	function shapeLayerTo(sl)
	{
		var RootVectors = sl.property("ADBE Root Vectors Group");
		var ss = getShapePrms(RootVectors,"RootVectors");
		
		var ret = "function setShapeLayer(lyr)\r\n";
		ret += "{\r\n";
		ret += "var RootVectors = lyr.property(\"ADBE Root Vectors Group\");\r\n";
		ret +=  ss;
		ret += "}\r\n";
		
		ret += "if (app.project.activeItem instanceof CompItem) {\r\n";
		ret += "\tvar sl = app.project.activeItem.layers.addShape();\r\n";
		ret += "\tsl.name = \"" + sl.name + "\";\r\n";
		ret += "\tsetShapeLayer(sl);\r\n";
		ret += "}\r\n";
		return ret;	
	}
	//***********************************************************************
	//---------------
	//作成したコードを収納する
	var codeList = "";

	var ac = app.project.activeItem;
	if ( ac instanceof CompItem)
	{
		var sl = ac.selectedLayers;
		if ( sl.length>0){
			if ( sl[0] instanceof ShapeLayer)
			{
				codeList = shapeLayerTo(sl[0]);
			}
		}
	}
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "Propertyへのアクセス", [150, 200, 150+1000, 200+640]);
	var gb1 = winObj.add("panel", [15, 15, 15+970, 15+570], "After Effects Properties" );
	var tbProp = gb1.add("edittext", [15, 15, 15+940, 15+540], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [750, 590, 750+98, 590+23], "Save");
	var btnClose = winObj.add("button", [850, 590, 850+98, 590+23], "Close");
	winObj.center();
	
	var fnt = tbProp.graphics.font;
	tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

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
var dlg = new shapeLayerToScript;
dlg.show();


