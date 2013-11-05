/* 
<javascriptresource>
<name>Get CSS</name>
<category>web</category>
</javascriptresource>
*/

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


function checkSelection()
{
    var flag = true;
    try {
        var bounds = activeDocument.selection.bounds;
    }catch(e){
        flag = false;
    }
    return flag;
}

function getSP(bounds)  // get size and position
{
    var left = bounds[0],
    top = bounds[1],
    width = parseInt(bounds[2])-parseInt(bounds[0]),
    height = parseInt(bounds[3])-parseInt(bounds[1]);

    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}

function getCSS(sp,pos){ //get size and position
    var bgPosition = "background-position: "+(-parseInt(sp.left))+"px "+(-parseInt(sp.top))+"px;";
    var size = "width: "+sp.width+"px; height: "+sp.height+"px;";
    if(pos)
    {
        var pos = "left: "+(-parseInt(sp.left))+"px; "+ "top: "+ (-parseInt(sp.top))+"px;";
        return bgPosition + "\n" + size + "\n" + pos;
    }
    else
    {
        return bgPosition + "\n" + size;
    }
    
}



/*        main        */


if(checkSelection()){
    var arg =
"dialog {\
alignChildren: 'fill',\
orientation: 'column',\
options: Panel { alignChildren: 'left',\
    text: 'Output Options',\
    bgPos: Checkbox { text: 'background-position', value:true},\
    wh: Checkbox { text: 'width and height', value:true},\
    pos: Checkbox { text: 'left and top', value:false}\
},\
code: EditText { \
    text: 'code',\
    Dimension: [500,90]\
},\
okbtn: Button {text:'OK'}\
}";

var allCss = getCSS( getSP(activeDocument.selection.bounds) , true );
function changeCode()
{
    var bgPos = /background-position.*?;\n/,
        wh = /width.*height.*?;\n/,
        pos = /left.*top.*?;/,
        code = allCss;

    if(!win.options.bgPos.value)
    {
        code = code.replace(bgPos,"");
    }
    if(!win.options.wh.value)
    {
        code = code.replace(wh,"");
    }
    if(!win.options.pos.value)
    {
        code = code.replace(pos,"");
    }

    win.code.text = code;
    
}

var win = new Window(arg,"Get CSS Code"),
    sp = getSP(activeDocument.selection.bounds),
    css = getCSS(sp);

    win.code.bounds={x:0,y:0,width:310,height:60};
    win.code.text = css;
    win.options.bgPos.onClick = win.options.wh.onClick = win.options.pos.onClick = changeCode;
    win.show();
}else{
    
    eachLayer(function(){
        sp = getSP(this.bounds); // sp = size and position
        this.name = getCSS(sp);

    });
}