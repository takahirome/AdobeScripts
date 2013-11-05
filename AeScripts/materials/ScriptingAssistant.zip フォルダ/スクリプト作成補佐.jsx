//-------------------------------------------------------------------------
function rec_utils(t)
{
	this.palette		= t;
	this.current		= Folder.current;
	this.scriptFolder	= new Folder(this.current.absoluteURI + "/(ForScript)");

	this.btnList = new Array;
	
	
	this.btnWidth	= 190;
	this.btnHeight	= 25;
	this.btnLeft	= 5;
	this.btnTop		= 5;
	this.btnInter	= 8;
	
	//-----------------------------
	this.onScriptButtonClick = function()
	{
		var prevCurrentFolder = Folder.current;
		Folder.current = this.scriptFolder;
		this.file.open();
		eval(this.file.read());
		this.file.close();
		Folder.current = prevCurrentFolder;

	}
	//-----------------------------
	this.capMake = function(f)
	{
		var s = File.decode(f.name);
		if (s=="") return "";
		var idx = s.lastIndexOf(".");
		if (idx>-1) {
			s = s.substring(0,idx);
		}
		if (s=="") return "";
		
		var idx = -1;
		for (var i=0; i<s.length;i++){
			var c = s[i];
			if ( ( (c>="0")&&(c<="9") )||(c=="_")||(c=="-")||(c==".") ) {
			}else{
				idx = i;
				break;
			}
		}
		if (idx>=0) {
			s = s.substring(idx);
		}
		return s;
	}
	//-----------------------------
	this.exec = function()
	{
		var files = this.scriptFolder.getFiles("*.jsx");
		if (files.length<=0) return false;
		
		var x0 = this.btnLeft;
		var x1 = x0 + this.btnWidth;
		for (var i=0; i<files.length;i++){
			var name = this.capMake(files[i]);
			var y0 = this.btnTop + (this.btnHeight + this.btnInter) *i;
			var y1 = y0 + this.btnHeight;
			var btn = this.palette.add("button",[x0,y0,x1,y1],name);
			btn.file = files[i];
			btn.scriptFolder = this.scriptFolder;
			btn.justify = "left";
			btn.onClick = this.onScriptButtonClick;
			this.btnList.push(btn);
		}
	}

}///-----------------------------------------------------------------------

var ru = new rec_utils(this);
ru.exec();

