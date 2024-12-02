//Main Loop

let dateInfo = getCurrentDateTime();
greeting();
setInterval(updateTimeAndGreeting, 1000);
displayVisit();


//Greating Code
async function greeting() {
    const form = document.getElementById('name');

    form.hidden = false;   
    if(localStorage.getItem('Name') === null ){
        form.hidden = false;    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        
            const nameInput = document.getElementById('nameInput').value;
        
            if(nameInput){
                localStorage.setItem('Name',nameInput);
                form.hidden = true;
                greeting();
            }
                     
            
        
        });
    }
    else{
        form.hidden = true;
        document.getElementById('greeting').textContent = getTimeOfDayGreeting(dateInfo.hour) + ' ' + localStorage.getItem('Name') + '! It\'s ' + dateInfo.time + ' EST' + ' and it\'s ' + await fetchWeather() + ' right now.';
    
    }
}

//Time Code
function getCurrentDateTime(){
    let dateTime = new Date();

    const time = dateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true });    
    const date = dateTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
    const hour = dateTime.getHours();
    
    return {time, date, hour};
}

function getTimeOfDayGreeting(hour) {
    if (hour >= 5 && hour < 12) {
        return "Good morning";

    } else if (hour >= 12 && hour < 18) {
        return "Good afternoon";

    } else {
        return "Good evening";
    }
}

async function updateTimeAndGreeting() {
    dateInfo = getCurrentDateTime(); 
    greeting(); 
}

function displayVisit(){
    const lastVisit = localStorage.getItem('lastVisit');

    if(lastVisit){
        document.getElementById('last-visit').hidden = false;

        document.getElementById('last-visit').textContent = 'Your last visit was on: ' + lastVisit;

    }
    else{
        document.getElementById('last-visit').hidden = true;
    }

    const currentVisit = new Date().toLocaleString();
    localStorage.setItem('lastVisit', currentVisit);

}

//Weather Code
function mapWeatherCodeToDescription(code) {
    // Object to map weather codes to descriptive strings
    const weatherDescriptions = {
        0: 'a clear sky',
        1: 'mainly clear',
        2: 'partly cloudy',
        3: 'overcast',
        45: 'fog',
        48: 'depositing rime fog',
        51: 'drizzle: light',
        53: 'drizzle: moderate',
        55: 'drizzle: dense',
        56: 'freezing drizzle: light',
        57: 'freezing drizzle: dense',
        61: 'rain: slight',
        63: 'rain: moderate',
        65: 'rain: heavy',
        66: 'freezing rain: light',
        67: 'freezing rain: heavy',
        71: 'snow fall: slight',
        73: 'snow fall: moderate',
        75: 'snow fall: heavy',
        77: 'snow grains',
        80: 'rain showers: slight',
        81: 'rain showers: moderate',
        82: 'rain showers: violent',
        85: 'snow showers: slight',
        86: 'snow showers: heavy',
        95: 'thunderstorm: slight',

    };

    return weatherDescriptions[code] || 'unknown';
}


async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current_weather=true');
        const data = await response.json(); // Parse the response as JSON
        const weatherDescription = mapWeatherCodeToDescription(data.current_weather.weathercode);
        return weatherDescription;
        
    }
    catch(error){
        console.error(error.message);
    }
}



