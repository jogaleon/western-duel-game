//ENEMY AI
//Enemy randomizer

//Balancing Variables
const BONUS_INC = 30;

//Enemy AI action Object
//Battle log taunts


//TARGETING & ACTION BEHAVIOR
//Objects

ifRemoved = {
	head: false,
	torso: false,
	leftArm: false,
	rightArm: false,
	leftLeg: false,
	rightLeg: false,
};

pickChance = {
	head: 0,
	torso: 0,
	leftArm: 0,
	rightArm: 0,
	leftLeg: 0,
	rightLeg: 0,
};


bonusChance = {
	head: 0,
	torso: 0,
	leftArm: 0,
	rightArm: 0,
	leftLeg: 0,
	rightLeg: 0,
};	

upperRange = {
	head: 0,
	torso: 0,
	leftArm: 0,
	rightArm: 0,
	leftLeg: 0,
	rightLeg: 0,
};	

lowerRange = {
	head: 0,
	torso: 0,
	leftArm: 0,
	rightArm: 0,
	leftLeg: 0,
	rightLeg: 0,
};	

targetHPStorage = [0,0,0,0,0,0];

//EnemyAI Object

enemyAI = {
	targetPart: null,
	pickTarget: function() {
		removeCrippled();
		var pick = Object.keys(pickChance);
		
		var bonus = Object.keys(bonusChance);
		var bonusP = Object.values(bonusChance);
		var bonusTotal = 0;
		
		var lower = Object.keys(lowerRange);
		var upper = Object.keys(upperRange);
		
		for (i = 0; i < bonus.length; i++) {
			bonusTotal += bonusP[i];
		}
		
		//Base Percentage 
		var division = (100 - bonusTotal) / bonus.length;

		//Calculating values for pickChance
		var n = 0;
		Object.keys(pickChance).forEach(function(i) {
			var pickTotal = division + bonusP[n];
			pickChance[i] = pickTotal;
			n++;
		});
		//Calculating values for lowerRange
		n = 0;
		var bonusAdd = 0;
		Object.keys(lowerRange).forEach(function(i) {
			if (n == 0) {
				lowerRange[i] = 0;
			} else if ( n > 0 ) {
				bonusAdd += bonusP[n-1];
				lowerRange[i] = ((n * division) + bonusAdd) / 100;

			}
			n++;

		});
		
		//Calculating values for upperRange
		n = 0;
		bonusAdd = 0;
		Object.keys(upperRange).forEach(function(i) {
			//When n has reached the final item of upperRange
			if ( n < (upper.length - 1)) {
				bonusAdd += bonusP[n];
				upperRange[i] = (((n + 1) * division) + bonusAdd) / 100;
			} else if (n == (upper.length - 1)) {
				upperRange[i] = 100;
			}
			n++;
		});
		
		//Constructing the probability function string
		var lowerP = Object.values(lowerRange);
		var upperP = Object.values(upperRange);
		var random = Math.random().toFixed(2);
		var pickRollString = "";
		
		
		for (var i = 0; i < pick.length; i++) {
			var condition;
			
			if (i == 0) {
				condition = "if";
			} else {
				condition = "else if";
			}
			pickRollString += condition + ' (' + random + ' >= ' + lowerP[i] + ' &&  ' + random + ' < ' + upperP[i] + ') { enemyAI.targetPart = "' + pick[i] + '"; } ';
		}
		//Converting the string to a function 
		var pickRoll = new Function(pickRollString);
		pickRoll();
		//console.log(enemyAI.targetPart);
		//console.log("pick chance");
		//console.log(pickChance);
	},
	evaluateTarget: function() {
		var bonusPart; 	
		var targetHP = Object.values(turn.target.model);
		
		for (i = 0; i < targetHP.length; i++) {
			var hitDetect = (targetHPStorage[i] != targetHP[i] && targetHP[i] != 0);
			//console.log(hitDetect);
			//console.log(targetHPStorage[i]);
			//console.log(targetHP[i]);
			if (!hitDetect) continue;
			
			if (i == 0) {
				bonusChance.head += BONUS_INC;
			} else if (i == 1) {
				bonusChance.torso += BONUS_INC;
			} else if (i == 2) {
				bonusChance.leftArm += BONUS_INC;
			} else if (i == 3) {
				bonusChance.rightArm += BONUS_INC;
			} else if (i == 4) {
				bonusChance.leftLeg += BONUS_INC;
			} else if (i == 5) {
				bonusChance.rightLeg += BONUS_INC;
			}

		}
		//console.log("bonus chance");
		//console.log(bonusChance);
	},
	pickAction: function() {
		var Load = turn.turn.gun.load;
		var FireRate = turn.turn.gun.fireRate;
		var random = Math.random();

		//1.0 Fire
		if (Load >= FireRate) {
			var i = 0;
			var setFire = setInterval(volley, 800);
			function volley() {
				if (i < FireRate && turn.target.alive == true) {
					update.targetHPStorage();
					enemyAI.pickTarget();
					fire();
					enemyAI.evaluateTarget();
					i++;
				} else {
					clearInterval(setFire);
					turn.flip()
				}
			}
		//2.0 Fire or Reload
		} else if (Load < FireRate && Load != 0) {
			//2.1 Random Fire
			if (random < .50 && turn.target.alive == true) {
				var i = 0;
				var setFire = setInterval(volley, 800);
				function volley() {
					if (i < Load) {
						update.targetHPStorage();
						enemyAI.pickTarget();
						fire();
						enemyAI.evaluateTarget();
						i++;
					} else {
						clearInterval(setFire);
						turn.flip()
					}
				}
			//2.2 Random Reload
			} else if (random >= .50) {
				console.log("ai reload");
				reload();
				turn.flip()
			}
		//3.0 Reload
		} else if  (Load == 0) {
			console.log("ai reload");
			reload();
			turn.flip();

		}
		
	},
};

//AI Function
function removeCrippled() {
	var targetP = turn.target.penalty;
	
	if (targetP.head == true && ifRemoved.head == false) {
		ifRemoved.head = true;
		delete pickChance.head;
		delete bonusChance.head;
		delete upperRange.head;
		delete lowerRange.head;
	} else if (targetP.torso == true && ifRemoved.torso == false) {
		ifRemoved.torso = true;
		delete pickChance.torso;
		delete bonusChance.torso;
		delete upperRange.torso;
		delete lowerRange.torso;
	} else if (targetP.leftArm == true && ifRemoved.leftArm == false) {
		ifRemoved.leftArm = true;
		delete pickChance.leftArm;
		delete bonusChance.leftArm;
		delete upperRange.leftArm;
		delete lowerRange.leftArm;
	} else if (targetP.rightArm == true && ifRemoved.rightArm == false) {
		ifRemoved.rightArm = true;
		delete pickChance.rightArm;
		delete bonusChance.rightArm;
		delete upperRange.rightArm;
		delete lowerRange.rightArm;
	} else if (targetP.leftLeg == true && ifRemoved.leftLeg == false) {
		ifRemoved.leftLeg = true;
		delete pickChance.leftLeg;
		delete bonusChance.leftLeg;
		delete upperRange.leftLeg;
		delete lowerRange.leftLeg;
	} else if (targetP.rightLeg == true && ifRemoved.rightLeg == false) {
		ifRemoved.rightLeg = true;
		delete pickChance.rightLeg;
		delete bonusChance.rightLeg;
		delete upperRange.rightLeg;
		delete lowerRange.rightLeg;
	}
}

