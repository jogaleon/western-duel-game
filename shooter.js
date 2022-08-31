//OBJECTS
//Guns
//Parameters (name,type,accuracy,fireRate,capacity)
var revolver = new Gun("Colt M1892 Revolver","pistol",50,2,6);
var boltAction = new Gun("M1903 Springfield rifle","rifle",100,1,5);
var dev1 = new Gun("The Dev Pistol Mk. 1","pistol",-100,5,5);
var dev2 = new Gun("The  Dev Rifle Mk. 2","rifle",220,1,50);
var dev3 = new Gun("The Dev Rifle Prototype","rifle",0,50,50);



//Characters
//Parameters (name,model,gun,accuracy,penalty,perk)
var player = new Character("Jo",new Model(),{...revolver},70,new Penalty(),null);
var enemy = new Character("Gunslinger",new Model(),{...revolver},60,new Penalty(),null);

//Auxiliary objects and variables
const hpReference = new Model();
var fireTurn = 0;

//GETELEMENT
//Page get
var page = document.getElementById("page");

//Player get
var playerName = document.getElementById("playerName");
var playerAccuracy = document.getElementById("playerAccuracy");
var playerAccuracyPenalty = document.getElementById("playerAccuracyPenalty");

//Player HP get
var playerBoxDisplay = document.getElementsByClassName("boxHealthP");
var playerHealthDisplay = document.getElementsByClassName("hpP");

//Player Gun get
var playerGunName = document.getElementById("playerGunName");
var playerGunAccuracy = document.getElementById("playerGunAccuracy");
var playerGunFireRate = document.getElementById("playerGunFireRate");
var playerGunCapacity = document.getElementById("playerGunCapacity");
var playerGunLoad = document.getElementById("playerGunLoad");

//Enemy get
var enemyName = document.getElementById("enemyName");
var enemyAccuracy = document.getElementById("enemyAccuracy");
var enemyAccuracyPenalty = document.getElementById("enemyAccuracyPenalty");

//Enemy HP get
var enemyBoxDisplay = document.getElementsByClassName("boxHealthE");
var enemyHealthDisplay = document.getElementsByClassName("hpE");

//Enemy Gun get
var enemyGunName = document.getElementById("enemyGunName");
var enemyGunAccuracy = document.getElementById("enemyGunAccuracy");
var enemyGunFireRate = document.getElementById("enemyGunFireRate");
var enemyGunCapacity = document.getElementById("enemyGunCapacity");
var enemyGunLoad = document.getElementById("enemyGunLoad");

//Magazine get
var playerMagazine = document.getElementById("magazineP");
var enemyMagazine = document.getElementById("magazineE");	


//Action Buttons get
var actionSection = document.getElementById("actionSection")
var aimButton = document.getElementById("aimButton");
var fireButton = document.getElementById("fireButton");
var reloadButton = document.getElementById("reloadButton");

//Hit Chances Display get
var targetSelectionSection = document.getElementById("targetSelectionSection");

var radioTarget = document.getElementsByName("radioTarget");
console.log(radioTarget);
console.log(radioTarget.selectedIndex);
	var radioHead = document.getElementById("radioHead");
	var radioTorso = document.getElementById("radioTorso");
	var radioLeftArm = document.getElementById("radioLeftArm");
	var radioRightArm = document.getElementById("radioRightArm");
	var radioLeftLeg = document.getElementById("radioLeftLeg");
	var radioRightLeg = document.getElementById("radioRightLeg");
	
var chanceDisplay = document.getElementsByClassName("chance");	
	var chanceHead = document.getElementById("chanceHead");
	var chanceTorso = document.getElementById("chanceTorso");
	var chanceLeftArm = document.getElementById("chanceLeftArm");
	var chanceRightArm = document.getElementById("chanceRightArm");
	var chanceLeftLeg = document.getElementById("chanceLeftLeg");
	var chanceRightLeg = document.getElementById("chanceRightLeg");
	
//Coin Toss Box get
var coinTossBox = document.getElementById("coinTossBox");	
var turnDisplay = document.getElementById("turnDisplay");
	
