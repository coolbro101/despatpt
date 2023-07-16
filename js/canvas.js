"use strict";

let canvas;
let ctx;

window.addEventListener("resize", _ => resizeCanvas());

window.addEventListener("onscroll", _ => resizeCanvas());

function retrieveCanvasData() {
	const treeCanv = document.getElementById("treeCanvas");
	const treeTab = document.getElementById("treeTab");
	if (treeCanv === undefined || treeCanv === null) return false;
	if (treeTab === undefined || treeTab === null) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
	if (!retrieveCanvasData()) return;
	canvas.width = 0;
	canvas.height = 0;
	canvas.width = document.getElementById("treeTab").scrollWidth;
	canvas.height = document.getElementById("treeTab").scrollHeight;
	drawTree();
}

function drawTree() {
	if (!retrieveCanvasData()) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (layerUnl("k")) drawTreeBranch("p", "k");
	if (layerUnl("s")) drawTreeBranch("p", "s");
	if (layerUnl("s")) drawTreeBranch("k", "s");
	if (layerUnl("f")) drawTreeBranch("k", "f");
	if (layerUnl("f")) drawTreeBranch("s", "f");
	if (layerUnl("b")) drawTreeBranch("k", "b");
	if (layerUnl("b")) drawTreeBranch("f", "b");
	if (layerUnl("r")) drawTreeBranch("f", "r");
	if (layerUnl("r")) drawTreeBranch("b", "r");
	if (layerUnl("c")) drawTreeBranch("r", "c");
	if (layerUnl("o")) drawTreeBranch("r", "o");
	if (layerUnl("w")) drawTreeBranch("o", "w");
	if (layerUnl("w")) drawTreeBranch("c", "w");
	needCanvasUpdate = false;
}

function drawTreeBranch(num1, num2) {
	// Taken from Antimatter Dimensions & adjusted slightly
	const start = document.getElementById(num1).getBoundingClientRect();
	const end = document.getElementById(num2).getBoundingClientRect();
	const x1 =
		start.left +
		start.width / 2 +
		(document.getElementById("treeTab").scrollLeft ||
			document.body.scrollLeft);
	const y1 =
		start.top +
		start.height / 2 +
		(document.getElementById("treeTab").scrollTop ||
			document.body.scrollTop);
	const x2 =
		end.left +
		end.width / 2 +
		(document.getElementById("treeTab").scrollLeft ||
			document.body.scrollLeft);
	const y2 =
		end.top +
		end.height / 2 +
		(document.getElementById("treeTab").scrollTop ||
			document.body.scrollTop);
	ctx.lineWidth = 15;
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}
