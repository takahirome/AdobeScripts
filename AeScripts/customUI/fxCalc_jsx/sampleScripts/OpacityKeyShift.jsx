//不透明度のキーをずらすサンプル
//---------------------------------------------------------------------------
function OpacityKeyShift(tLayer,shiftTime)
{
	//プロパティを変数へ
	var opa = tLayer.property("Opacity");
	//エラーチェック
	if ( (opa==null)||(opa.numKeys <=0) ) return false;
	
	//配列を定義
	var opaArray = new Array;
	//配列に移動
	for ( var i=1; i<=opa.numKeys; i++)
	{
		//配列の要素を定義
		var o = new Object;
		//不透明度と時間を退避。
		//もしInterpolationTypeも必要なら処理する必要がある。
		o.Value = opa.keyValue(i);
		o.Time = opa.keyTime(i);
		opaArray.push(o);
	}

	//キーを消す。消すときは、Indexを破綻させないために後ろから。
	//一発で消す方法もあるが、こっちのほうが気持ちいい
	for (var i=opa.numKeys; i>=1; i--){
		opa.removeKey(i);
	}

	//時間をずらして、キーを打つ
	//ここでは同時に行なってるけど、別にしてエラーチェックをいれたほうがいい
	for ( var i=0; i<opaArray.length; i++)
	{
		opa.setValueAtTime(opaArray[i].Time + shiftTime, opaArray[i].Value);
	}

	return true;
}
//---------------------------------------------------------------------------
var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	
	var selectedLayers = activeComp.selectedLayers;

	if ( (selectedLayers!=null)&&(selectedLayers.length>0) ){
		app.beginUndoGroup("不透明度キーの時間をずらす");
		
		var shiftTime = 2 / activeComp.frameRate;
		for (var i = 0; i < selectedLayers.length; i++) {
			if ( OpacityKeyShift(selectedLayers[i],shiftTime)==true ){
				//成功
			}else{
				//エラー処理
				alert("error! 1")
			}
		}
	app.endUndoGroup();
	}else{
		//エラー処理
				alert("error! 2")
	}
}else{
	//エラー処理
				alert("error! 3")
}
//---------------------------------------------------------------------------

