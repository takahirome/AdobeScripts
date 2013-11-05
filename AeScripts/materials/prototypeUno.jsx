/*
	prototypeUno.jsx

	「1行スクリプト」 1行の定義は半角255文字以内って事
	1行と言っても読みづらくなるので基本的に80文字位を目安にインデントしてます。
	なんか企画だおれっぽいなぁ^^;

	最終的にはAfter Effects用のprototype.jsを目指すライブラリになりました。

	2011/11/28
*/
(function (){
	//一応無名関数内で設定を行う
	//-------------------------------------------------------------------------
	//ロード確認用の変数
	Application.prototype.uno = {
		version:"1.00"
	}
	//-------------------------------------------------------------------------
	//ファイル名の処理
	//-------------------------------------------------------------------------
	//親フォルダのパスを取り出す。
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	File.prototype.getExt = function() {return this.name.getExt();}
	//拡張子なしのファイル名を取り出す。
	String.prototype.getNameWithoutExt = function(){
		return this.getName().changeExt('');
	}
	File.prototype.getNameWithoutExt = function() {
		return this.name.changeExt('');
	}
	//-------------------------------------------------------------------------
	//Stringの拡張
	//-------------------------------------------------------------------------
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	//文字列の前後の空白・改行コードを取り除く
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//-------------------------------------------------------------------------
	//改行付きの文字列操作
	//-------------------------------------------------------------------------
	//文字列を改行ごとに配列に変換
	String.prototype.toLines =function(){
		var r=this.replaceAll("\r\n","\n"); return r.split("\n");
	}
	//配列を改行区切りの文字列に変換
	Array.prototype.toLineStr = function() {
		var r=this.toString(); return r.replaceAll(",","\r\n");
	}
	//-------------------------------------------------------------------------
	//Arrayの拡張
	//-------------------------------------------------------------------------
	//指定した番号が配列の要素数内であればtrueを返す。
	Array.prototype.indexIn = function(i){
		return ((typeof(i)=="number")&&(i>=0)&&(i<this.length));
	}
	//配列をクリア（要素数を０に)
	Array.prototype.clear = function() {this.length=0;return this;}
	//配列を複製
	Array.prototype.clone = function(){ return [].concat(this);}
	//配列の先頭を取り出す
	Array.prototype.first = function(){
		if (this.length>0)return this[0] else return null;
	}
	//配列の最後を取り出す
	Array.prototype.last = function() {
		if (this.length>0)return this[this.length-1] else return null;
	}
	//指定したインデックス番号の要素を削除
	Array.prototype.removeAt = function(i) {
		if(this.indexIn(i)==true) return this.splice(i,1);else return null;
	}
	//指定したインデックス番号で要素を入れ替える
	Array.prototype.swap = function(s,d) {
		if(this.indexIn(s) && this.indexIn(d)){
			var tmp = this[s]; this[s]=this[d]; this[d]=tmp;
			return this;
		}
	}
	//-------------------------------------------------------------------------
	//Collectionの配列化
	//-------------------------------------------------------------------------
	//コレクションを普通の配列に変換
	ItemCollection.prototype.toArray = 
	LayerCollection.prototype.toArray = 
	function(){
		var r=[];
		if(this.length>0) for(var i=1;i<=this.length;i++) r.push(this[i]);
		return r;
	}
	//配列自身を返す。
	Array.prototype.toArray = function() { return this;}
	//文字列を１文字１文字で配列に変換
	String.prototype.toArray = function(){return this.split('');}
	//-------------------------------------------------------------------------
	//Numberの拡張
	//-------------------------------------------------------------------------
	//値を先頭を０で埋めて３桁して文字列に変換。
	Number.prototype.zero3 = function(){
		var ret=" ";
		var v = this.valueOf();
		if(v<0){
			ret="-";
			v*=-1;
		}
		if (v<10)
			ret+="00"+v;
		else if (v<100)
			ret+="0"+v;
		else
			ret += ""+v;
		return ret;
	}
	//-------------------------------------------------------------------------
	//テキストファイルの読み書き
	//-------------------------------------------------------------------------
	//文字列を読み込む
	File.prototype.loadText = function() {
		var s = "";
		if ((this.exists)&&(this.open("r"))){
			try{
				s = this.read();
				this.close();
			}catch(e){
			}
		}
		return s;
	}
	//文字列を書き込む
	File.prototype.saveText = function(s) {
		var ret =false;
		if (this.open("w")){
			try{
				this.write(s);
				this.close();
				ret = true;
			}catch(e){
			}
		}
		return ret;
	}
	//文字列を書き込む
	String.prototype.save = function(f){
		var ret =false;
		var fl = null;
		if ( f instanceof File) fl = f;
		if ( typeof(f)=="string") fl = new File(f);
		
		if (fl.open("w")){
			try{
				fl.write(this);
				fl.close();
				ret = true;
			}catch(e){
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	//interate
	//配列の要素全てに指定した関数を適応させる。指定する関数の引数に注意
	//-------------------------------------------------------------------------
	Array.prototype.interate = function(fnc){
		if (this.length<=0)return;
		if (fnc instanceof Function){
			for(var i=0;i<this.length;i++){ fnc(this[i],i);}
		}
	}
	
	ItemCollection.prototype.interate = 
	LayerCollection.prototype.interate = 
	function(fnc){
		if (this.length<=0)return;
		if (fnc instanceof Function){
			for(var i=1;i<=this.length;i++){ fnc(this[i],i);}
		}
	}
	
	Property.prototype.interate = function(fnc){
		if (this.numKeys>0){
			if (fnc instanceof Function){
				for(var i=1;i<=this.numKeys;i++){fnc(this,i);}
			}
		}
	}
	//-------------------------------------------------------------------------
	/*
	種類の識別用にFootageItem/CompItem/FolderItemに以下の関数を定義する
	isSound()	wav等のサウンドフッテージならtrue
	isSolid()	平面フッテージならtrue
	isStill()	静止画フッテージならtrue
	isSequence()	動画フッテージならtrue
	isComp()	コンポジションならtrue
	isFolder()	フォルダーアイテムならtrue
	isNotStill()	秒数を持たないアイテム(CompItem動画フッテージ以外)ならtrue
	*/
	FootageItem.prototype.isSound = function(){
		return ((this.hasAudio==true)&&(this.hasVideo==false));
	}
	FootageItem.prototype.isSolid = function(){
		return (this.mainSource.color !=undefined);
	}
	FootageItem.prototype.isStill = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==true));
	}
	FootageItem.prototype.isSequence = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==false));
	}
	FootageItem.prototype.isComp = function(){return false;}
	FootageItem.prototype.isFolder = function(){return false;}
	FootageItem.prototype.isNotStill = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==false));
	}
	
	CompItem.prototype.isSound = function(){return false;}
	CompItem.prototype.isSolid = function(){return false;}
	CompItem.prototype.isStill = function(){return false;}
	CompItem.prototype.isSequence = function(){return false;}
	CompItem.prototype.isComp = function(){return true;}
	CompItem.prototype.isFolder = function(){return false;}
	CompItem.prototype.isNotStill = function(){return true;}
	
	FolderItem.prototype.isSound = function(){return false;}
	FolderItem.prototype.isStill = function(){return false;}
	FolderItem.prototype.isSolid = function(){return false;}
	FolderItem.prototype.isSequence = function(){return false;}
	FolderItem.prototype.isComp = function(){return false;}
	FolderItem.prototype.isFolder = function(){return true;}
	FolderItem.prototype.isNotStill = function(){return false;}
	
	//フッテージアイテムが何も使われていないときはtrue
	FootageItem.prototype.noneUsed = function(){ return (this.usedIn.length <= 0);}
	//-------------------------------------------------------------------------
	//Application objectの拡張
	//-------------------------------------------------------------------------
	//
	Application.prototype.versionNumber = function(){
		this.version.match(/(\d).(\d)(.(\d))?x(.*)/);
		var n=0;
		if (RegExp.$4!="")
			n=RegExp.$4*1;
		return RegExp.$1*100+RegExp.$2*10+n;
	}
	//AfterEffectsのバージョンを文字列で獲得
	Application.prototype.majorVersion = function(){
		var v = Math.floor(this.versionNumber()/10);
		switch(v){
			case 60:return "6";
			case 65:return "6.5";
			case 70:return "7";
			case 80:return "CS3";
			case 90:return "CS4";
			case 100:return "CS5";
			case 105:return "CS5.5";
			case 110:return "CS6";
			default:return ""
		}
	}
	//pushD/popDで使用する変数
	Application.prototype.__pushD__ = [];
	//現在のカレントディレクトリを保存
	Application.prototype.pushD =function(){
		this.__pushD__.push(Folder.current);
	}
	//保存したカレントディレクトリを復帰
	Application.prototype.popD = function(){
		if(this.__pushD__.length>0) Folder.current=this.__pushD__.pop();
	}
	//カレントティレクトリのフルパス(デコード済み)
	Application.prototype.getCurrentPath = function(){
		return File.decode(Folder.current.fullName);
	}
	//カレントティレクトリのフルパス(デコード前)
	Application.prototype.getCurrentPathD = function(){
		return Folder.current.fullName;
		}
	//現在実行中のスクリプトファイル自身の File objectを獲得
	Application.prototype.getScriptFile = function(){
		return new File($.fileName);
	}
	//現在実行中のスクリプトファイル名を獲得(デコード済み)
	Application.prototype.getScriptName = function(){
		return File.decode($.fileName.getName());
	}
	//現在実行中のスクリプトファイル名を獲得(デコード前)
	Application.prototype.getScriptNameD = function(){
		return $.fileName.getName();
	}
	//現在実行中のスクリプトファイル名（拡張子なし）を獲得
	Application.prototype.getScriptTitle = function(){
		return File.decode($.fileName.getNameWithoutExt());
	}
	//現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード済み)
	Application.prototype.getScriptPath = function(){
		return File.decode($.fileName.getParent());
	}
	//現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード前)
	Application.prototype.getScriptPathD = function(){
		return $.fileName.getParent();
	}
	//ものぐさbeginUndoGroup
	Application.prototype.beginUndo = function(s){
		if ((s==null)||(s==undefined)) s = "";
		else s = " "+s;
		this.beginUndoGroup(this.getScriptTitle()+s);
	}
	//ものぐさendUndoGroup
	Application.prototype.endUndo = function(){
		this.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	//接続されているモニタの状態を獲得
	//-------------------------------------------------------------------------
	//PCに接続されているモニタの数を獲得
	Application.prototype.getScreenCount = function(){return $.screens.length;}
	//プライマリーモニタの横ピクセルを獲得
	Application.prototype.getMainScreenWidth = function(){
		return $.screens[0].right - $.screens[0].left;
	}
	//プライマリーモニタの縦ピクセルを獲得
	Application.prototype.getMainScreenHeight = function() {
		return $.screens[0].bottom - $.screens[0].top;
	}
	//プライマリーモニタのサイズを配列で獲得
	Application.prototype.getMainScreenSize = function(){
		return [$.screens[0].right-$.screens[0].left,
			$.screens[0].bottom-$.screens[0].top];
	}
	//セカンダリーモニタの横ピクセルを獲得
	Application.prototype.getSubScreenWidth =function() {
		if ($.screens.length>1)
			return $.screens[1].right - $.screens[1].left; else return 0;
	}
	//セカンダリーモニタの縦ピクセルを獲得
	Application.prototype.getSubScreenHeight = function() {
		if ($.screens.length>1)
			return $.screens[1].bottom - $.screens[1].top; else return 0;
	}
	//セカンダリーモニタのサイズを配列で獲得
	Application.prototype.getSubScreenSize = function(){
		if ($.screens.length>1) 
			return [$.screens[1].right - $.screens[1].left,
				$.screens[1].bottom - $.screens[1].top];
		else
			return [0,0];
	}
	//-------------------------------------------------------------------------
	//CompItemの拡張
	//-------------------------------------------------------------------------
	//コンポの長さをフレーム数で獲得
	CompItem.prototype.getFrame = function(){
		return this.duration*this.frameRate;
	}
	//コンポの長さをフレーム数で設定
	CompItem.prototype.setFrame = function(f){
		this.duration=f/this.frameRate;
	}
	//コンポ・フッテージと同じ大きさ長さのコンポを作成
	CompItem.prototype.createComp = 
	FootageItem.prototype.createComp = 
	function(){
		var r = this.parentFolder.items.addComp(
			this.name,
			this.width,
			this.height,
			this.pixelAspect,
			this.duration,
			this.frameRate);
		r.duration = this.duration;
		return r;
	}
	//コンポの大きさを入力するダイアログの表示。完璧に255文字超えてるな
	Application.prototype.compSizeDialog = function(cmp){
		var w = 1280; var h = 720;
		if ( cmp instanceof CompItem){
			w = cmp.width; h = cmp.height;
		}
		var dlg = new Window("dialog","Comp Size",[0,0,150,90]);
		dlg.add("statictext",[10,10,50,30],"Width;");
		var edW = dlg.add("edittext",[50,10,140,30],w+"");
		dlg.add("statictext",[10,35,50,55],"Height:");
		var edH = dlg.add("edittext",[50,35,140,55],h+"");
		var bOK = dlg.add("button",[10,60,70,85],"ok",{name:'ok'});
		var bCL = dlg.add("button",[75,60,140,85],"cancel",{name:'cancel'});
		
		var ret = null;
		dlg.center();
		if ( dlg.show()<2){
			w = edW.text *1; h = edH.text*1;
			if ( (w!=Number.NaN)&&(h!=Number.NaN)) ret = {width:w,height:h};
		}
		return ret;
		
	}
	//CompItemからもダイアログ表示
	CompItem.prototype.compSizeDialog = function(){
		return Application.prototype.compSizeDialog(this);
	}
	//-------------------------------------------------------------------------
	//AVLayerの拡張
	//-------------------------------------------------------------------------
	//レイヤの分割
	AVLayer.prototype.cutAtTime = function(t){
		if(t==null)
			t=this.time;
		if((t>0)&&(t>this.inPoint)&&(t<this.outPoint)){
			var a=this.duplicate();
			this.outPoint=t;
			a.inPoint=t;
		}
	}
	//レイヤのタイムリマップを０で静止画状態に
	AVLayer.prototype.remapIsOnekey = function(){
		if(this.canSetTimeRemapEnabled){
			this.timeRemapEnabled = true;
			var r=this.timeRemap;
			r.addKey(0);
			if(r.numKeys>1)
				for(var i=r.numKeys;i>1;i--)
					r.removeKey(i);
		}
	}
	AVLayer.prototype.getPos = function() {
		return this.property("ADBE Transform Group").property("ADBE Position");
	}
	AVLayer.prototype.getAnc  = function() {
		return this.property("ADBE Transform Group").property("ADBE Anchor Point");
	}
	AVLayer.prototype.getScale  = function() {
		return this.property("ADBE Transform Group").property("ADBE Scale");
	}
	AVLayer.prototype.getRotZ =
	AVLayer.prototype.getRot  = function() {
		return this.property("ADBE Transform Group").property("ADBE Rotate Z");
	}
	AVLayer.prototype.getRotX  = function() {
		return this.property("ADBE Transform Group").property("ADBE Rotate X");
	}
	AVLayer.prototype.getRotY  = function() {
		return this.property("ADBE Transform Group").property("ADBE Rotate Y");
	}
	AVLayer.prototype.getOpacity  = function() {
		return this.property("ADBE Transform Group").property("ADBE Opacity");
	}
	//-------------------------------------------------------------------------
	//Projectの拡張
	//-------------------------------------------------------------------------
	//フォルダを作成。指定した同じ名前のフォルダがあったらそれを返す。
	FolderItem.prototype.folder =
	Project.prototype.folder = function(s){
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if(this.item(i).name==s)
					return this.item(i);
		}
		return this.items.addFolder(s);
	}
	//-------------------------------------------------------------------------
	//レイヤの選択範囲の処理
	//-------------------------------------------------------------------------
	//レイヤの選択状態を記憶
	CompItem.prototype.selectionPush = function(){
		if(this.numLayers>0)
			for(var i=1;i<=this.numLayers;i++)
				this.layer(i).selSub = this.layer(i).selected;
	}
	//レイヤの選択状態を復帰
	CompItem.prototype.selectionPop = function(){
		if(this.numLayers>0)
			for(var i=1;i<=this.numLayers;i++){
				if(this.layer(i).selSub==null)
					this.layer(i).selSub=false;
				if(this.layer(i).selected!=this.layer(i).selSub)
					this.layer(i).selected=this.layer(i).selSub;
			}
	}
	//レイヤの選択を全て解除
	CompItem.prototype.selectionNone = function(){
		var sl = this.selectedLayers;
		if (sl.length>0)
			for ( var i=sl.length-1; i>=0; i--)
				sl[i].selected = false;
	}
	//-------------------------------------------------------------------------
	//プロジェクトアイテムの選択
	//-------------------------------------------------------------------------
	//アイテムの選択状態を記憶
	Project.prototype.selectionPush = function(){
		if(this.numItems>0)
			for(var i=1;i<=this.numItems;i++)
				this.item(i).selSub = this.item(i).selected;
	}
	//アイテムの選択状態を復帰
	Project.prototype.selectionPop = function(){
		if(this.numItems>0)
			for(var i=1;i<=this.numItems;i++){
				if(this.item(i).selSub==null)
					this.item(i).selSub=false;
				if(this.item(i).selected!=this.item(i).selSub)
					this.item(i).selected=this.item(i).selSub;
			}
	}
	//アイテムの選択を全て解除
	Project.prototype.selectionNone = function(){
		 var sl = this.selection;
		 if (sl.length>0)
		 	for ( var i=sl.length-1; i>=0; i--)
		 		sl[i].selected = false;
	}
	//-------------------------------------------------------------------------
	//アイテムの探索
	//-------------------------------------------------------------------------
	//プロジェクト内のアイテムを名前で探す。結果は配列で返る。
	Project.prototype.findItemByName = function(n){
		var r=[];
		if (this.numItems>0)
			for(var i=1;i<=this.numItems;i++)
				if(this.items[i].name==n)
					r.push(this.items[i]);
		return r;
	}
	//フォルダ内のアイテムを名前で探す。結果は配列で返る。
	FolderItem.prototype.findItemByName = function(n){
		var r=[];
		function F(f){
			if(f.numItems>0)
				for(var i=1;i<=f.numItems;i++){
					 var t=f.item(i);
					if(t instanceof FolderItem)
						F(t)
					else if (t.name == n)
						r.push(t);
				}
		}
		F(this);
		return r;
	}
	//ObjectがAfter Effectsのアイテムかどうか
	Object.prototype.isAEItems = function(){
		return ( 
			(this instanceof CompItem)
			||(this instanceof FootageItem)
			||(this instanceof FolderItem)
		);
	}
	//配列内からCompItemを抽出
	Array.prototype.getComp = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isComp()==true) ret.push(this[i]);
		return ret;
	}
	//配列内からFootageItemを抽出
	Array.prototype.getFootage = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isFootage()==true) ret.push(this[i]);
		return ret;
	}
	//配列内から平面フッテージを抽出
	Array.prototype.getSolid = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isSolid()==true) ret.push(this[i]);
		return ret;
	}
	//-------------------------------------------------------------------------
	//FootageItemの拡張
	//-------------------------------------------------------------------------
	//使用されているフッテージを使用しているレイヤ全てを指定したフッテージに置き換え
	//引数はAVLayer replaceSource() methodと同じ
	FootageItem.prototype.useReplace = function(itm,b){
		var a=this.usedIn;
		if(a.length<=0)return;
		for (var i=0;i<a.length;i++)
			for(p=1;p<=a[i].numLayers;p++){
				var l=a[i].layer(p);
				if(l instanceof AVLayer)
					if(l.source.id==this.id)
						l.replaceSource(itm,b);
			}
	}
	//-------------------------------------------------------------------------
	//アクティブアイテムの獲得
	//-------------------------------------------------------------------------
	//現在アクティブなコンポを返す
	Project.prototype.getActiveComp = function() {
		if (this.activeItem instanceof CompItem) return this.activeItem;
		else return null;
	}
	//現在アクティブなフッテージを返す
	Project.prototype.getActiveFootage = function() {
		if (this.activeItem instanceof FootageItem) return this.activeItem;
		else return null;
	}
	//選択されているコンポを配列で返す。
	Project.prototype.getSelectedComp = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof CompItem)
					ret.push(s[i]);
		return ret;
	}
	//選択されているフォルダアイテムを配列で返す。
	Project.prototype.getSelectedFolder = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof FolderItem)
					ret.push(s[i]);
		return ret;
	}
	//選択されているフォルダを配列で返す。
	Project.prototype.getSelectedFootage = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof FootageItem)
					ret.push(s[i]);
		return ret;
	}
	//現在選択されているプロパティを配列で返す。
	Project.prototype.selectedProperties = function(){
		var ret=[];
		var p = this.getActiveComp();
		if (p!=null){
			if (p.selectedLayers.length==1){
				ret = p.selectedLayers[0].selectedProperties;
			}
		}
		return ret;
	}
	//現在選択されているレイヤを配列で返す。
	Project.prototype.selectedLayers = function(){
		var ret=[];
		var p=this.getActiveComp();
		if (p!=null){
			ret=p.selectedLayers;
		}
		return ret;
	}
	//フォルダーアイテム内のCompItemを獲得
	Project.prototype.getComp =
	FolderItem.prototype.getComp =
	function(){
		var ret=[];
			if(this.numItems>0){
				for(var i=1;i<=this.numItems;i++)
					if ( this.item(i).isComp()==true)
						ret.push(this.item(i));
			}
			return ret;
	}
	//フォルダーアイテム内のFootageItemを獲得
	Project.prototype.getFootage =
	FolderItem.prototype.getFootage =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isFootage()==true)
					ret.push(this.item(i));
		}
		return ret;
	}
	//フォルダーアイテム内のFolderItemを獲得
	Project.prototype.getFolderItem =
	FolderItem.prototype.getFolderItem =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isFolder()==true)
					ret.push(this.item(i));
		}
		return ret;
	}
	//フォルダーアイテム内の平面フッテージを獲得
	Project.prototype.getSolid =
	FolderItem.prototype.getSolid =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isSolid()==true)
					ret.push(this.item(i));
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	//Propertyの拡張
	//-------------------------------------------------------------------------
	//指定された時間にキーフレームがあったらtrue
	Property.prototype.isKeyAtTime = function(t){
		return ( this.keyTime(this.nearestKeyIndex(t)) == t);
	}
	//キーフレームを全て削除
	Property.prototype.keyClear = function(){
		if( this.numKeys>0){
			var v=this.value;
			for(var i=this.numKeys;i>=1;i--) this.removeKey(i);
			this.setValue(v);
		}
	}
	//キーフレームを最初の１個のみにする
	Property.prototype.keyFreeze = function(){
		this.addKey(0);
		if(this.numKeys>1) for(var i=this.numKeys; i>1;i--)this.removeKey(i);
	}
	//このプロパティのあるLayer objectを返す
	Property.prototype.getParentLayer = function(){
		var ret=this.parentProperty;
		while(ret!=null){
			if ((ret instanceof AVLayer)||(ret instanceof ShapeLayer)
			||(ret instanceof TextLayer)) break;
			ret = ret.parentProperty;
		}
		return ret;
	}
	//全てのキーフレームを選択。引数にfalseを入れると全ての選択を解除
	Property.prototype.keySelectedAll = function(b){
		if ( this.numKeys>0){
			if ((b==null)||(typeof(b)!="boolean")) b = true;
			for(var i=1; i<=this.numKeys; i++) this.setSelectedAtKey(i,b);
		}
	}
	//-------------------------------------------------------------------------
	//Window objectの拡張
	//-------------------------------------------------------------------------
	//ウィンドウの表示位置を右上に設定
	Window.prototype.rightTop = function(){
		var b = this.bounds;
		var w = b[2]-b[0];
		var h = b[3]-b[1];
		var s = $.screens[0];
		b[0] = s.right - w - 40;
		b[1] = s.top + 40;
		b[2] = b[0] + w;
		b[3] = b[1] + h;
		this.location = [b[0],b[1]];
		this.bounds = b;
	}
	//-------------------------------------------------------------------------
	//デバッグ用の出力コンソール
	//もはや1行スクリプトじゃねぇ
	Application.prototype.debugConsole = null;
	function degugConsole()
	{
		var dlg = new Window("palette","debugConsole",[0,0,200,100],{resizeable:true});
		var ed = dlg.add("edittext",[0,20,200,100],"",{readonly:true,multiline:true});
		var btn = dlg.add("button",[5,0,65,20],"clear");
		var bBounds = dlg.Bounds;
		dlg.rightTop();
		dlg.onResize = function(){
			var bBounds = dlg.bounds;
			var be = ed.bounds;
			be[0] = 0;
			be[1] = 20;
			be[2] = bBounds[2]-bBounds[0];
			be[3] = bBounds[3]-bBounds[1];
			ed.bounds = be;
			
		}
		btn.onClick = function(){ ed.text = "";}
		dlg.onClose = function(){
			Application.prototype.debugConsole = null;
		}
		this.show = function(){dlg.show();}
		this.put = function(s){ ed.text = s;dlg.update();}
		this.write = function(s){ ed.text += s;dlg.update();}
		this.writeLn = function(s){ ed.text += s+"\n";dlg.update();}
		this.insert = function(s){ ed.text = s +"\n"+ed.text;dlg.update();}
		this.clear = function(s){ ed.text = "";dlg.update();}
		this.update = function() { dlg.update();}
		this.close = function() { dlg.close();}
	}
	Application.prototype.showDebugConsole = function(){
		if (Application.prototype.debugConsole == null)
			Application.prototype.debugConsole = new degugConsole;
		Application.prototype.debugConsole.show();
	}
	Application.prototype.dbPut = function(s){
		if (Application.prototype.debugConsole == null) {
			Application.prototype.debugConsole = new degugConsole;
		}
		Application.prototype.debugConsole.show();
		Application.prototype.debugConsole.put(s);
	}
	Application.prototype.dbInsert = function(s){
		if (Application.prototype.debugConsole == null) {
			Application.prototype.debugConsole = new degugConsole;
		}
		Application.prototype.debugConsole.show();
		Application.prototype.debugConsole.insert(s);
	}
	Application.prototype.dbWrite = function(s){
		if (Application.prototype.debugConsole == null) {
			Application.prototype.debugConsole = new degugConsole;
		}
		Application.prototype.debugConsole.show();
		Application.prototype.debugConsole.write(s);
	}
	Application.prototype.dbWriteLn = function(s){
		if (Application.prototype.debugConsole == null) {
			Application.prototype.debugConsole = new degugConsole;
		}
		Application.prototype.debugConsole.show();
		Application.prototype.debugConsole.writeLn(s);
		
	}
	Application.prototype.dbClear = function(){
		if (Application.prototype.debugConsole == null) {
			Application.prototype.debugConsole = new degugConsole;
			Application.prototype.debugConsole.show();
		}else{
			Application.prototype.debugConsole.show();
			Application.prototype.debugConsole.clear();
		}
	}
	Application.prototype.dbClose = function(){
		if (Application.prototype.debugConsole != null) {
			Application.prototype.debugConsole.close();
			Application.prototype.debugConsole = null;
		}
	}
	//-------------------------------------------------------------------------
})();
/*
	以下に使い方のサンプル。
*/
//-----------------------------------------------
/*
//使っていない平面を集めるサンプル
app.beginUndo();
var f = app.project.folder("使ってない平面");
app.project.getSolid().interate(
	function(t){
		if ( t.noneUsed()) t.parentFolder = f;
	}
);
app.endUndo();
*/
//-----------------------------------------------
//文字列の簡単な保存
// ("AAAAA").save("aaaa.txt");
//-----------------------------------------------
//深い階層のフォルダを作成。
//同名フォルダがあったらそれを返す。
//var fld = app.project.folder("foo1").folder("foo2").folder("foo3");
//-----------------------------------------------
/*
var p = app.project.item(1).compSizeDialog();
if ( p!=null){
	alert(p.width +"/"+p.height);
}*/
//-----------------------------------------------
/*
app.showDebugConsole();
app.dWriteLn("a");
app.dWriteLn("bbb");
*/
//-----------------------------------------------
/*
//選択したレイヤの位置をシフトする
var shiftPos = [100,50];
app.beginUndo();
app.project.selectedLayers().interate(
	function(tLayer){
		function sft(v){ return [ v[0]+shiftPos[0], v[1]+shiftPos[1] ];}
		var p = tLayer.getPos();
		if ( p.numKeys==0){
			p.setValue(sft(p.value));
		}else{
			p.interate(
				function(pro,idx){
					pro.setValueAtKey(idx, sft(pro.keyValue(idx)));
				}
			);
		}
	}
);
app.endUndo();
*/
//-----------------------------------------------
