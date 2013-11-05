/* 
<javascriptresource>
<name>Make Sprite</name>
<category>web</category>
</javascriptresource>
*/

  function getSize(layer)
  {
    var height = parseInt (layer.bounds[3]) - parseInt (layer.bounds[1]);
    var width = parseInt (layer.bounds[2]) - parseInt (layer.bounds[0]);
    return {height:height, width:width};
  }
  
  function getPosition(layer)
  {
  
	var left = parseInt(layer.bounds[0]);
	var top = parseInt(layer.bounds[1]);
	
	return {left:left,top:top};

	//aLayer.name = "background-position: "+left+"px "+top+"px;";
  
  
  }
  
  /*            MyLayer (Class)          */
  function MyLayer(layer)
  {
	  var size = getSize(layer),
	  position = getPosition(layer);
	  
	  this.layer = layer;
	  this.width = size.width;
	  this.height = size.height;
	  this.left = position.left;
	  this.top = position.top;
  }
  
  MyLayer.prototype.translate = function(x,y){
  var original_top = parseInt (this.layer.bounds[1]),
	original_left = parseInt (this.layer.bounds[0]);
           
    this.layer.translate(x-original_left , y-original_top,);
  }

  /*            MyLayer (Class) end          */
  
  /*    main   */
  function main()
  {
	var aLayers = activeDocument.layers,
  length = aLayers.length,
  offsetY = 10,
  dis_y = 0,
  max_width =0;
  
  for(var i=length-1; i>=0; i--)
  {
	if(!aLayers[i].isBackgroundLayer && aLayers[i].visible){
		var mLayer = new MyLayer(aLayers[i]); //mLayer = my Layer
		var width = mLayer.width;
		
		mLayer.layer.name = "background-position: "+0+"px -"+dis_y+"px;\nwidth: "+mLayer.width+"px; height: "+mLayer.height+"px;";
		mLayer.translate(0,dis_y);
		dis_y += mLayer.height+offsetY;
		max_width = width > max_width ? width : max_width;
	}
  
  }
  
  
  activeDocument.resizeCanvas (max_width,dis_y-offsetY, AnchorPosition.TOPLEFT);
  }
  
activeDocument.suspendHistory('Make Sprite', 'main()');
  
  
  
  