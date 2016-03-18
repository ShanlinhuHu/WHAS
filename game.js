/*function Weapon(name, position, type, atk, capacity, carryCapacity, weight, dualable);
 *for more detail please check the constructor */
const WEAPONS = {
	0 : new Weapon("Fire Axe", 2, 2, 70, 0, 0, 70, false),
	1 : new Weapon("Crowbar",  2, 2, 50, 0, 0, 50, false),
	2 : new Weapon("Pistol",   2, 1, 20, 15, 0, 25, true)
};

const EVENTS = {
	0 : new RefreshDisplay("Please choose a map"),
	1 : new Choice([
			new Option(["Dead Center", new gotoLine(2)]),
			new Option(["Dark Carnival", new gotoLine(8)])
		]),
	2 : new RefreshDisplay("Please choose a weapon"),
	3 : new Choice([
			new Option([WEAPONS[0].name, new gotoLine(4), new weaponEquip(0)]),
			new Option([WEAPONS[1].name, new gotoLine(4), new weaponEquip(1)]),
			new Option([WEAPONS[2].name, new gotoLine(4), new weaponEquip(2)])
		]),
	4 : new RefreshDisplay("Are you going to open the door?"),
	5 : new Choice([
			new Option(["Yes", new gotoLine(6)]),
			new Option(["No", new gotoLine(8)])
		]),
	6 : new RefreshDisplay("There are aombies in the hall way!"),
	7 : new Choice([
			new Option(["Fight!", new gotoLine(10)]),
			new Option(["Stay", new gameover()])
		]),
	8 : new RefreshDisplay("Zombies are tyring to break in!"),
	9 : new Choice([
			new Option(["Fight!", new gotoLine(10)]),
			new Option(["Stay", new gameover()])
		])
};

var inv = new Inventory(0, 3, 0, 0, 0, 0);

var save = new Save(0, false, inv);

function Weapon(name, position, type, atk, capacity, carryCapacity, weight, dualable) {
	this.name = name;
	this.position = position; //Inventory position of the weapon. 1 = mainArm, 2 = sideArm;
	this.type = type; // 1 = Gun, 2 = Melee;
	this.atk = atk;   // The base number of the damage this weapon gives;
	this.capacity = capacity; // ammo capacity;
	this.carryCapacity = carryCapacity; // total amount of ammo this weapon can carry;
	this.weight = weight; // the more heavy this weapon is, the less round of attack can be made;
	this.dualable = dualable; // if this weapon can be dual;
}


function Inventory(mainArm, sideArm, deployableItem, throwableItem, medicalItem, holdingItem) {
	this.mainArm = mainArm;
	this.sideArm = sideArm;
	this.deployableItem = deployableItem;
	this.throwableItem = throwableItem;
	this.medicalItem = medicalItem;
	this.holdingItem = holdingItem;
}

function weaponEquip(weaponID) {
	this.run = run;
	function run() {
		if (weaponID < Object.keys(WEAPONS).length){
			if(WEAPONS[weaponID].position == 1) {
				inv.mainArm = weaponID;
			} else if(WEAPONS[weaponID].position == 2) {
				inv.sideArm  = weaponID;
			}
		}
	}
}





function Save(progress, eventBreak, inv) {
	this.progress = progress;
	this.eventBreak = eventBreak;
	this.inv = inv;
}

function gameover() {
	this.run = run;
	function run() {
		document.getElementById("options").innerHTML = "";
		new RefreshDisplay("Game Over!").run();
	}
}

function next(buttonID) {
	save.eventBreak = false;
	triggerEvent();
}


function gotoLine(id) {
	this.run = run;
	function run() {
		save.progress = id;
	}
}

function triggerEvent() {
	while (!save.eventBreak && save.progress < Object.keys(EVENTS).length) {
		save.eventBreak = EVENTS[save.progress].run();
		if(!save.eventBreak) {
			save.progress++;
		}
	}
}

function Option(argu) {
	this.description = argu[0];
	this.print = print;
	this.run = run;
	function print(i) {
		document.getElementById("options").innerHTML += 
		"<a href=\"#\" class=\"btn btn-default  btn-success btn-block\" onclick=\"EVENTS[" + save.progress + "].next(" + i + ")\">" + this.description + "</a>";
		return false;
	}
	function run() {
		for (var i = 1; i < argu.length; i++) {
			argu[i].run();
			save.eventBreak = false;
			triggerEvent();
		}
	}
}


function Choice(argu) {
	this.run = run;
	this.next = next;
	function run() {
		document.getElementById("options").innerHTML = "";
		for (var i = 0; i < argu.length; i++) {
			argu[i].print(i);
		}
		return true;
	}
	
	function next(buttonID) {
		argu[buttonID].run();
	}
}

	

function RefreshDisplay(input) {
	this.run = run;
	function run() {
		document.getElementById("display").innerHTML = input + "<br />";
		return false;
	}
}