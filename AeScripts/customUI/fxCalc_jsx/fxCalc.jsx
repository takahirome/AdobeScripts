/*
	電卓サンプル
	
	ScriptUI Panelsフォルダに入れて、ウィンドウメニューから表示か、直接実行。
*/
//UIを作成するクラス
function fxCalcPanel(me)
{	//---------------

	//パネル or パレットを切り替える
	// ? はすきじゃないけどScript Guideからのコピペなので
	this.winObj = ( me instanceof Panel) ? me : 
		new Window("palette", "fxCalc", [88, 116, 88+277, 116+253]);

	this.lbInput = this.winObj.add("statictext", [63, 30, 63+208, 30+21], "None Input" );
	this.lbResult = this.winObj.add("statictext", [63, 9, 63+208, 9+21], "None Input" );
	this.lbResult.justify = "right";
	this.lbInput.justify = "right";
	this.btnMC = this.winObj.add("button", [10, 55, 10+36, 55+32], "MC");
	this.btnMR = this.winObj.add("button", [10, 89, 10+36, 89+32], "MR");
	this.btnMEq = this.winObj.add("button", [10, 122, 10+36, 122+32], "M=");
	this.btnMpls = this.winObj.add("button", [10, 156, 10+36, 156+32], "M+");
	this.btnMminus = this.winObj.add("button", [10, 189, 10+36, 189+32], "M-");
	this.btnInput0 = this.winObj.add("button", [52, 180, 52+36, 180+36], "0");
	this.btnInput1 = this.winObj.add("button", [52, 138, 52+36, 138+36], "1");
	this.btnInput2 = this.winObj.add("button", [94, 138, 94+36, 138+36], "2");
	this.btnInput3 = this.winObj.add("button", [136, 138, 136+36, 138+36], "3");
	this.btnInput4 = this.winObj.add("button", [52, 96, 52+36, 96+36], "4");
	this.btnInput5 = this.winObj.add("button", [94, 96, 94+36, 96+36], "5");
	this.btnInput6 = this.winObj.add("button", [136, 96, 136+36, 96+36], "6");
	this.btnInput7 = this.winObj.add("button", [52, 54, 52+36, 54+36], "7");
	this.btnInput8 = this.winObj.add("button", [94, 54, 94+36, 54+36], "8");
	this.btnInput9 = this.winObj.add("button", [136, 54, 136+36, 54+36], "9");
	this.btnMinus = this.winObj.add("button", [94, 180, 94+36, 180+36], "+/-");
	this.btnDot = this.winObj.add("button", [136, 180, 136+36, 180+36], ".");
	this.btnAdd = this.winObj.add("button", [193, 180, 193+36, 180+36], "＋");
	this.btnSub = this.winObj.add("button", [193, 138, 193+36, 138+36], "－");
	this.btnMult = this.winObj.add("button", [193, 96, 193+36, 96+36], "×");
	this.btnDiv = this.winObj.add("button", [193, 54, 193+36, 54+36], "÷");
	this.btnEq = this.winObj.add("button", [235, 180, 235+36, 180+36], "＝");
	this.btnBS = this.winObj.add("button", [235, 138, 235+36, 138+36], "BS");
	this.btnCL = this.winObj.add("button", [235, 96, 235+36, 96+36], "C");
	this.btnCA = this.winObj.add("button", [235, 54, 235+36, 54+36], "CA");
	this.lbMem = this.winObj.add("statictext", [8, 228, 8+74, 228+15], "None Mem" );
	this.lbFrameRate = this.winObj.add("statictext", [115, 231, 115+32, 231+12], "FPS" );
	this.tbFrameRate = this.winObj.add("edittext", [153, 227, 153+27, 227+19], "24" );
	this.cbIsSecKoma = this.winObj.add("checkbox", [186, 230, 186+82, 230+16], "SS+FF形式" ); this.cbIsSecKoma.value = true;
	this.lbAction = this.winObj.add("statictext", [8, 30, 8+49, 30+21], "＝" );


	//---------------
	//パレットなら表示
	if (!( me instanceof Panel))
	{
		this.winObj.center();
		this.winObj.show();
	}
}

