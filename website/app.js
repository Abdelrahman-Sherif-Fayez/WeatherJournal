/* Global Variables */
const api_Key = '96096c44d33896d6beff2e6f67c697f5';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();


// Event Listener to listen to the click of the user on generate button.
    document.querySelector('#generate').addEventListener('click',async() => {

//Saving the user entered zipcode and feelings
        const zipCode = document.querySelector("#zip").value;
        const feelingsToday = document.querySelector('#feelings').value;

//Checking if the user entered the required field or not
        if (zipCode === '' || feelingsToday ===''){
            alert('zipCode or your feeling are empty , Please enter a zip code and your today\'s feelings!');
            return
         }
//Calling the gettingWeatherData async function to get data from OpenWeatherMap Api
        const weatherTemperature = await gettingWeatherData(zipCode);

//Calling postingData async function to post data from the client-side to the server-side and save data in the projectData object in the server
        postingData(weatherTemperature,feelingsToday);

//Calling the UpdatingUserInterface async function to get the data from the server and show it in the client-side to update dynamically the UI with the external Api data and also the user input data.
        UpdatingUserInterface();
})

/* Function to GET Web API Data*/
const gettingWeatherData = async (zipCode) =>{
   const websiteUrl =`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${api_Key}&units=metric`;
   const websiteResponse = await fetch(websiteUrl);
    try{
   const webData = await websiteResponse.json();
   const weatherTemperature = webData.main.temp;
   return weatherTemperature;
    }
    catch(err){
        console.log('error', err);
    }
}

/* Function to POST data */
const postingData = async(weatherTemperature, feelingsToday) =>{
     await fetch('/postingRoute', {
        method : "POST",
        credentials : "same-origin",
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({
            date : newDate,
            temperature : weatherTemperature,
            userFeelings : feelingsToday
        })}
    )
}

/* Function to GET Project Data */
const UpdatingUserInterface = async() =>{
  //Fetching the get route from the server using fetch()
   const data = await fetch('/GettingData')
    try{
   const incomingServerData = await data.json();

  //Dynamically update the UI with the external Api data and also the user input data
   document.getElementById('date').innerHTML = 'Date : ' + incomingServerData.date;
   document.getElementById('temp').innerHTML = 'Temp : ' +incomingServerData.temperature +' degree celsius';
   document.getElementById('content').innerHTML = 'Feeling : ' +incomingServerData.userFeelings;
    }
    catch(error){
        console.log('Error', error);
    }
}