//Update methods
update = {
	//For adding entries to battle log
	log: function(message){
		var battleLog = document.getElementById("log");
		var pLog = document.createElement("p");
		pLog.innerHTML = message;
		battleLog.insertBefore(pLog, battleLog.firstChild);
		if (battleLog.childElementCount >= 20) {
			battleLog.lastChild.remove();
		}
	},

	//Player card update
	playerCard: function() {
		playerName.innerHTML = player.name;
		playerAccuracy.innerHTML = player.accuracy + "%";
		playerGunName.innerHTML = player.gun.name;
		playerGunAccuracy.innerHTML = player.gun.accuracy + "%";
		playerGunFireRate.innerHTML = player.gun.fireRate;
		playerGunCapacity.innerHTML = player.gun.capacity;
	},
	//Enemy card update
	enemyCard: function() {
		enemyName.innerHTML = enemy.name;
		enemyAccuracy.innerHTML = enemy.accuracy + "%";
		enemyGunName.innerHTML = enemy.gun.name;
		enemyGunAccuracy.innerHTML = enemy.gun.accuracy + "%";
		enemyGunFireRate.innerHTML = enemy.gun.fireRate;
		enemyGunCapacity.innerHTML = enemy.gun.capacity;
		
	},
	// Character HP display update
	//target parameter: target = player/enemy object (or their references) 
	hp: function(target) {
		var hp = Object.values(target.model);
		var healthDisplay;
		
		if (target == player) {
			healthDisplay = playerHealthDisplay;
		} else if (target == enemy) {
			healthDisplay = enemyHealthDisplay;
		}
		
		for (i = 0; i < healthDisplay.length; i++) {
			healthDisplay[i].innerHTML = hp[i];
		}
	},
	//Penalty check
	penalty: function(target) {
		var targetPart = Object.keys(target.model);
		var targetHP = Object.values(target.model);
		var ifCrippled = Object.values(target.penalty);

		var targetP = target.penalty;

		var accuracyDisplay;
		var accuracyPenaltyDisplay;
		var boxDisplay;
		
		if (target == player) {
			accuracyDisplay = playerAccuracy;
			accuracyPenaltyDisplay = playerAccuracyPenalty;
			boxDisplay = playerBoxDisplay;
			
		} else if (target == enemy) {
			accuracyDisplay = enemyAccuracy;
			accuracyPenaltyDisplay = enemyAccuracyPenalty
			boxDisplay = enemyBoxDisplay;
		}
		
		for (i = 0; i < targetPart.length; i++) {
			if (targetHP[i] == 0 && ifCrippled[i] == false) {
				//Head is crippled (lethal)
				if (targetPart[i] == "head") {
					targetP.head = true;
					target.alive = false;
					
					update.log(target.name + " died instantly!");
					endBattle();
				//Torso is crippled (lethal)
				} else if (targetPart[i] == "torso") {
					targetP.torso = true;
					target.alive = false;
					
					update.log(target.name + " died!");
					endBattle();
				//Left arm is crippled (acc penalty)
				} else if (targetPart[i] == "leftArm") {
					targetP.leftArm = true;
					target.accuracyPenalty += 20;
					target.accuracy -= 20;
				
					update.log(target.name + "'s left arm is crippled.");
					
				//Right arm is crippled (acc penalty)
				} else if (targetPart[i] == "rightArm") {
					targetP.rightArm = true;
					target.accuracyPenalty += 20;
					target.accuracy -= 20;
								
					update.log(target.name + "'s right arm is crippled.");
					
				//Left leg is crippled (acc penalty)
				} else if (targetPart[i] == "leftLeg") {
					targetP.leftLeg = true;	
					target.accuracyPenalty += 5;
					target.accuracy -= 5;
					
					update.log(target.name + "'s left leg is crippled.");
					
				//Right leg is crippled (acc penalty)
				} else if (targetPart[i] == "rightLeg") {
					targetP.rightLeg = true;
					target.accuracyPenalty += 5;
					target.accuracy -= 5;

					update.log(target.name + "'s right leg is crippled.");
				}
				
			}

			
			//Target selection display update if an enemy part is crippled;
			ifCrippled = Object.values(turn.target.penalty); //if Crippled update
			if (turn.turn == player && ifCrippled[i] == true) {
				radioTarget[i].style.display = "none";
				radioTarget[i].checked = false;
			}
		}
		
		//Only updates the accuracy penalty display when the value changes from 0
		if (target.accuracyPenalty > 0) {
			accuracyDisplay.innerHTML = target.accuracy + "%";
			accuracyPenaltyDisplay.innerHTML = "(-" + target.accuracyPenalty + "%)";
		}
	},
	//Part display update
	partDisplay: function(target) {
		var targetHP = Object.values(target.model);
		var reference = Object.values(hpReference);
		var boxDisplay;

		if (target == player) {
			boxDisplay = playerBoxDisplay;
		} else if (target == enemy) {
			boxDisplay = enemyBoxDisplay;
		}
		
		for (i = 0; i < targetHP.length; i++) {
			//passes only if target's hp changed
			if (targetHP[i] != reference[i]) {
				if (targetHP[i] <= (reference[i] - 1) && targetHP[i] > 1 ) {
					boxDisplay[i].style.backgroundColor = "#FFFF00";
				} else if  (targetHP[i] == 1) {
					boxDisplay[i].style.backgroundColor = "#FFA500";
				} else if (targetHP[i] == 0) {
					boxDisplay[i].style.backgroundColor = "#F44336";
				}
			}
		}
	},
	//Chance display update
	chance: function() {
		var chances = Object.values(hitStorage);
		for (i = 0; i < chanceDisplay.length; i++) {
			chanceDisplay[i].innerHTML = chances[i] +"%";
		}
	},
	//Gun Load update
	gunLoad: function(target) {
		var gunLoad;
		if (target == player) {
			gunLoad = playerGunLoad;
		} else if (target == enemy) {
			gunLoad = enemyGunLoad;
		}
		
		gunLoad.innerHTML = target.gun.load + "/" + target.gun.capacity;
	},
	//Magazine length update
	magazineSize: function(target) {

		var magWidth = target.gun.capacity * 13;
		console.log(magWidth);
		if (target == player) {
			playerMagazine.style.width = magWidth + "px";
		} else if (target == enemy) {
			enemyMagazine.style.width = magWidth + "px";
		}
	},
	//Magazine load update
	magazineLoad: function(target) {
		var i = 0;
		var magazine;
		var Load = target.gun.load;
		var Capacity = target.gun.capacity;
		
		if (target == player) {
			magazine = magazineP;
		} else if (target == enemy) {
			magazine = magazineE;
		}
		
		for (i = 0; i < Capacity; i++) {
			bullet = document.createElement("div");
			magazine.appendChild(bullet);
			bullet.classList.add("bullet","in");
		}
	},
	//Magazine reload update
	magazineReload: function(target) {
		var i = 0;
		var magazine;
		var Load = target.gun.load;
		var Capacity = target.gun.capacity;
		var loopCount = Capacity - Load;
		
		if (target == player) {
			magazine = magazineP;
		} else if (target == enemy) {
			magazine = magazineE;
		}
		
		var reloadLoop = setInterval(function(){
			if (i < loopCount) {
				loadRound(Capacity,magazine);	
				i++;
			} else if ( i == Capacity) {
				clearInterval(reloadLoop);
			}
		},50);
	},
	//Button display update
	actionButton: function() {
		if (turn.toggle == true) {
			actionSection.style.display = "block";
			if (reloadButton.style.display == "none") {
				reloadButton.style.display = "block";
			}
		} else if (turn.toggle == false) {
			actionSection.style.display = "none";
		}
	},
	//For showing/hiding the Target Selection Section
	displaySelect: false,
	toggleSelect: function() {
		//This makes sure that the display is off whenever it's the enemy's turn
		if (turn.toggle == true) {
			this.displaySelect = !this.displaySelect;
		} else if (turn.toggle == false) {
			this.displaySelect = false;
		}
		//Main body
		if (this.displaySelect == true) {
			targetSelectionSection.style.display = "block";
		} else if (this.displaySelect == false) {
			targetSelectionSection.style.display = "none";		
		}
	},
	//targetHPStorage update (for AI calculation)
	targetHPStorage: function() {
		var targetHP = Object.values(turn.target.model);
		for (i = 0; i < targetHPStorage.length; i++) {
			targetHPStorage[i] = targetHP[i];
		}

	},
};

