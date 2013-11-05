// sort_Layers ver.1.0  2012.02.23
//
//コンポ内の選択レイヤーを各プロパティでソートし並び替え
//カメラレイヤーがあれば、カメラからの距離でも並び替え可
//
//
//    =動作確認=
//    AfterEffects CS4  / windows7  &    mac OS 10.6.8
//    AfterEffects CS5.5  / windows7
//
//
//   email:   curry_eggs@yahoo.co.jp       blog:   http://curryegg.blog.shinobi.jp/        twitter account:   curry_egg
//
//


{
    sort_Layers(this);

    function sort_Layers(thisObj)
    {
        function runScr()
        {
            this.valE = false;
            this.valD = false;
            this.cameraLy = new Array();
            this.selectedLys = new Array();
            this.propVal = 0;
        }

        runScr.prototype =
        {
            //アプリバージョン確認・エラーコメント
            strErr: "****** CS4 以上じゃないですよっと ******",

            getInfo:function()
            {
                this.actComp = app.project.activeItem;
                if(this.actComp == null){
                    alert("******コンポを１つだけ選んでください******");
                    this.valE = true;
                }else{
                    var sel = this.actComp.selectedLayers;
                    if(sel.length < 2){
                        alert("******2つ以上のレイヤーを選択してください******");
                        this.valE = true;
                    }else{
                        //選択レイヤーを配列に置き換え
                        for(var i=0;i<sel.length;i++){
                            this.selectedLys[i] = sel[i];
                        }

                        //コンポ内にCameraがあったら取得
                        var compLys = this.actComp.layers;
                        for(var i=1;i<=compLys.length;i++){
                            if(compLys[i].matchName == "ADBE Camera Layer"){
                                this.cameraLy.push(compLys[i]);
                            }
                        }
                    }

                }
            },

            bld_UI: function()
            {
                var camList = new Array();
                if(this.cameraLy.length > 0){
                    for each(var oCam in this.cameraLy){
                        camList.push(oCam.name);
                    }
                }

                var dlgUI = new Window("dialog", "", [0,0,600,320]);
                this.UI_bgColor255(dlgUI,[40,40,40]);
                this.UI_fgColor255(dlgUI,[240,240,240]);

                var infoComp = dlgUI.add("statictext",[10,20,80,35],"comp Name: "); infoComp.justify="left";
                this.UI_font(infoComp,"Arial","ITALIC", 12);
                var infoCompName = dlgUI.add("statictext",[90,20,250,35],this.actComp.name); infoCompName.justify="left";
                this.UI_font(infoCompName,"Arial","REGULAR", 12);

                var infoLys = dlgUI.add("statictext",[280,20,370,35],"selected Layers: "); infoLys.justify="left";
                this.UI_font(infoLys,"Arial","ITALIC", 12);
                var infoLysNum = dlgUI.add("statictext",[380,20,430,35],this.selectedLys.length +" Layers"); infoLysNum.justify="left";
                this.UI_font(infoLysNum,"Arial","REGULAR", 12);

                var infoTitle = dlgUI.add("statictext",[450,5,590,35],"sort_Layers"); infoTitle.justify="right";
                this.UI_font(infoTitle,"Impact","REGULAR", 25);


                var selGrp = dlgUI.add("panel",[0,45,600,275],"", {borderStyle: "black"});
                this.UI_bgColor255(selGrp,[30,30,30]);

                var infoSelProp = selGrp.add("statictext",[5,5,120,25],"select property"); infoSelProp.justify="left";
                this.UI_font(infoSelProp,"Arial","BOLDITALIC", 15);
                var updownGrp = selGrp.add("group",[140,0,600,25],"");
                this.upBtn = updownGrp.add("radiobutton",[10,1,100,24],"small → big");
                this.upBtn.helpTip = "小さい値から順番に並べ替え"
                this.UI_fgColor255(this.upBtn,[220,150,0]);
                this.upBtn.value = true;
                this.upBtn.onClick = function(){this.active = false;}
                this.downBtn = updownGrp.add("radiobutton",[120,1,210,24],"big → small");
                this.downBtn.helpTip = "大きい値から順番に並べ替え"
                this.UI_fgColor255(this.downBtn,[220,150,0]);
                this.downBtn.onClick = function(){this.active = false;}
                var infoC = updownGrp.add("statictext",[220,1,450,24],"※コンポの下から上に向かって並べ替え"); infoC.justify="center";
                this.UI_fgColor255(infoC,[220,150,0]);
                this.UI_font(infoC,"Arial","ITALIC", 12);

                this.propBtn = new Array();
                var propGrp = selGrp.add("group",[0,26,600,224],"");
                this.UI_bgColor255(propGrp,[40,40,40]);

                var infoLy = propGrp.add("statictext",[10,10,80,30],"layer"); infoLy.justify="center";
                infoLy.helpTip = "レイヤー名、スタートフレーム、インポイントで並び替え";
                this.UI_font(infoLy,"Arial","ITALIC", 15);
                var infoAnchor = propGrp.add("statictext",[100,10,180,30],"anchor"); infoAnchor.justify="center";
                infoAnchor.helpTip = "レイヤーのアンカーポイントx,y,zで並び替え";
                this.UI_font(infoAnchor,"Arial","ITALIC", 15);
                var infoPos = propGrp.add("statictext",[200,10,280,30],"position"); infoPos.justify="center";
                infoPos.helpTip = "レイヤーの位置x,y,zで並び替え";
                this.UI_font(infoPos,"Arial","ITALIC", 15);
                var infoSC = propGrp.add("statictext",[300,10,380,30],"scale"); infoSC.justify="center";
                infoSC.helpTip = "レイヤーのスケールx,y,zで並び替え";
                this.UI_font(infoSC,"Arial","ITALIC", 15);
                var infoOri = propGrp.add("statictext",[400,10,480,30],"orientation"); infoOri.justify="center";
                infoOri.helpTip = "レイヤーの方向x,y,zで並び替え";
                this.UI_font(infoOri,"Arial","ITALIC", 15);
                var infoRot = propGrp.add("statictext",[500,10,580,30],"rotation"); infoRot.justify="center";
                infoRot.helpTip = "レイヤーの回転x,y,zで並び替え";
                this.UI_font(infoRot,"Arial","ITALIC", 15);
                var infoDis = propGrp.add("statictext",[10,140,180,160],"distance from a camera"); infoDis.justify="center";
                infoDis.helpTip = "カメラからの距離で並び替え";
                this.UI_font(infoDis,"Arial","ITALIC", 15);
                var infoRev = propGrp.add("statictext",[300,140,380,160],"reverse"); infoRev.justify="center";
                infoRev.helpTip = "現在の並びと逆順で並び替え";
                this.UI_font(infoRev,"Arial","ITALIC", 15);

                var dSelf = this;
                this.propBtn[0] = propGrp.add("radiobutton",[20,31,80,60],"name");
                this.propBtn[0].id = 0;
                this.propBtn[0].value = true;
                this.UI_fgColor255(this.propBtn[0],[220,150,0]);
                this.UI_font(this.propBtn[0],"Arial","BOLD", 12);
                this.propBtn[0].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                this.propBtn[1] = propGrp.add("radiobutton",[20,61,100,90],"startTime");
                this.propBtn[1].id = 1;
                this.UI_fgColor255(this.propBtn[1],[220,150,0]);
                this.UI_font(this.propBtn[1],"Arial","BOLD", 12);
                this.propBtn[1].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                this.propBtn[2] = propGrp.add("radiobutton",[20,91,80,120],"inPoint");
                this.propBtn[2].id = 2;
                this.UI_fgColor255(this.propBtn[2],[220,150,0]);
                this.UI_font(this.propBtn[2],"Arial","BOLD", 12);
                this.propBtn[2].onClick = function(){this.active = false; dSelf.propVal = this.id;}

                for(var i=0;i<5;i++){
                    this.propBtn[i*3+3] = propGrp.add("radiobutton",[i*100+120,31,i*100+180,60],"X");
                    this.propBtn[i*3+3].id = i*3+3;
                    this.UI_fgColor255(this.propBtn[i*3+3],[220,150,0]);
                    this.UI_font(this.propBtn[i*3+3],"Arial","BOLD", 12);
                    this.propBtn[i*3+3].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                    this.propBtn[i*3+4] = propGrp.add("radiobutton",[i*100+120,61,i*100+180,90],"Y");
                    this.propBtn[i*3+4].id = i*3+4;
                    this.UI_fgColor255(this.propBtn[i*3+4],[220,150,0]);
                    this.UI_font(this.propBtn[i*3+4],"Arial","BOLD", 12);
                    this.propBtn[i*3+4].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                    this.propBtn[i*3+5] = propGrp.add("radiobutton",[i*100+120,91,i*100+180,120],"Z");
                    this.propBtn[i*3+5].id = i*3+5;
                    this.UI_fgColor255(this.propBtn[i*3+5],[220,150,0]);
                    this.UI_font(this.propBtn[i*3+5],"Arial","BOLD", 12);
                    this.propBtn[i*3+5].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                }

                this.propBtn[18] = propGrp.add("radiobutton",[20,161,40,190],"");
                this.propBtn[18].id = 18;
                this.propBtn[18].onClick = function(){this.active = false; dSelf.downBtn.value = true; dSelf.propVal = this.id;}
                this.propBtn[19] = propGrp.add("radiobutton",[320,161,430,190],"reverse layers");
                this.propBtn[19].id = 19;
                this.UI_fgColor255(this.propBtn[19],[220,150,0]);
                this.UI_font(this.propBtn[19],"Arial","BOLD", 12);
                this.propBtn[19].onClick = function(){this.active = false; dSelf.propVal = this.id;}
                this.disBox = propGrp.add("dropdownlist",[45,165,250,190],camList);
                this.UI_fgColor255(this.disBox,[240,40,40]);
                if(camList.length == 0){
                    this.propBtn[18].visible = false;
                    this.disBox.visible = false;
                    var infoAl = propGrp.add("statictext",[20,161,250,190],"no camera"); infoAl.justify="left";
                    this.UI_fgColor255(infoAl,[220,100,0]);
                    this.UI_font(infoAl,"Arial","BOLDITALIC", 12);
                }else{
                    this.disBox.selection = 0;
                }

                var clBtn = dlgUI.add("button",[290,280,430,315],"Close");
                clBtn.onClick = function(){dlgUI.close();}
                var okBtn = dlgUI.add("button",[450,280,590,315],"OK");
                okBtn.onClick = function()
                {
                    var sels = new Array();
                    var sels2 = dSelf.selectedLys;
                    var newSels = new Array();
                    //連想配列
                    for each(var oSel in sels2){
                        sels.push({obj: oSel, name: oSel.name,index: oSel.index,startTime: oSel.startTime,inPoint: oSel.inPoint});
                    }
                    sels.sort(dSelf.smallIndex);
                    var SIndex = sels[0].index;
                    var LIndex = sels[sels.length-1].index;
                    switch(dSelf.propVal)
                    {
                        case 0: sels.sort(dSelf.smallName);         //Name
                                for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                break;
                        case 1: sels.sort(dSelf.smallSTime);         //startTime
                                for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                break;
                        case 2: sels.sort(dSelf.smallInPoint);         //inPoint
                                for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                break;
                        case 3: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallAncorX);          //Anchor X
                                break;
                        case 4: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallAncorY);          //Anchor Y
                                break;
                        case 5: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallAncorZ);          //Anchor Z
                                break;
                        case 6: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallPosX);          //Position X
                                break;
                        case 7: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallPosY);          //Position Y
                                break;
                        case 8: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallPosZ);          //Position Z
                                break;
                        case 9: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallScX);          //Scale X
                                break;
                        case 10: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallScY);          //Scale Y
                                break;
                        case 11: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallScZ);          //Scale Z
                                break;
                        case 12: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallOriX);          //Orientation X
                                break;
                        case 13: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallOriY);          //Orientation Y
                                break;
                        case 14: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallOriZ);          //Orientation Z
                                break;
                        case 15: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallRotX);          //Rotation X
                                break;
                        case 16: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallRotY);          //Rotation Y
                                break;
                        case 17: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                newSels.sort(dSelf.smallRotZ);          //Rotation Z
                                break;
                        case 18: for each(var onSel in sels){
                                    newSels.push(onSel.obj);
                                }
                                //var oP = this.cameraLy[this.disBox.selection.index];
                                newSels.sort(smallDis);          //distance from a camera
                                break;
                        case 19: for each(var onSel in sels){           //逆順
                                    newSels.push(onSel.obj);
                                }
                                break;
                    }

                    app.beginUndoGroup("sort_Layers");

                    //レイヤー並べ替え
                    dSelf.sortLys(newSels,SIndex,LIndex);

                    app.endUndoGroup();
                }

                dlgUI.onClose = function()
                {
                    dSelf.setPrefLONG("sort_Layers pref","windowPosX",this.location[0]);
                    dSelf.setPrefLONG("sort_Layers pref","windowPosY",this.location[1]);

                }


                var windowPos = [this.getPrefLONG("sort_Layers pref","windowPosX",0),this.getPrefLONG("sort_Layers pref","windowPosY",0)];
                if(windowPos[0] == 0 || windowPos[1] == 0){
                    dlgUI.center();
                }else{
                    dlgUI.location = windowPos;
                }

                dlgUI.show();

                //****** ソート用関数 sort(関数名)******
                //第3点oP(例:Camera)との距離(3次元)
                function smallDis(a,b)
                {
                    var oP = dSelf.cameraLy[dSelf.disBox.selection.index];
                    var aC = Math.sqrt( Math.pow((a.position.value[0] - oP.position.value[0]),2) + Math.pow((a.position.value[1] - oP.position.value[1]),2) + Math.pow((a.position.value[2] - oP.position.value[2]),2) );
                    var bC = Math.sqrt( Math.pow((b.position.value[0] - oP.position.value[0]),2) + Math.pow((b.position.value[1] - oP.position.value[1]),2) + Math.pow((b.position.value[2] - oP.position.value[2]),2) );
                    return (aC > bC) ? 1 : -1 ;
                }
            },

            runFunc: function()
            {
                this.getInfo();
                if(! this.valE){
                    this.bld_UI();
                }
            },

            //レイヤー並び替え
            sortLys: function(oLys,sVal,lVal)
            {
                var numLys = this.actComp.numLayers;
                if(this.downBtn.value){
                    for(var i=0;i<oLys.length;i++)
                    {
                        oLys[i].moveToEnd();
                    }
                }else{
                    for(var i=oLys.length-1;i>=0;i--)
                    {
                        oLys[i].moveToEnd();
                    }
                }

                if(numLys > oLys.length){
                    for(var i=0;i<oLys.length;i++)
                    {
                        if(sVal == 1){
                            this.actComp.layer(numLys).moveToBeginning();
                        }else{
                            this.actComp.layer(numLys).moveAfter(this.actComp.layer(sVal-1));
                        }
                    }
                }
            },

            //****** プレファレンス ******
            //プレファレンスを読み込み(Long)
            getPrefLONG: function(strA, strB, defVal)
            {
                //プレファレンスが無い場合、新規作成後、読み込み
                if(! app.preferences.havePref(strA, strB)){
                    app.preferences.savePrefAsLong(strA, strB, defVal);
                    app.preferences.saveToDisk();
                    app.preferences.reload();
                }

                var mp = app.preferences.getPrefAsLong(strA, strB);

                return mp
            },

            //プレファレンスを書き込み(Long)
            setPrefLONG: function(strA, strB, setVal)
            {
                app.preferences.savePrefAsLong(strA, strB, setVal);
                app.preferences.saveToDisk();
                app.preferences.reload();
            },

            //****** ソート用関数 sort(関数名)******
            //Name
            smallName: function(a,b)
            {
                return (a.name > b.name) ? 1 : -1 ;
            },

            //index
            smallIndex: function(a,b)
            {
                return (a.index > b.index) ? 1 : -1 ;
            },

            //startTime
            smallSTime: function(a,b)
            {
                return (a.startTime > b.startTime) ? 1 : -1 ;
            },

            //inPoint
            smallInPoint: function(a,b)
            {
                return (a.inPoint > b.inPoint) ? 1 : -1 ;
            },

            //アンカーポイント X座標
            smallAncorX: function(a,b)
            {
                return (a.anchorPoint.value[0] > b.anchorPoint.value[0]) ? 1 : -1 ;
            },

            //アンカーポイント Y座標
            smallAncorY: function(a,b)
            {
                return (a.anchorPoint.value[1] > b.anchorPoint.value[10]) ? 1 : -1 ;
            },

            //アンカーポイント Z座標
            smallAncorZ: function(a,b)
            {
                return (a.anchorPoint.value[2] > b.anchorPoint.value[2]) ? 1 : -1 ;
            },

            //X座標
            smallPosX: function(a,b)
            {
                return (a.position.value[0] > b.position.value[0]) ? 1 : -1 ;
            },

            //Y座標
            smallPosY: function(a,b)
            {
                return (a.position.value[1] > b.position.value[1]) ? 1 : -1 ;
            },

            //Z座標
            smallPosZ: function(a,b)
            {
                return (a.position.value[2] > b.position.value[2]) ? 1 : -1 ;
            },

            //Xスケール
            smallScX: function(a,b)
            {
                return (a.scale.value[0] > b.scale.value[0]) ? 1 : -1 ;
            },

            //Yスケール
            smallScY: function(a,b)
            {
                return (a.scale.value[1] > b.scale.value[1]) ? 1 : -1 ;
            },

            //Zスケール
            smallScZ: function(a,b)
            {
                return (a.scale.value[2] > b.scale.value[2]) ? 1 : -1 ;
            },

            //Xオリエンテーション(方向)
            smallOriX: function(a,b)
            {
                return (a.orientation.value[0] > b.orientation.value[0]) ? 1 : -1 ;
            },

            //Yオリエンテーション(方向)
            smallOriY: function(a,b)
            {
                return (a.orientation.value[1] > b.orientation.value[1]) ? 1 : -1 ;
            },

            //Zオリエンテーション(方向)
            smallOriZ: function(a,b)
            {
                return (a.orientation.value[2] > b.orientation.value[2]) ? 1 : -1 ;
            },

            //Xローテーション(回転)
            smallRotX: function(a,b)
            {
                return (a.rotationX.value > b.rotationX.value) ? 1 : -1 ;
            },

            //Yローテーション(回転)
            smallRotY: function(a,b)
            {
                return (a.rotationY.value > b.rotationY.value) ? 1 : -1 ;
            },

            //Zローテーション(回転)
            smallRotZ: function(a,b)
            {
                return (a.rotationZ.value > b.rotationZ.value) ? 1 : -1 ;
            },

            //scriptUI graphics 用ファンクション****************************************************
            //backgroundColor(0～255)
            UI_bgColor255: function(uiObj, uiColor)
            {
                var gColor = new Array();
                for(var i=0;i<3;i++){
                    gColor[i] = 1/255*Math.round(uiColor[i]);
                    //alert(gColor[i]);
                }
                var gUI = uiObj.graphics;
                var uiBrush = gUI.newBrush(gUI.BrushType.SOLID_COLOR, [gColor[0], gColor[1], gColor[2], 1]);
                gUI.backgroundColor = uiBrush;
            },

            //foregroundColor(0～255)
            UI_fgColor255: function(uiObj, uiColor)
            {
                var gColor = new Array();
                for(var i=0;i<3;i++){
                    gColor[i] = 1/255*Math.round(uiColor[i]);
                    //alert(gColor[i]);
                }
                var gUI = uiObj.graphics;
                var uiPen = gUI.newPen(gUI.PenType.SOLID_COLOR, [gColor[0], gColor[1], gColor[2], 1], 1);
                gUI.foregroundColor = uiPen;
            },

            //font
            UI_font: function(uiObj, uiFont, uiFontStyle, uiFontSize)
            {
                var fontStyle = eval("ScriptUI.FontStyle." + uiFontStyle);
                var gFont = ScriptUI.newFont (uiFont, fontStyle, uiFontSize);
                uiObj.graphics.font = gFont;
            }
        }
        // sub main
        var SL = new runScr(thisObj);

        //アプリのバージョン確認 (CS4 over)
        if (parseFloat(app.version) < 9)
        {
            alert(SL.strErr);
            return;
        }else{
            SL.runFunc(thisObj);
        }
    }
}