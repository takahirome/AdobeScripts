//////////////////////////////////////////////////
//
// 全てのドキュメントを保存せずに閉じる ver0.2
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function start() {
	//確認ダイアログ
	try {
			var dlg = new Window("dialog");
			dlg.text = "全てのドキュメントを保存せずに閉じる";
			dlg.alignChildren = "left";

			dlg.add("statictext", undefined, "全てのドキュメントを保存せずに閉じます。");
			dlg.add("statictext", undefined, "このまま操作を続けますか？");
			
			var buttons = dlg.add("group");
			buttons.orientation = "row";
			buttons.alignment = "center";

				var okBtn = buttons.add("button");
				okBtn.text = "OK";
				okBtn.properties = {name: "ok"};

				var cancelBtn = buttons.add("button");
				cancelBtn.text = "Cancel";
				cancelBtn.properties = {name: "cancel"};

			dlg.center();
			// end dialog layout
			if (dlg.show() == 1) {
				main();
			}else{
				alert("操作を中止しました。");
			}
		}catch(e) {
		}
}

function main(){
	closeWidthoutSave();
}

//全てのドキュメントを保存せずに閉じる
function closeWidthoutSave() {
	while (documents.length > 0)
	{
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