//*****************************************************************************
/*
	時間を便利に扱うObject
*/
//*****************************************************************************
function fxTime(v,f)
{
	//*************************************************************
	//明示的に数値と宣言
	var value = 0;
	//数値が負数かどうか
	var isMinus = false;
	var frameRate = 24;
	//引数が数字ならその値で初期化する
	if ( isNaN(v)==false){
		value =v;
		if (value<0) {
			isMinus = true;
			value = Math.abs(v);
		}
	}
	if ( isNaN(f)==false){
		farmeRate = f;
	}
	//*************************************************************
	function zero2(v)
	{
		if (v<10) { return "0" + v; }
		else { return v +""; }
	}
	//*************************************************************
	this.setDuration = function(v)
	{
		if ( isNaN(v) ==false){
			value = v;
			if ( value <0) {
				isMinus = true;
				value = Math.abs(value);
			}else{
				isMinus = false;
			}
		}
	}
	//*************************************************************
	this.setDurationStr = function(s)
	{
		var v = strToNum(s);
		if ( isNaN(v) ==false){
			value = v;
			if ( value <0) {
				isMinus = true;
				value = Math.abs(value);
			}else{
				isMinus = false;
			}
		}
	}
	//*************************************************************
	this.getDuration = function()
	{
		var s ="";
		if ( isMinus == true) {
			return value * -1;
		}else{
			return value;
		}
	}
	//*************************************************************
	this.setFrameRate = function(v)
	{
		if ( isNaN(v) ==false){
			frameRate = v;
		}
	}
	//*************************************************************
	this.getFrameRate = function()
	{
		return frameRate;
	}
	//*************************************************************
	//valueを、Sec+Frame形式の文字列で返す
	this.getSecKoma = function()
	{
		if ( value == 0) {
			return "0+00";
		}
		var s = "";
		if ( isMinus== true) s += "-";
		var frm = Math.round( value * frameRate);
		var fr = Math.round(frameRate);
		
		s += Math.floor(frm / fr) +"";
		s += "+" + zero2(Math.round(frm % fr));
		return s;
	}
	//*************************************************************
	function strToNum(s)
	{
		var v = 0;
		try
		{
			v = eval(s);
			return v;
		}catch(e){
			//alert("strToNum: "+e);
			return Number.NaN;
		}
	}
	//*************************************************************
	//Sec+Frame形式の文字列をvalueに変換
	this.setSecKoma = function(s)
	{
		if ( s == "") {
			value = 0;
			return;
		}
		var ret = "";
		var mFlag = false;
		for ( var i=0; i<s.length; i++){
			var c = s.charAt(i);
			//全角対策
			//今回の使い方では必要ないけど念のため
			if (c == "０") c = "0";
			else if (c == "１") c = "1";
			else if (c == "２") c = "2";
			else if (c == "３") c = "3";
			else if (c == "４") c = "4";
			else if (c == "５") c = "5";
			else if (c == "６") c = "6";
			else if (c == "７") c = "7";
			else if (c == "８") c = "8";
			else if (c == "９") c = "9";
			else if (c == "＋") c = "+";
			else if (c == "秒") c = "+";
			else if (c == ".") c = "+";
			else if (c == "－") c = "-";
			
			if ( (( c>="0")&&(c<="9")) || (c == "+") ){
				ret += c;
			}else if ( (i==0)&&(c=="-")){
				mFlag = true;
			}
			
		}
		if ( ret == "") {
			value = 0;
			return;
		}
		var sa = ret.split("+");
		switch(sa.length)
		{
			case 1:
				var v = strToNum(sa[0]);
				if ( isNaN(v) == false) {
					//value = v / frameRate;　//こっちにするとコマ数が優先される
					value = v;
					isMinus = ( mFlag == true);
				}
				break;
			case 2:
			default:
				var v0 = strToNum(sa[0]);
				var v1 = strToNum(sa[1]);
				if ( ( isNaN(v0) == false)&&( isNaN(v1) == false) ){
				 	value = v0  + (v1 / frameRate);
					isMinus = ( mFlag == true);
				 }
				break;
		}
	}
	//*************************************************************
}
//*****************************************************************************
/*
	電卓オブジェクト
*/
//*****************************************************************************
function fxCalc(p)
{
	//計算用
	var result = new fxTime(0,24);
	//メモリー用
	var mem = new fxTime(0,24);
	//入力文字
	var inputLine = "";
	
	//UIを作成
	var pal = new fxCalcPanel(p);
	
	//初期値をUIと一致させる
	pal.tbFrameRate.text = "24";
	pal.cbIsSecKoma.value = true;

	var actionMode = "＝";
	var isSecKomaMode = true;
	
	//ダブルクリック対策のフラグ
	var isPush = false;

	//---------------------------------
	//内部変数を画面に表示
	function disp()
	{
		if (inputLine == "") {
			pal.lbInput.text = "None Input";
		}else{
			pal.lbInput.text = inputLine;
		}
		if (isSecKomaMode == true) {
			pal.lbResult.text = result.getSecKoma();
			pal.lbMem.text = "M: " + mem.getSecKoma();
		}else{
			pal.lbResult.text = result.getDuration();
			pal.lbMem.text = "M: " + mem.getDuration();
		}
	}
	//***********************************************************************
	//以下、シングルクリック機能
	//***********************************************************************
	//---------------------------------
	function clearAll()
	{
		result.setDuration(0);
		inputLine = "";
		pal.lbAction.text = "";
		disp();
	}
	//---------------------------------
	function clear()
	{
		inputLine = "";
		disp();
	}
	//---------------------------------
	function backSpace()
	{
		if ( inputLine != ""){
			inputLine = inputLine.substr(0,inputLine.length-1);
			disp();
		}
	}
	//---------------------------------
	function changeMinus()
	{
		if ( inputLine != ""){
			if ( inputLine[0] == "-") inputLine = inputLine.substr(1,inputLine.length-1);
			else inputLine = "-" + inputLine;
			disp();
		}
	}
	//---------------------------------
	function MemClear()
	{
		mem.setDuration(0);
		disp();
	}
	//---------------------------------
	function MemReturn()
	{
		if (isSecKomaMode == true) {
			inputLine = mem.getSecKoma();
		}else{
			inputLine = mem.getDuration();
		}
		disp();
	}
	//---------------------------------
	function MemPluss()
	{
		mem.setDuration(mem.getDuration() + result.getDuration());
		
		disp();
	}
	//---------------------------------
	function MemMinus()
	{
		mem.setDuration(mem.getDuration() - result.getDuration());
		
		disp();
	}
	//---------------------------------
	function MemEq()
	{
		mem.setDuration(result.getDuration());
		
		disp();
	}
	//***********************************************************************
	//計算の実装
	//***********************************************************************
	//---------------------------------
	function calcExec(c)
	{
		//入力がなければ計算しない
		
		if ( inputLine != ""){
			var tm = new fxTime();
			if ( isSecKomaMode == true) tm.setSecKoma(inputLine);
			else tm.setDurationStr(inputLine);
	
			//保存してあったactionModeに応じて計算を行う
			//ただし＝だけは特別扱い
			if ( actionMode == "＝"){
				result.setDuration( tm.getDuration() );
			}else if ( ( actionMode == "＋")||( actionMode == "")||( actionMode == "＝")){
				result.setDuration(result.getDuration() + tm.getDuration() );
			}else if ( actionMode == "－"){
				result.setDuration(result.getDuration() - tm.getDuration() );
			}else if ( actionMode == "×"){
				result.setDuration(result.getDuration() * tm.getDuration() );
			}else if ( actionMode == "÷"){
				if ( tm.getDuration() != 0){
					result.setDuration(result.getDuration() / tm.getDuration() );
				}
			}else{
				result.setDuration( tm.getDuration() );
			}
		}
		//actionModeの更新
		actionMode = c;
		pal.lbAction.text = c;
	}
	//---------------------------------
	function singleAction(c)
	{
		if ( c=="CA" ) {
			clearAll();
		}else if ( c=="C" ) {
			clear();
		}else if ( c=="BS" ) {
			backSpace();
		}else if ( c=="+/-" ) {
			changeMinus();
		}else if ( c=="MC" ) {
			MemClear();
		}else if ( c=="MR" ) {
			MemReturn();
		}else if ( c=="M+" ) {
			MemPluss();
		}else if ( c=="M-" ) {
			MemMinus();
		}else if ( c=="M=" ) {
			MemEq();
		}else {
			calcExec(c);
			inputLine = "";
			disp();
		}
	}
	//---------------------------------
	function inputBtnSecKoma()
	{
		if ( isPush == true) return; //ダブルクリック対策
		isPush = true;

		getFrameRate();

		var c = this.text;
		if ( c =="." ){
			if ( inputLine.indexOf("+")<0) {
				if ( inputLine == "") inputLine = "0+";
				else inputLine += "+";
			}
			disp();
		}else if ( (c>="0")&&(c<="9") ) {
			inputLine += c;
			disp();
		}else{
			singleAction(c);
		}
		
		isPush = false;
	}
	//---------------------------------
	function inputBtn()
	{
		if ( isPush == true) return; //ダブルクリック対策
		isPush = true;

		getFrameRate();
		
		var c = this.text;
		if ( c =="." ){
			if ( inputLine.indexOf(".")<0) {
				if ( inputLine == "") inputLine = "0.";
				else inputLine += ".";
			}
			disp();
		}else if ( (c>="0")&&(c<="9") ) {
			inputLine += c;
			disp();
		}else{
			singleAction(c);
		}
		
		isPush = false;
	}
	
	//---------------------------------
	//表示モードによって関数を切り替え。
	//関数段階でも可能だが、関数が分かりづらくなったのでこっちの方法に
	//---------------------------------
	function setBtnExec(v)
	{
		pal.btnMC.onClick = 
		pal.btnMR.onClick = 
		pal.btnMEq.onClick = 
		pal.btnMpls.onClick = 
		pal.btnMminus.onClick = 
		pal.btnInput0.onClick = 
		pal.btnInput1.onClick = 
		pal.btnInput2.onClick = 
		pal.btnInput3.onClick = 
		pal.btnInput4.onClick = 
		pal.btnInput5.onClick = 
		pal.btnInput6.onClick = 
		pal.btnInput7.onClick = 
		pal.btnInput8.onClick = 
		pal.btnInput9.onClick = 
		pal.btnMinus.onClick = 
		pal.btnDot.onClick = 
		pal.btnAdd.onClick = 
		pal.btnSub.onClick = 
		pal.btnMult.onClick = 
		pal.btnDiv.onClick = 
		pal.btnEq.onClick = 
		pal.btnBS.onClick = 
		pal.btnCL.onClick = 
		pal.btnCA.onClick = v;
	}
	//初期状態を設定ｓ
	setBtnExec(inputBtnSecKoma);
	//---------------------------------
	pal.cbIsSecKoma.onClick = function()
	{
		if ( isPush == true) return; //ダブルクリック対策
		isPush = true;
		isSecKomaMode =  pal.cbIsSecKoma.value;

		if ( isSecKomaMode == true) {setBtnExec(inputBtnSecKoma);}
		else {setBtnExec(inputBtn);}
		
		inputLine = "";
		disp();
		isPush = false;
	}
	//---------------------------------
	function getFrameRate()
	{
		var s = pal.tbFrameRate.text;
		try
		{
			var fr = eval(s);
			if ( isNaN(fr) == false){
				result.setFrameRate(fr);
				mem.setFrameRate(fr);
			}
		}catch(e){
			result.setFrameRate(24);
			mem.setFrameRate(24);
			pal.tbFrameRate.text = "24";
		}
	}
	//---------------------------------
}
//オブジェクトを作成
var myCalc = new fxCalc(this);

