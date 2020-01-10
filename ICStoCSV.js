"use strict";

var _a;
const args = process.argv
const fs = require("fs")
const inputCal = (_a = args[2], (_a !== null && _a !== void 0 ? _a : "input-example.ics"))


// ----- Defines ------
const possibleStates = {
    planned: "GEPLANT",
    active: "AKTIV",
    canceled: "ABGESAGT",
    postponed: "VERSCHOBEN",
    closed: "GESCHLOSSEN"
}
const possibleTypes = {
    practical: "PRAXIS",
    theoretical: "THEORIE",
    mixed: "GEMISCHT"

}
const possibleGroup = {
    default: {
        name: "Übung",
        alias: ["übung", "gemeindeübung", "übungaktive"]
    },
    ma: {
        name: "Ma Übung",
        alias: ["maübung", "übungmaschinisten"]
    },
    special: {
        name: "Sonderübung",
        alias: ["sonderübung"]
    },
    at: {
        name: "At Übung",
        alias: ["atübung"]
    },
    fr: {
        name: "Fr Übung",
        alias: ["frübung"]
    }
}
// ---------------------

// Get file content and generate array of events with it (without "BEGIN:VEVENT", "END:VEVENT" tags)
const icsCalendar = fs.readFileSync(inputCal, {encoding: "utf8"}).replace(/\r/g, "")
const icsLines = [];
const icsEvents = icsCalendar.split("BEGIN:VEVENT");
let remLines = icsEvents.shift();
let calEvents = []

icsEvents.forEach( (eventString) => {
    let helpAr = eventString.split("END:VEVENT");
    calEvents.push(helpAr.shift());
    helpAr.forEach( (val) => {remLines += val;});
} );

// save as Array and remove empty lines
const remArray = remLines.split("\n").filter( (line) => {return (line !== "")});

calEvents = calEvents.map( (eventString) => {
    const fields = eventString.split("\n");
    let addToLine = "";
    let propFields = [];
    while(fields.length > 0){
        let line = "";
        line = fields.pop();
        if(line.split(":").length < 2){
            addToLine += line;
        } else {
            line += addToLine;
            addToLine = "";
            propFields.unshift(line);
        }
    }
    let obj = {};
    propFields.forEach( (field) => {
        let pref, val, helper;
        helper = field.split(":");
        pref = helper.shift();
        val = helper.join(":");
        const key = pref.split(";").shift();
        obj[key] = {pref, val};
    })
    return obj
})

// generate output events
let vcsEvents = []
calEvents.forEach( (event) => {
    let evProto = {};

    // name of the event
    let hSum = convertSummary(event.SUMMARY.val);
    evProto.blockname = hSum.block;
    evProto.topic = hSum.post;

    // start and end date
    evProto.tstart = convertTime(event.DTSTART.val);
    evProto.tend = convertTime(event.DTEND.val);

    vcsEvents.push(evProto);
})

// create output string and write to file
let outProto = ""
vcsEvents.forEach( (vcs) => {
    let outline = ""
    outline += vcs.blockname + ";" // Name of the block
    outline += vcs.tstart + ";" // Event start time
    outline += vcs.tend + ";" // Event end time
    outline += possibleStates.planned + ";" // Status of the Event
    outline += possibleTypes.mixed + ";" // Type of Event
    outline += vcs.topic + ";" // Event topic
    outline += ";" // Detailed Description
    outline += ";" // min Participants
    outline += "" // max Participants

    outProto += outline + "\n"
})
outProto = outProto.slice(0,-1)
fs.writeFileSync("output.csv", outProto, {encoding: "utf8"})

console.log(vcsEvents[0], vcsEvents[1]);

//####################################
//-------- FUNCTIONS
//####################################

/**
 * Converts Timeformat string 20200120T193000 -> 20.01.2020 19:30
 * @param {string} oldTime 
 */
function convertTime(oldTime){
    if(typeof(oldTime) !== "string"){
        throw new TypeError("expected string")
    }

    let hDate = oldTime.split("T");
    const oldDateStart = {
        day: {y: hDate[0].slice(0,4), m: hDate[0].slice(4,6), d: hDate[0].slice(6,8)},
        time: {h: hDate[1].slice(0,2), m: hDate[1].slice(2,4), s: hDate[1].slice(4,6) }
    }
    const Out = oldDateStart.day.d + "." +
                oldDateStart.day.m + "." +
                oldDateStart.day.y + " " +
                oldDateStart.time.h + ":" +
                oldDateStart.time.m;
    return Out
}

function convertSummary(oldSum){
    if(typeof(oldSum) !== "string"){
        throw new TypeError("expected string")
    }

    // clean input
    oldSum = oldSum.replace(/\\,/g,",");
    oldSum = oldSum.replace(/\t/g, "");

    // try different seperators in the follwoing order 1. ":"   2. "/"  3. ","
    let seperator = "";
    let hArray = oldSum.split(":");
    if(hArray.length === 1) {
        hArray = oldSum.split("/");
        if(hArray.length === 1) {
            hArray = oldSum.split(",");
            if(hArray.length === 1){
                throw new Error("summary not formatted as expected")
            } else {
                seperator = ","
            }
        } else {
            seperator = "/"
        }
    } else {
        seperator = ":"
    }

    let pre = hArray.shift()
    let post = "", block = "";
    post = hArray.join(seperator).trim();

    pre = pre.replace(/ |-/g,"").toLowerCase();

    Object.keys(possibleGroup).forEach( (group) => {
        if(possibleGroup[group].alias.some( el => {return (el === pre)})){
            if(block === ""){
                block = possibleGroup[group].name
            } else{
                throw new Error("cannot clearly assign Group")
            }
        }
    })

    if(block === ""){
        throw new Error("pre does not match any block")
    }

    return {block, post}
}
