//properties.js contains the script used by properties.html in order to create a reactive webpage.
//This document contains a variety of TODOs that must be filled in by you (the student!) in order for the program to function.

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//TODO: add a player variable named "player" and populate them with the information necessary for display
let player = {
	name: "Ryan",
	piece: "Ship",
	money: 1000,
}


//TODO: add three property variables named "property1" "property2" and "property3" and populate them with the information necessary for display
function Property(name, color, price, rent){
	this.name = name;
	this.color = color;
	this.price = price;
	this.rent = rent;
}

let property1 = new Property("Reading Railroad", "Brown", 200, 50);
let property2 = new Property("Broadway Hotel", "Blue", 150, 60);
let property3 = new Property("Block Apartments", "Red", 400, 100);

//TODO: add the information to the webpage using getElementById().innerHTML
document.getElementById("player").innerHTML = player.name + ", using the " + player.piece + " game piece, currently has $" + player.money + "." ;
document.getElementById("property1").innerHTML = 
	player.name + " owns " + property1.name + ", a(n) " + property1.color + " property that cost " + property1.price + " and has a base rent of " + property1.rent + ".";
document.getElementById("property2").innerHTML = 
	player.name + " owns " + property2.name + ", a(n) " + property2.color + " property that cost " + property2.price + " and has a base rent of " + property2.rent + ".";
document.getElementById("property3").innerHTML = 
	player.name + " owns " + property3.name + ", a(n) " + property3.color + " property that cost " + property3.price + " and has a base rent of " + property3.rent + ".";
