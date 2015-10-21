var mc;
var characterExists = false;

var rpgCharacter = function (lvl, hp, mp, job, condition) {
	this.level = lvl;
	this.hp = hp;
	this.mp = mp;
	this.job = job;
	this.condition = condition;
	this.damageTaken = function(dmg) {
		this.hp = this.hp - dmg;
	}
	this.damageDone = function() {
		return (Math.random() * 21) + 30;
	}
}
var changeStatus = function() {
	document.getElementById("jobTitle").className = mc.job;
	document.getElementById("jobTitle").innerHTML = mc.job;
	document.getElementById("level").innerHTML = mc.level;
	document.getElementById("hp").innerHTML = mc.hp;
	document.getElementById("mp").innerHTML = mc.mp;
	document.getElementById("condition").innerHTML = mc.condition;
}

var initialize = function() {
	if (characterExists) {
		if (!confirm("Are you sure you want to make a new character?")) {
			return;
		}
	}
	var choice = prompt("Would you like to be a WARRIOR or a THIEF?").toUpperCase();
	if (choice !== "WARRIOR" && choice !== "THIEF") {
		alert("Please choose either WARRIOR of THIEF!");
		return;
	} else if (choice === "WARRIOR") {
		mc = new rpgCharacter(1, 100, 15, choice, "Normal");
	} else {
		mc = new rpgCharacter(1, 75, 30, choice, "Normal");
	}
	characterExists = true;
	document.getElementById("fight").disabled = false;
	changeCharacterImage(choice);
	document.getElementById("statusScreen").style.visibility = "visible";
	changeStatus();
}

var fight = function() {
	if (!characterExists) {
		alert("You can't fight without creating a character...");
		return;
	}
	changeEnemyImage();
	var dmg = Math.floor(Math.random() * 21) + 20;
	mc.damageTaken(dmg);
	changeDamage(dmg);
	if (checkGameOver()) {
		return;
	}
	changeStatus();
}

var changeDamage = function(number) {
	document.getElementById("damage").innerHTML = "You were hit for " + number + " damage!";
}

var changeCharacterImage = function(job) {
	if (job === "WARRIOR") {
		document.getElementById("characterImage").src = "warrior.gif";
	}
	if (job === "THIEF")
		document.getElementById("characterImage").src = "thief.gif";
}

var changeEnemyImage = function() {
	document.getElementById("enemyImage").src = "kingslime.gif";
}

var checkGameOver = function() {
	if (mc.hp < 1) {
		document.getElementById("fight").disabled = true;
		mc.condition = "DEAD";
		if (mc.job === "WARRIOR") {
			document.getElementById("characterImage").src = "dead_warrior.gif";		
		} else {
			document.getElementById("characterImage").src = "dead_thief.gif";		
		}
		changeStatus();
		characterExists = false;
		return true;
	}
	return false;
}