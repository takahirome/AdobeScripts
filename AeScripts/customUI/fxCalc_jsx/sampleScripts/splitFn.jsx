//指定されたファイル名を拡張子とそれ以外に分けて返す。
function splitFileExt(s)
{
	var ret = new Object;
	ret.nameWithoutExt = "";
	ret.ext = "";
	if ( s != "") {	
		var idx = s.lastIndexOf(".");
		if ( idx<0) {
			ret.nameWithoutExt = s;
		}else{
			ret.nameWithoutExt = s.substr(0,idx);
			ret.ext = s.substr(idx);
		}
	}
	return ret;
}

var fn = "a_001.tga";
var o = splitFileExt(fn);
alert(o.nameWithoutExt +"\n" + o.ext);
