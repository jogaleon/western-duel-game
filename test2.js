var loadButton = document.getElementById("load");
loadButton.onclick = loadRound;
var fireButton = document.getElementById("fire");
fireButton.onclick = fireRound;
var magazineA = document.getElementById("magazineA");
var bulletClass = document.getElementsByClassName("bullet");
console.log("yo");


var capacity = 10;

renderMag();
function renderMag() {
	var magWidth = capacity * 13;
	console.log(magWidth);
	magazineA.style.width = magWidth + "px";
}
	
function loadRound() {
	if (magazineA.childElementCount < capacity) {
		bullet = document.createElement("div");
		magazineA.appendChild(bullet);
		bullet.classList.add("bullet");
		setTimeout(function() {
			bullet.classList.toggle("in");
		},0);

	}
}

function fireRound() {
	if (magazineA.childElementCount > 0) {
		magazineA.lastChild.classList.toggle("in");
		setTimeout(function() {
		magazineA.lastChild.remove();
		},100);
	} else {
		console.log("Gun is empty.");
	}
}