/*
	選択したシェイプレイヤーのプロパティを書きだす
	このバージョンではプロパティの値ではなく、matchnameとnameを出力
*/
var scriptData = 
"function shapeMake()\r\n" +
"{\r\n" +
"var targetComp = null;\r\n" +
"var targetLayer = null;\r\n" +
"//-------------------------\r\n" +
"function make(o, pro)\r\n" +
"{\r\n" +
"	if ((o ==null)||(pro == null)) return;\r\n" +
"	\r\n" +
"	if ( o.isProperty == true){\r\n" +
"	switch(pro.propertyValueType)\r\n" +
"	{\r\n" +
"		case PropertyValueType.MARKER_MarkerValue:\r\n" +
"		case PropertyValueType.TEXT_DOCUMENT:\r\n" +
"		case PropertyValueType.CUSTOM_VALUE:\r\n" +
"		case PropertyValueType.NO_VALUE:\r\n" +
"		break;\r\n" +
"		case PropertyValueType.TwoD_SPATIAL:\r\n" +
"		case PropertyValueType.TwoD:\r\n" +
"		case PropertyValueType.OneD:\r\n" +
"		case PropertyValueType.COLOR:\r\n" +
"		case PropertyValueType.LAYER_INDEX:\r\n" +
"		case PropertyValueType.MASK_INDEX:\r\n" +
"		case PropertyValueType.ThreeD_SPATIAL:\r\n" +
"		case PropertyValueType.ThreeD:\r\n" +
"		try{\r\n" +
"			if ( o.numKeys<=0){\r\n" +
"			pro.setValue(o.value);\r\n" +
"			}else{\r\n" +
"			for ( var i=0; i<o.numKeys; i++){\r\n" +
"				var r = o.value[i];\r\n" +
"				pro.setValueAtTime(r.time, r.value);\r\n" +
"			}\r\n" +
"			}\r\n" +
"		}catch(e){\r\n" +
"		}\r\n" +
"		break;\r\n" +
"		case PropertyValueType.SHAPE:\r\n" +
"		try{\r\n" +
"			if ( o.numKeys<=0){\r\n" +
"			pro.setValue(o.value);\r\n" +
"			}else{\r\n" +
"			for ( var i=0; i<o.numKeys; i++){\r\n" +
"				var r = o.value[i];\r\n" +
"				var sp = new Shape();\r\n" +
"				sp.closed = r.closed;\r\n" +
"				sp.vertices = r.vertices;\r\n" +
"				sp.inTangents = r.inTangents;\r\n" +
"				sp.outTangents = r.outTangents;\r\n" +
"				pro.setValueAtTime(r.time, sp);\r\n" +
"			}\r\n" +
"			}\r\n" +
"		}catch(e){\r\n" +
"		}\r\n" +
"		break;\r\n" +
"	}\r\n" +
"	}else{\r\n" +
"	//\r\n" +
"	if ( o.numProperties>0){\r\n" +
"		for (var i=0; i<o.numProperties; i++){\r\n" +
"		var sub = pro.property(o.properties[i]);\r\n" +
"		if ( sub == null){\r\n" +
"			sub = pro.addProperty( o[o.properties[i]].matchName);\r\n" +
"			sub.name = o[o.properties[i]].name;\r\n" +
"		}\r\n" +
"		make(o[o.properties[i]], sub);\r\n" +
"		}\r\n" +
"	}\r\n" +
"	}\r\n" +
"}\r\n" +
"//-------------------------\r\n" +
"this.run = function(s)\r\n" +
"{\r\n" +
"	var obj = new Object;\r\n" +
"	if ( app.project.activeItem instanceof CompItem){\r\n" +
"	targetComp = app.project.activeItem;\r\n" +
"	}else{\r\n" +
"	return;\r\n" +
"	}\r\n" +
"	obj = eval(s);\r\n" +
"	if ( obj == null) return;\r\n" +
"	if ( obj.header != \"bry-ful's shape object\") return;\r\n" +
"	\r\n" +
"	targetLayer = targetComp.layers.addShape();\r\n" +
"	targetLayer.name = obj.layerName;\r\n" +
"	\r\n" +
"	make(obj,targetLayer);\r\n" +
"}\r\n" +
"	//-------------------------\r\n" +
"}\r\n" +
"var sm = new shapeMake();\r\n" +
"sm.run(shapeData);\r\n" +
"\r\n";


