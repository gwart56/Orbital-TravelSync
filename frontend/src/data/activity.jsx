import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { sortDates } from "../utils/dates";
dayjs.extend(customParseFormat)

export class Itinerary {
    static count = 0;
    id;
    name;
    travelDays;
    numOfDays;
    startDate;

    constructor(name, dayArr, numOfDays, startDate) { //(String, array of TravelDays)
        this.name = name;
        this.numOfDays = numOfDays;
        this.startDate = startDate;
        this.travelDays = [...dayArr];
        this.id = Itinerary.count;
        Itinerary.count++;
    }

    static fromJSON(data) {
        const it = new Itinerary(data.name, [], data.numOfDays, data.startDate);
        it.id = data.id;
        it.travelDays = data.travelDays.map(TravelDay.fromJSON);
        return it;
    }

    addDay() {
        const newDayArr = addDayArray(this.travelDays);
        return new Itinerary(this.name, newDayArr, this.numOfDays, this.startDate);
    }

    removeDay(id) {
        const newDayArr = deleteDayArray(this.travelDays, id);        
        return new Itinerary(this.name, newDayArr, this.numOfDays, this.startDate);
    }

    setActivitiesOfDay(dayId, actArr) {
        const targetDay = this.travelDays.find(day => day.id === dayId);
        targetDay.activities = actArr;
        return new Itinerary(this.name, this.travelDays, this.numOfDays, this.startDate);
    }
}

export class TravelDay {
    static count = 0;
    id;
    activities;

    constructor(date, activityArr) {
        this.activities = [...activityArr];
        this.id = TravelDay.count;
        TravelDay.count++;
    }

    addActivity(vals) {
        this.activities.push(new Activity(vals));
    }

    removeActivity(id) {
        this.activities = this.activities.filter(act => act.id != id);
    }

    editActivity(id, vals) {
        this.removeActivity(id);
        this.addActivity([...vals, id]);
    }

    static fromJSON(data) {
        const day = new TravelDay(data.date, []);
        day.id = data.id;
        day.activities = data.activities.map(Activity.fromJSON);
        return day;
    }
}

export class Activity {
    static count = 0;
    id;
    name;
    time;
    locName;
    locAddress;

    constructor(...args) {
        if (args.length==4) {// 4 args
            this.name = args[0];
            this.time = args[1];
            this.locName = args[2];
            this.locAddress = args[3];
            this.id = Activity.count;
            Activity.count++;
        }
        if (args.length==1) { //if array
            const arr = args[0];
            if (arr.length==4) { //4 args in array
                this.name = arr[0];
                this.time = arr[1];
                this.locName = arr[2];
                this.locAddress = arr[3];
                this.id = Activity.count;
                Activity.count++;
            } else if (arr.length==5) { //5 args in array (includes id)
                this.name = arr[0];
                this.time = arr[1];
                this.locName = arr[2];
                this.locAddress = arr[3];
                this.id = arr[4];
            }
        }
    }

    static fromJSON(data) {
        const act = new Activity([data.name, data.time, data.locName, data.locAddress, data.id]);
        act.id = data.id;
        return act;
    }
}

export function editActivityArray(arr, id, vals) {
    arr = arr.filter(act => act.id != id);
    arr.push(new Activity([...vals, id])); //use the same id
    return arr;
}

export function deleteActivityArray(arr, id) {
    arr = arr.filter(act => act.id != id);
    return arr;
}

export function addActivityArray(arr) {
    const newArr = [...arr, new Activity("(new)","","","")];
    return newArr;
}

export function addDayArray(arr) {
    const arrLen = arr.length;
    if (arrLen == 0) {
        return [new TravelDay(new dayjs().format('DD-MM-YYYY'), [new Activity("(new)","","","")])];
    }
    arr = sortDates(arr); //sort the dates

    const latestdate = arr[arrLen - 1].date; //get last date
    const newdate = dayjs(latestdate, 'DD-MM-YYYY').add(1,'day').format('DD-MM-YYYY'); //add one date
    const newArr = [...arr, new TravelDay(newdate, [new Activity("(new)","","","")])]; 
    return newArr;
}

export function deleteDayArray(arr, id) {
    arr = arr.filter(d => d.id != id);
    return arr;
}

export function loadItinFromLocal() {
    const saved = localStorage.getItem("itinLocal");
    if (saved) {
        const parsed = JSON.parse(saved);
        const itinerary = Itinerary.fromJSON(parsed);
        return itinerary;
    }
    return defaultItin;
}

export function saveToLocal(itin) {
    console.log("auto-saved itinerary to localStorage");
    localStorage.setItem("itinLocal", JSON.stringify(itin));
}


//----------------example values-----------------
let defActivities = [
    new Activity("Lunch at macs", "12:00", "RoundOne", "address road 12345"),
    new Activity("RoundOne", "08:00", "RoundOne", "address road 12345"),   
    new Activity("Dinner", "15:00", "Sushi Place", "address road 12345"),
    new Activity(["Supper", "20:00", "FamilyMart", "address road 12345"])
];

let defTravelDays = [new TravelDay(
    dayjs().format('DD-MM-YYYY')
    , defActivities)];

export let defaultItin = new Itinerary("Example Itinerary - Japan Trip", defTravelDays, 1, dayjs().format('DD-MM-YYYY'));