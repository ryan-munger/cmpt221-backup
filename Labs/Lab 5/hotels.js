//hotels.js contains the script used by hotels.html in order to create a reactive webpage.
//This document contains a variety of TODOs that must be filled in by you (the student!) in order for the program to function.


//TODO: create a Property class.
class Property {
	//TODO: create a constructor that takes in the property name as a field, and initializes counters for houses and hotels with a default
	//		value of 0.
	constructor(name){
		this.name = name;
		this.houses = 0;
		this.hotels = 0;
	}

	buildHouse() {
	//TODO: fill in with a function that increments the instance's house count if the current number of houses is less than 4,
	//		and sets the appropriate "property_text" and "house_text" using getElementById if so. If the number of houses is four or
	//		more, set the appropriate "property_text" notifying the user that the action is invalid.
		if(this.houses < 4){
			this.houses++;
			document.getElementById("property_text").innerHTML = "A house has been added to " + this.name + ".";
			document.getElementById("house_text").innerHTML = this.name + " has " + this.houses + " houses.";
		} else {
			document.getElementById("property_text").innerHTML = "This action is invalid, " + this.name + " has 4 or more houses.";
		}
	}

	buildHotel() {
	//TODO: create a buildHotel() function that increments the instance's hotel count and decrements the house count if the current number 
	//		of houses on the property is greater than or equal to four. Make sure to set the appropriate "property_text" with a success 
	//		message and an updated "hotel_text" and "house_text" count. Otherwise, set "property_text" notifying the user that the action
	//		is invalid.
		if(this.houses >= 4){
			this.hotels++;
			this.houses--;
			document.getElementById("property_text").innerHTML = "A hotel has been added to " + this.name + " and a house has been removed.";
			document.getElementById("house_text").innerHTML = this.name + " has " + this.houses + " houses.";
			document.getElementById("hotel_text").innerHTML = this.name +" has " + this.hotels + " hotels.";
		} else {
			document.getElementById("property_text").innerHTML = "This action is invalid, " + this.name + " does not have 4 or more houses.";
		}
	}
}

//TODO: create an instance of the Property class named VIRGINIA_AVENUE. 
let VIRGINIA_AVENUE = new Property("Virginia Avenue")