//---------------------------------------------------------------------------
//===================================================================================================
//===================================================================================================
function shapeToScript()
{
	var currentTime = 0.0;
	//選択したコンポのインデックス
	var compIndex = -1;

	//作成したコードを収納する
	var codeList = "";
	//--------------------------------------------------------------------------------
	function listupPro(o, pro)
	{
		if ( pro instanceof Property){
			var tName = pro.name;
			o[tName] = new Object;
			o[tName].isProperty = true;
			o[tName].name = pro.name;
			o[tName].matchName = pro.matchName;
			o[tName].propertyType = pro.propertyValueType;
			switch(pro.propertyValueType)
			{
				case PropertyValueType.MARKER_MarkerValue:
				case PropertyValueType.TEXT_DOCUMENT:
				case PropertyValueType.CUSTOM_VALUE:
				case PropertyValueType.NO_VALUE:
					delete o[tName];
					break;
				case PropertyValueType.TwoD_SPATIAL:
				case PropertyValueType.TwoD:
				case PropertyValueType.OneD:
				case PropertyValueType.COLOR:
				case PropertyValueType.LAYER_INDEX:
				case PropertyValueType.MASK_INDEX:
				case PropertyValueType.ThreeD_SPATIAL:
				case PropertyValueType.ThreeD:
					o[tName].numKeys = pro.numKeys;
					if ( pro.numKeys<=0){
						o[tName].value = pro.value;
					}else{
						o[tName].value = new Array;
						for ( var i=1; i<=pro.numKeys; i++){
							var tt = new Object;
							tt.time = pro.keyTime(i);
							tt.value = pro.keyValue(i);
							o[tName].value.push(tt);
						}
					}
					break;
				case PropertyValueType.SHAPE:
					o[tName].numKeys = pro.numKeys;
					if ( pro.numKeys<=0){
						var sp = pro.value;
						o[tName].value = new Object;
						o[tName].value.closed = sp.closed;
						o[tName].value.vertices = sp.vertices;
						o[tName].value.inTangents = sp.inTangents;
						o[tName].value.outTangents = sp.outTangents;
					}else{
						o[tName].value = new Array;
						for ( var i=1; i<=pro.numKeys; i++){
							var tt = new Object;
							tt.time = pro.keyTime(i);
							var sp = pro.keyValue(i);
							tt.closed = sp.closed;
							tt.vertices = sp.vertices;
							tt.inTangents = sp.inTangents;
							tt.outTangents = sp.outTangents;
							o[tName].value.push(tt);
						}
					}
					break;
			}
		}else if (pro instanceof PropertyGroup){
			var tName = pro.name;
			if (pro.matchName == "ADBE Root Vectors Group"){
				o.numProperties = 1;
				o.isProperty = false;
				o.properties = new Array;
				o.properties.push(pro.name);
			}
			o[tName] = new Object;
			o[tName].name = pro.name;
			o[tName].matchName = pro.matchName;
			o[tName].isProperty = false;
			o[tName].numProperties = pro.numProperties;
			o[tName].properties = new Array;
			if ( pro.numProperties>0){
				for ( var i=1; i<=pro.numProperties; i++){
					o[tName].properties.push(pro.property(i).name);
					listupPro(o[tName],pro.property(i));
				}
			}
		}
	}
	//--------------------------------------------------------------------------------
	function shapeToCode(tLayer)
	{
		proList = new Array;
		var obj = new Object;//
		obj.header = "bry-ful's shape object";
		obj.layerName = tLayer.name;
		
		//*******************************************
	
		if ( tLayer.property("ADBE Root Vectors Group") !=null){
			listupPro(obj,tLayer.property("ADBE Root Vectors Group"));
		}
		
		return obj.toSource();
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
		currentTime = ac.time;
	}
	if ((ac !=null)&&(ac.selectedLayers.length==1)){
		if ( ac.selectedLayers[0] instanceof ShapeLayer){
			codeList = shapeToCode(ac.selectedLayers[0]);
			
			codeList = "var shapeData = \"" + codeList.split("\"").join("\\\"") + "\";\r\n";
			codeList += scriptData;
			
			
		}else{
			codeList = "シェイプレイヤを選択してください。";
		}
	}else{
		codeList = "シェイプレイヤを一つだけ選択してください。";
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "選択したシェイプをスクリプトへ変換", [154, 203, 154+905, 203+500]);
	var gb1 = winObj.add("panel", [13, 13, 13+880, 13+450], "After Effects Script code" );
	var tbProp = gb1.add("edittext", [15, 18, 15+848, 18+410], codeList,{multiline: true,readonly:true } );
	var btnSave = winObj.add("button", [659, 470, 659+98, 470+23], "Save");
	var btnClose = winObj.add("button", [759, 470, 759+98, 470+23], "Close");
	winObj.center();

	btnClose.onClick = function(){ winObj.close();}

	//---------------
	function saveToFile()
	{
		if ( codeList == "") return;
		var fileObj = File.saveDialog("save jsx.","*.jsx")
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
var dlg = new shapeToScript;
dlg.run();


