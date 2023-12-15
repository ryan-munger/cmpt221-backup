//jail.js contains the script used by jail.html in order to create a reactive webpage.
//This document contains a variety of TODOs that must be filled in by you (the student!) in order for the program to function.

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//TODO: create a number variable named "count" that will increment every time the roll function is called
let count = 0;

//TODO: create a boolean variable named "inJail" that keeps track of whether or not the player is currently in jail
let inJail = true;

//TODO: create a function named "diceRoller" to house your dice rolling code
//Math.floor((Math.random() * 6) + 1) will give you a random number from 1 to 6.
function diceRoller() {
	return Math.floor((Math.random() * 6) + 1);
}

//TODO: use the function named "roll" to house your roll checking code
function roll() {

	//if inJail is true, then roll dice and check to see if the player is released
	if(inJail) {

		//TODO: increment count variable
		count++;
		//TODO: create two variables named "roll1" and "roll2" and set them equal to the output of the diceRoller function
		let roll1 = diceRoller();
		let roll2 = diceRoller();

		//use the document calls provided below in order to change the values of HTML elements
		//note that the elements that you can change are "rolls_text" "results_text" and "jail_text" 
		// document.getElementById("rolls_text").innerHTML = "You rolled a " + roll1 + " and a " + roll2 + ".";
		// document.getElementById("results_text").innerHTML = "This line can be used to display more information about roll results.";
		// document.getElementById("jail_text").innerHTML = "This line can be used to display whether or not the player is still in jail.";

		//TODO: check if roll1 and roll2 are the same
		//TODO: print out a statement letting the player know what their rolls are and if they are out of jail
		//HINT: use the html elements "rolls_text" "result_text" and "jail_text" to display text
		document.getElementById("rolls_text").innerHTML = "You rolled a " + roll1 + " and a " + roll2 + ".";
		if(roll1 === roll2){
			document.getElementById("results_text").innerHTML = "You rolled a double!";
		 	document.getElementById("jail_text").innerHTML = "You are out of jail.";
			inJail = false;
		}else{
			if(count === 5) {
				inJail = false;
				document.getElementById("results_text").innerHTML = "Your rolls did not match but this was your 5th roll.";
				document.getElementById("jail_text").innerHTML = "You are out of jail.";
			}else{
				document.getElementById("results_text").innerHTML = "Your rolls did not match nor have you rolled enough.";
				document.getElementById("jail_text").innerHTML = "You are in jail.";
			}
		}

		//TODO: if the player's rolls are not the same, check if count is equal to 5 (the max number of tries before a player is automatically released)
		//if so, print out a statement letting the player know if they are out of jail and change the status of inJail

	} 

	//if inJail is false, print out a simple statement telling the player they are out of jail
	//HINT: use the HTML elements "rolls_text" "result_text" and "jail_text" to display text
	else {
		if(!inJail){
			document.getElementById("jail_text").innerHTML = "You are not in jail.";
		}
	}
}