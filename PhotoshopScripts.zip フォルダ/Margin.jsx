/* 
<javascriptresource>
<name>Margin</name>
<category>web</category>
</javascriptresource>
*/


var savedState = activeDocument.activeHistoryState,
    firstRun = true;
/* functions */

function getSelectedLayersIdx(){
    var selectedLayers = [];
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var desc = executeActionGet(ref);
    if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
        desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
        var c = desc.count 
        var selectedLayers = new Array();
        for(var i=0;i<c;i++){
            try{ 
                activeDocument.backgroundLayer;
                selectedLayers.push(  desc.getReference( i ).getIndex() );
            }catch(e){
                selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
            }
        }
    }else{
        var ref = new ActionReference(); 
        ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" )); 
        ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
        try{ 
            activeDocument.backgroundLayer;
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
        }catch(e){
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
        }
    }
    return selectedLayers;
}


function makeActiveByIndex( idx, visible ){
    for( var i = 0; i < idx.length; i++ ){
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID( "Lyr " ), idx[i])
        desc.putReference( charIDToTypeID( "null" ), ref );
        if( i > 0 ) {
            var idselectionModifier = stringIDToTypeID( "selectionModifier" );
            var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
            var idaddToSelection = stringIDToTypeID( "addToSelection" );
            desc.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
        }
        desc.putBoolean( charIDToTypeID( "MkVs" ), visible );
        executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
    }   
}


function getSelectedLayers()
{
    var sl = getSelectedLayersIdx();
    var sLayers = new Array();
    for( var i = 0; i < sl.length; i++ ){
        makeActiveByIndex( [ sl[ i ] ], false );
        sLayers.push( activeDocument.activeLayer );
    }
    makeActiveByIndex( sl, false );
    return sLayers;
}

function eachLayer(fn)
{
    var sl = getSelectedLayersIdx();

    for( var i = 0; i < sl.length; i++ ){
        makeActiveByIndex( [ sl[ i ] ], false );
        fn.apply(activeDocument.activeLayer,[i]);
    }
    makeActiveByIndex( sl, false );
}


/*            MyLayer (Class)          */
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

}

  // Class statement
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
    this.layer.translate(x - this.left , y - this.top);
}

/*            MyLayer (Class) end          */




/*        main        */
function margin(gap){
    var startPos={};
    eachLayer(function(index){
        var currentLayer = new MyLayer(this);
        if(index == 0){
            startPos.x = gap.x==0 ? currentLayer.left : currentLayer.left + currentLayer.width + gap.x;
            startPos.y = gap.y==0 ? currentLayer.top : currentLayer.top + currentLayer.height + gap.y;
            return;
        }

        currentLayer.translate(startPos.x,startPos.y);
        if(gap.x!=0)
        {
            startPos.x += currentLayer.width + gap.x;
        }
        if(gap.y!=0)
        {
            startPos.y += currentLayer.height + gap.y;
        }

    });

    refresh();
}
/*      main end      */



/* User Interface */

var win = new Window( "dialog" , "margin");
win.bounds = { x:600 , y:400 , width:270 , height:160};
win.opacity = .7;

win.text_mr = win.add("statictext" , {width:100,height:20,x:10,y:10} , "margin-right");
win.etext_mr = win.add("edittext" , {width:40,height:20,x:85,y:10} , "0");
win.slider_mr = win.add("slider", {width:250,height:10,x:10,y:30} , 0 , 0 , 250 );

win.text_mt = win.add("statictext" , {width:100,height:20,x:10,y:60} , "margin-top");
win.etext_mt = win.add("edittext" , {width:40,height:20,x:85,y:60} , "0");
win.slider_mt = win.add("slider", {width:250,height:10,x:10,y:80} , 0 , 0 , 250 );


win.okbtn = win.add("button", {width:75,height:25,x:10,y:120} , "OK",{name:"ok"});
win.apbtn = win.add("button", {width:75,height:25,x:95,y:120} , "Apply");
win.cnbtn = win.add("button", {width:75,height:25,x:180,y:120} , "Cancel",{name:"cancel"});


win.slider_mr.onChanging = function(){
    win.etext_mr.text = parseInt(win.slider_mr.value);
};
win.etext_mr.onChanging = function(){
    win.slider_mr.value = parseInt(win.etext_mr.text);
};

win.slider_mt.onChanging = function(){
    win.etext_mt.text = parseInt(win.slider_mt.value);
};
win.etext_mt.onChanging = function(){
    win.slider_mt.value = parseInt(win.etext_mt.text);
};

win.apbtn.onClick = function(){
    firstRun = false;
    var gap = {x:win.slider_mr.value , y:win.slider_mt.value};
    activeDocument.suspendHistory('margin', 'margin(gap)'); //margin(gap);
};

win.okbtn.onClick = function(){
    if(firstRun){
        var gap = {x:win.slider_mr.value , y:win.slider_mt.value};
        activeDocument.suspendHistory('margin', 'margin(gap)'); //margin(gap);
        win.close();
    }else{
        win.close();
    }
}

win.cnbtn.onClick = function(){
    activeDocument.activeHistoryState = savedState;
    win.close();
};

win.show();

/* User Interface(end) */