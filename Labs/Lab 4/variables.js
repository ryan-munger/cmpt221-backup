let name = "Endeavour";
let speed = 17500;
const distMars = 225000000;
const distMoon = 384400;
const milesPerKm = 0.6214;

console.log("Name: " + typeof(name) + ". Speed: " + typeof(speed) + ". DistMars: " + typeof(distMars) + 
". DistMoon: " + typeof(distMoon) + ". Miles per KM: " + typeof(milesPerKm));

const milesToMars = distMars * (1/milesPerKm);
let hoursToMars = milesToMars / speed;
let daysToMars = hoursToMars / 24;
console.log(name + " will take " + daysToMars + " days to reach Mars.");

const milesToMoon = distMoon * milesPerKm;
let hoursToMoon = milesToMoon / speed;
let daysToMoon = hoursToMoon / 24;
console.log(name + " will take " + daysToMoon + " days to reach the Moon.");

let date = "Monday 2019-03-18";
let time = "10:05:34 AM";
let astronautCount = 7;
let astronautStatus = "ready";
let averageAstronautMassKg = 80.7;
let crewMassKg = astronautCount * averageAstronautMassKg;
let fuelMassKg = 760000;
let shuttleMassKg = 74842.31;
let totalMassKg = crewMassKg + fuelMassKg + shuttleMassKg;
let fuelTempCelsius = -225;
let fuelLevelPercent = 100;
let weatherStatus = "clear";

console.log("-------------------------------------");
console.log("> LCO4 - LAUNCH CHECKLIST");
console.log("-------------------------------------");
console.log("Date: " + date);
console.log("Time: " + time);
console.log("\n-------------------------------------");
console.log("> ASTRONAUT INFO");
console.log("-------------------------------------");
console.log("* count: " + astronautCount);
console.log("* status: " + astronautStatus);
console.log("\n-------------------------------------");
console.log("> FUEL INFO");
console.log("-------------------------------------");
console.log("* Fuel temp celsius: " + fuelTempCelsius + " C");
console.log("* Fuel level: " + fuelLevelPercent + "%");
console.log("\n-------------------------------------");
console.log("> MASS DATA");
console.log("-------------------------------------");
console.log("* Crew Mass: " + crewMassKg + " kg");
console.log("* Fuel Mass: " + fuelMassKg + " kg");
console.log("* Shuttle Mass: " + shuttleMassKg + " kg");
console.log("* Total Mass: " + totalMassKg + " kg");
console.log("\n-------------------------------------");
console.log("> FLIGHT PLAN");
console.log("-------------------------------------");
console.log("* weather: " + weatherStatus);
console.log("\n-------------------------------------");
console.log("> OVERALL STATUS");
console.log("-------------------------------------");
console.log("* Clear for takeoff: YES");

let engineIndicatorLight = "red blinking";
let spaceSuitsOn = true;
let shuttleCabinReady = true;
let crewStatus = spaceSuitsOn && shuttleCabinReady;
let computerStatusCode = 200;
let shuttleSpeed = 17500;

// the console will display "engines are off"

if(crewStatus){
    console.log("\nCrew Ready");
} else {
    console.log("\nCrew Not Ready");
}

if(computerStatusCode == 200){
    console.log("\nPlease Stand by. Computer is rebooting.");
} else if(computerStatusCode == 400) {
    console.log("\nSuccess! Computer online.");
} else if(computerStatusCode == 500){
    console.log("\nSuccess! Computer offline!");
}

if(shuttleSpeed > 17500){
    console.log("\nALERT: Escape velocity reached!");
} else if(shuttleSpeed < 8000) {
    console.log("\nALERT: Cannot maintain orbit!");
} else {
    console.log("\nStable speed.");
}

// Both code blocks produce the same result

let fuelLevel = (fuelLevelPercent/100) * 760000;

if(fuelLevel < 1000 || fuelTempCelsius > 3500 || engineIndicatorLight === "red blinking"){
    console.log("\nENGINE FAILURE IMMINENT!")
}else if(fuelLevel <= 5000 || fuelTempCelsius > 2500){
    console.log("\nCheck fuel level. Engines running hot.")
}else if(fuelLevel > 20000 && fuelTempCelsius <= 2500){
    console.log("\nFull Tank. Engines good.")
}else if(fuelLevel > 10000 && fuelTempCelsius <= 2500){
    console.log("\nFuel level above 50%. Engines good.")
}else if(fuelLevel > 5000 && fuelTempCelsius <= 2500){
    console.log("\nFuel level above 25%. Engines good.")
}else{
    console.log("\nFuel and engine status pending...")
}