/*
	レイヤのプロパティを選択して実行。
	そのプロパティにアクセスするコードを作成する。
*/

function showPropertyPath()
{
	//---------------
	//プロパティのアクセス配列を得る
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if (  (p instanceof Property )||(p instanceof PropertyGroup )||(p instanceof MaskPropertyGroup )) {
			var pp = p;
			while ( pp != null){
				ret.push(pp);
				pp = pp.parentProperty;	//このメソッドがキモ
			}
			//配列をひっくり返す
			if ( ret.length>1) ret = ret.reverse();
		}
		//返されるObjectは、Layerからになる
		return ret;
	} 
	//---------------
	//Javascriptのコードに変換
	function proPathToString(ary,idx)
	{
		if ( !(ary instanceof Array) ) return "";
		if ( ary.length <=2) return "";
		
		var ret = "var p = ";
		ret += "app.project.item("+ idx + ")";		//CompItem

		for ( var i=0; i<ary.length; i++){
			if ( ( ary[i] instanceof AVLayer)||( ary[i] instanceof ShapeLayer)||(ary[i] instanceof TextLayer)){
				ret += ".layer(\"" + ary[i].name +"\")";
			}else if (( ary[i] instanceof PropertyGroup)||( ary[i] instanceof MaskPropertyGroup)){
				
				var canNameChange = ( (ary[i].propertyType == PropertyType.NAMED_GROUP)&&(ary[i].matchName !="ADBE Transform Group" ));
				
				if (canNameChange ==true){
					ret += ".property(\"" + ary[i].name +"\")";
				}else{
					ret += ".property(\"" + ary[i].matchName +"\")";
				}
				
			}else if ( ary[i] instanceof Property){
				ret += ".property(\"" + ary[i].matchName +"\")";
			}
		}
		ret +=";\n";
		return ret;

	}
	//作成したコードを収納する
	var codeList = "";
	//ターゲットのコンポのインデックス
	var compIndex = -1;
	var layerIndex = -1;
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
	
		var prA = ac.selectedProperties;
		var cnt = ac.selectedProperties.length
		if ( cnt>0){
			for (var i = 0; i < cnt; i++)
			{
				var a = proPath(prA[i]);
				if ( a.length>0){
					codeList += "//-----------------------------------------------------\n";
					codeList += proPathToString(a,compIndex) +"\n";
				}
			}
			if (codeList != "")
			codeList += "//-----------------------------------------------------\n";
		}
	}
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	this.winObj = new Window("dialog", "Propertyへのアクセス", [154, 203, 154+1024, 203+400]);
	this.gb1 = this.winObj.add("panel", [10, 10, 10+1004, 10+350], "After Effects Properties" );
	this.tbProp = this.gb1.add("edittext", [10, 20, 10+984, 20+320], codeList,{multiline: true,readonly:true } );
	this.btnOK = this.winObj.add("button", [850, 365, 850+98, 365+23], "OK", {name:'ok'});
	//this.label1 = this.winObj.add("statictext", [26, 224, 26+300, 224+12], "item/layerのindexは、状況によって変化するから注意すること" );
	this.winObj.center();

	//フォントを大きく
	var fnt = this.tbProp.graphics.font;
	this.tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

	//---------------
	this.show = function()
	{
		return this.winObj.show();
	}
	//---------------
}
var dlg = new showPropertyPath;
dlg.show();


