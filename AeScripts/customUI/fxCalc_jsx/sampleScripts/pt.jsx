Number.prototype.getSecKoma = function(fps)
{
	function zero2(v)
	{
		if ( v<10) return "0"+v;
		else return v + "";
	}
	
	var fr = fps;
	if ( isNaN(fr)==true) fr =24;
	var v = this.valueOf();
	
	var fm = Math.round( v * fps);
	
	s ="";
	s += Math.floor(fm / fr) +"";
	s += "+";
	s + zero2(Math.round(fm % fr));
	return s;
}

var num = 3.5;
alert(num.getSecKoma(24));