//Turn
turn = {
	turn: player,
	turnNum:0,
	target: enemy,
	toggle: false,
	set: function () {
		fireTurn = 0;
		this.turnNum += 1;
		console.log("Turn #" + this.turnNum);
		
		if (this.toggle == true) {
			this.turn = player;
			this.target = enemy;
			
			if (player.alive == true) {
				update.actionButton();
			}
			
		} else {
			this.turn = enemy;
			this.target = player;
			
			update.actionButton();
			update.toggleSelect();			

		}
		
		//Hit calculation
		var accuracy = this.turn.accuracy;
		var accuracyGun = this.turn.gun.accuracy;
		calculateHit(accuracy,accuracyGun);
		
		//Log entry
		if (this.turn.alive == true) {		
			update.log("It is now " + this.turn.name + "'s turn" + "(" + this.turnNum + ").");
		}
		
		//Runs AI action selection when it's enemy turn
		if (this.turn == enemy) {
			if (this.turnNum == 1) {
				setTimeout(enemyAI.pickAction, 3000);
			} else if (enemy.alive == true) {
				enemyAI.pickAction();
			}
		}
	},
	//For flipping who's turn it is
	flip: function () {
		this.toggle = !this.toggle;
		this.set();

	}, 
	coinToss: function () {
		this.toggle = (Math.random() < 0.5);
		this.set();
	},
};

