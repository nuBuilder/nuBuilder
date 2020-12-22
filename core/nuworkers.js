
function nuWork() {
	
    postMessage(1);
    setTimeout("nuWork()", 500);
	
}

nuWork();