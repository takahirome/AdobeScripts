/*
選択したキーフレームの詳細を表示
*/

function keyframeInfo()
{
	//選択したコンポのインデックス
	var compIndex = -1;
	var frameRate = 24.0;

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
	function arrayToStr(ary)
	{
		var cnt = ary.length;
		if ( cnt <=0) return "[]";
		var ret = "[";
		for (var i=0; i<cnt; i++){
			if ( ary[i] instanceof Array){
				ret += arrayToStr(ary[i]);
			}else{
				ret += ary[i] + "";
			}
			if ( i<cnt-1) ret +=",";
		}
		ret +="]";
		return ret;
	}
	function KeyframeEaseTo(p)
	{
		var ret = "";
		if ( p instanceof Array){
			if (p.length>0){
				for ( var i = 0; i<p.length;i++){
					ret += "[ influence ="  + p[i].influence +", ";
					ret += "speed ="  + p[i].speed +"]";
					if ( i<p.length-1) ret+=",";
				}
			}
		}
		return ret;
	}
	//--------------------------------------------------------------------------------
	function getKeyframeInfo(pro)
	{
		var ret = "";
		if ( (pro instanceof Property)==false) {
			ret = "プロパティが選択されていません。"
			return ret;
		}
		
		var sk = pro.selectedKeys;
		if ( sk.length<=0) {
			ret = "キーフレームが選択されていません。"
			return ret;
		}
		ret += "*********** Property ***********\r\n";
		ret += "name = " +pro.name +"\r\n";
		ret += "matchName = " +pro.matchName +"\r\n";
		var isColor = false;
		var isValue = true;
		switch(pro.propertyValueType)
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
				break;
			case PropertyValueType.TEXT_DOCUMENT_TextDocument: ret +="PropertyValueType.TEXT_DOCUMENT\r\n"; break;
		}
		ret += "numKeys = " +pro.numKeys +"\r\n";
		
		if ( pro.numKeys<=0) return ret;
		
		sk
		for (var j=0; j<sk.length; j++){
			var i = sk[j];
			ret += "//=====" + i + "======\r\n";
			var tm = pro.keyTime(i);
			var fr = pro.keyTime(i) * frameRate + app.project.displayStartFrame;
			ret += "time = " + fr + "koma,\t" + tm  +"sec\r\n";
			if ( pro.propertyValueType == PropertyValueType.SHAPE){
				var sp = pro.keyValue(i);
				ret += "shape dara\r\n";
				ret += "closed = " + sp.closed +"\r\n";
				ret += "vertices = " +  arrayToStr(sp.vertices) +"\r\n";
				ret += "inTangents = " + arrayToStr(sp.inTangents) +"\r\n";
				ret += "outTangents = " + arrayToStr(sp.outTangents) +"\r\n";
			}else{
				ret += "value = " + valueTo(pro.keyValue(i),isColor) + "\r\n";
			}
			//*****
			ret += "keyInInterpolationType = "
			switch(pro.keyInInterpolationType(i))
			{
			case KeyframeInterpolationType.LINEAR : ret += "LINEAR";break;
			case KeyframeInterpolationType.BEZIER : ret += "BEZIER";break;
			case KeyframeInterpolationType.HOLD : ret += "HOLD";break;
			}
			ret += "// inの補間型\r\n"
			//*****
			ret += "keyOutInterpolationType = "
			switch(pro.keyOutInterpolationType(i))
			{
			case KeyframeInterpolationType.LINEAR : ret += "LINEAR";break;
			case KeyframeInterpolationType.BEZIER : ret += "BEZIER";break;
			case KeyframeInterpolationType.HOLD : ret += "HOLD";break;
			}
			ret += "// outの補間型\r\n"
			ret += "keyInTemporalEase = " + KeyframeEaseTo(pro.keyInTemporalEase(i))+"\r\n";
			ret += "keyoutTemporalEase = " + KeyframeEaseTo(pro.keyOutTemporalEase(i))+"\r\n";
			
			if ( (pro.propertyValueType == PropertyValueType.ThreeD_SPATIAL)||(pro.propertyValueType == PropertyValueType.TwoD_SPATIAL)){
				ret += "keyInSpatialTangent = " + arrayToStr(pro.keyInSpatialTangent(i))+"\r\n";
				ret += "keyOutSpatialTangent = " + arrayToStr(pro.keyOutSpatialTangent(i))+"\r\n";
				ret += "keyRoving = " + pro.keyRoving(i)+"\r\n";
				ret += "keySpatialAutoBezier = " + pro.keySpatialAutoBezier(i)+"\r\n";
				ret += "keySpatialContinuous = " + pro.keySpatialContinuous(i)+"\r\n";
				ret += "keySpatialAutoBezier = " + pro.keySpatialAutoBezier(i)+"\r\n";
			}
			ret += "keyTemporalAutoBezier = " + pro.keyTemporalAutoBezier(i)+"\r\n";
			ret += "keyTemporalContinuous = " + pro.keyTemporalContinuous(i)+"\r\n";

			ret += "\r\n";
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
		frameRate = ac.frameRate;
	}
	var sp = ac.selectedProperties;
	if ( sp.length>0){
		for ( var i=0; i<sp.length; i++){
			if ( sp[i] instanceof Property){
				codeList = getKeyframeInfo(sp[i]);
			}
		}
	}
	if ( codeList == "")
	{
		codeList = "プロパティを一つだけ選択してください。";
	}

	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "キーフレームの詳細", [154, 203, 154+905, 203+600]);
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
var dlg = new keyframeInfo;
dlg.run();