//Target methods
pTarget = {
	grab: function() {
		if (turn.turn == player) {
			for (i = 0; i < radioTarget.length; i++) {
				if (radioTarget[i].checked) {
					return radioTarget[i].value;
				}
			}
		} else if (turn.turn == enemy) {
			return enemyAI.targetPart;
		}
	},
	textDisplay: function() {
		var grab = this.grab()
		if (grab == "head") {
			return "head";
		} else if (grab == "torso") {
			return "torso";
		} else if (grab == "leftArm") {
			return "left arm";
		} else if (grab == "rightArm") {
			return "right arm";
		} else if (grab == "leftLeg") {
			return "left leg";
		} else if (grab == "rightLeg") {
			return "right leg";
		}
	},
	getString: function(from) {
		return from + "." + this.grab();
	},
	hitRoll: function() {
		var targetString = this.getString("hitStorage");
		var dProb = eval(targetString)/100;
		var random = Math.random();
		return (random < dProb);
	},
}; 

;

//Onclick Events
aimButton.onclick =	update.toggleSelect.bind(update);
fireButton.onclick = fire;
reloadButton.onclick = reload;

//CONSTRUCTORS

//Player Constructor
function Character(name,model,gun,accuracy,penalty,perk) {
	this.name = name;
	this.model = model;
	this.gun = gun;
	this.accuracy = accuracy;
	this.penalty = penalty;
	this.accuracyPenalty = 0;
	this.perk = perk;
	this.alive = true;
}

//Gun Constructor
function Gun(name,type,accuracy,fireRate,capacity) {
	this.name = name;
	this.type = type;
	this.accuracy = accuracy;
	this.fireRate = fireRate;
	this.capacity = capacity;
	this.load = this.capacity;
}

//Model Constructor 
//contains the health values of each part (constant)
function Model() {
	this.head = 1;
	this.torso = 4;
	this.leftArm = 2;
	this.rightArm = 2;
	this.leftLeg = 1;
	this.rightLeg = 1;
}

//Penalty Constructor
function Penalty() {
	this.head = false;
	this.torso = false;
	this.leftArm = false;
	this.rightArm = false;
	this.leftLeg = false;
	this.rightLeg = false;
}


//FUNCTIONS
//Action Functions 
function fire() {
	var Turn = turn.turn;
	var Target = turn.target;
	var targetPart = pTarget.textDisplay();
	var targetModelPart = pTarget.getString("turn.target.model");
	
	
	//1. turn didn't select target
	if (pTarget.grab() == undefined) {
		update.log("No target selected.");
	//2. gun is loaded
	} else if (Turn.gun.load > 0) { 
		reloadButton.style.display = "none";
		Turn.gun.load -= 1;
		fireRound(Turn);
		
		//2.1.1 hit
		if (pTarget.hitRoll() == true) {
			fireTurn += 1;
			eval(targetModelPart + "-= 1");
			update.log(Turn.name + " hit " + Target.name + "'s " + targetPart + ".");
			
			//card updates
			update.hp(Target);
			update.partDisplay(Target);
			update.penalty(Target);	
			
		//2.1.2 miss
		} else {
			fireTurn += 1;
			update.log(Turn.name + " missed " + Target.name + "'s " + targetPart + ".");
		}
		
		update.gunLoad(Turn);
		//rate of fire/capacity check
		if (fireTurn == Turn.gun.fireRate) {
			if (Turn == player) {
				turn.flip();
			}
		} else if (Turn.gun.load == 0) {
			update.log(Turn.name + "'s gun is empty");
			if (Turn == player) {
				turn.flip();
			}
		}
		
	//3. turn's gun is empty
	} else if (turn.turn.gun.load <= 0) {
			update.log(turn.turn.name + "'s gun is empty");
	}
}

function reload() {
	update.log(turn.turn.name + "'s gun is reloaded.");
	update.magazineReload(turn.turn);
	turn.turn.gun.load += (turn.turn.gun.capacity - turn.turn.gun.load);
	update.gunLoad(turn.turn);
	console.log("reload happened");
	
	if (turn.turn == player) {
		turn.flip();
	}
}

//Hit Calculator
//Object containing hit probability values of each part (constant)
hitProbability = {
	head: 10,
	torso: 60,
	leftArm: 40,
	rightArm: 40,
	leftLeg: 40,
	rightLeg: 40,
};

//Object that stores hit probabilities calculated by the function 'calculateHit'
hitStorage = {
	head: 0,
	torso: 0,
	leftArm: 0,
	rightArm: 0,
	leftLeg: 0,
	rightLeg: 0,
};

//function that calculates hit probability of each part
// and stores it to the 'hitStorag'e object
function calculateHit(accuracy,accuracyGun) {
	var hitPro = Object.values(hitProbability);
	var n = 0;
	Object.keys(hitStorage).forEach(function(i) {
		var nProb = Math.round( ( accuracy + accuracyGun + hitPro[n]) / 3 );
		hitStorage[i] = nProb;
		n += 1;
	});
	update.chance();

} 

function loadRound(targetCapacity, targetMag) {
	if (targetMag.childElementCount < targetCapacity) {
		bullet = document.createElement("div");
		targetMag.appendChild(bullet);
		bullet.classList.add("bullet");
		setTimeout(function() {
			bullet.classList.toggle("in");
		},10);
	}
}

function fireRound(target) {
	var magazine;
	if (target == player) {
		magazine = magazineP;
	} else if (target == enemy) {
		magazine = magazineE;
	}
	
	if (magazine.childElementCount > 0) {
		magazine.lastChild.classList.toggle("in");
		setTimeout(function() {
		magazine.lastChild.remove();
		},100);
	}
}

function startBattle() {

	update.playerCard();
	update.enemyCard();
	update.hp(player);
	update.hp(enemy);
	update.gunLoad(player);
	update.gunLoad(enemy);
	update.magazineSize(player);
	update.magazineSize(enemy);
	update.magazineLoad(player);
	update.magazineLoad(enemy);

	//Testing
	turn.coinToss();
	coinTossAnimation();
	//coinTossBox.style.display = "none";

}

function endBattle() {
	actionSection.style.display = "none";
	targetSelectionSection.display = "none";
	if (enemy.alive == false) {
		update.log(player.name + " won the battle!");
	} else if (player.alive == false) {
		update.log(enemy.name + " won the battle!");
	}
}

function coinTossAnimation() {

	var toggle;
	var counter = 0;
	if (turn.turn == player) {
		toggle = true;
	} else if (turn.turn == enemy) {
		toggle = false;
	}
	
	coinTossBox.classList.toggle("fade");
	var turnToggle = setInterval(turnRoll, 200);
	
	function turnRoll() {
		if (toggle == true) {
			turnDisplay.innerHTML = "Player";
		} else if (toggle == false) {
			turnDisplay.innerHTML = "Enemy";
		}
		
		if (counter == 8) {
			clearInterval(turnToggle); 
			setTimeout(function(){
				coinTossBox.style.display = "none";
				togglePage();
			}, 1000);
			
		} else {
			toggle = !toggle;
			counter++;
		}	
	}
	
	
}

function togglePage() {
	page.classList.toggle("fade");
}

startBattle();

//Debugging tools
function checkObject (obj) {
	var prop;
	for (prop in obj) {
	 console.log(prop + ": " + obj[prop]);
	}
}


