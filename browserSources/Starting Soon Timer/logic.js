/*
 * This file contains basic code template necessary for pulling data from a google sheet.
 * Every function before getSheetsValue() should remain relatively constant in every instance
 * of this js logic. All you really need to do is edit getSheetsValue() to be ingesting the right
 * range of data from the sheet(s), in a format that you can understand and parse into each browser source.
 * Then add other functions and logic stemming from the data you get to add animations, logic, update values,
 * etc.
 *
 * HIGHLY RECOMMEND SELECTING "Shutdown source when not visible" in OBS.
 */
// TODO: check API key, spreadsheet ID, range name and range values, discovery doc, parse info
const fadeTime = 400;
//Fade transition time in ms, used in setTimeout(). Make sure this matches the fade time in the css .root{} constants.\

//COLORS CONSTANTS
const cWhite = [255,255,255];
const cBlack = [0,0,0];
const cUWYellow=[247,202,0];
const ON = '1'; //alpha codes, for clarity when reading code
const OFF = '0';


//-----------------------------------------------------
//GLOBAL VARIABLES (specific to use case of graphic)
let gapiInited = false;
let timeSet = false;
let pauseTimer=false;
let timerRef;
let fadeTimer = false;
let time = 0;
/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
    console.log('gapiLoaded()');
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    console.log('initializeGapiClient()');
    setInterval(getSheetsValue, PULLRATE);
}


async function getSheetsValue() {
    let response;
    try {
        //Fetching data values from spreadsheet
        response = await gapi.client.sheets.spreadsheets.values.get({
            //When changing sheets, update sheetID, and update the sheet name when updating range
            spreadsheetId: SPREADSHEETID,
            range: PAGENAME + '!' + RANGE,
        });
    } catch(err) {
        //error check
        //document.getElementById('errorMessage').innerText=err.message;
        console.log('try catch error in getSheetsValue()');
        return;
    }

    const range = response.result;
    //error checking the values returned from the API check
    if (!range || !range.values || range.values.length == 0) {
        //document.getElementById('errorMessage').innerText = 'No values found.';
        console.log('Null values/invalid data received from gapi in getSheetsValue() second check');
        return;
    }
    console.log('successful getSheetsValue()');
    //If successfully extracted data with no errors, execute updateElements()
    updateElements(response);
    return;
}
/* getSheetsValue() has completed, it now sends the updated data to updateElements(), which you will have to
 * refactor with appropriate code and logic to update whichever HTML fields need to be updated, execute animations,
 * or do literally whatever you need to do with the new data. Consider updateElements() your blank slate.
 * Note: the values[][] array is default given as [row][column].
 */

function updateElements(response) {
    let values = response.result.values;

    //Timer

    if (values[3][0]== 'TRUE' && !timeSet) { //check if pushing new timer
        time = (parseInt(values[2][0])*60) + parseInt(values[2][1]) + 1;
        timeSet=true;

        clearInterval(timerRef);
        timerRef = setInterval(startTimer,1000);
        fadeTimer=false;
    } else if (values[3][0]=='FALSE') { //prep to push new timer
        timeSet = false;
    }
    if (values[4][0]=='TRUE') { //check if timer is supposed to be paused
        pauseTimer = true;
    }
    else {
        pauseTimer = false;
    }
}

function startTimer() {
    if (!pauseTimer) {
        time--;
    }
    let min = Math.floor(time/60);
    let sec = time%60;
    let out = '';

    if (time <= 0) {
         if (!fadeTimer) {
             document.getElementById(TIMER_ELEMENT).innerText = '0:00';
             setTimeout(() => {
                 fadeTextChange(TIMER_ELEMENT, '',cWhite);
                 fadeTimer = true;
             }, 10000);
         }
         return;
    }
    if (sec < 10) {
        out = '' + min + ':0' + sec;
    }
    else {
        out = '' + min + ':' + sec;
    }

    console.log(document.getElementById(TIMER_ELEMENT).textContent);
    if (document.getElementById(TIMER_ELEMENT).textContent.trim()=='') {
        fadeTextChange(TIMER_ELEMENT,out,cUWYellow);
        return;
    }
    document.getElementById(TIMER_ELEMENT).innerText = out;
}

async function fadeTextChange(elementID, newText, color) { //async so it doesn't delay the function that calls it
    let doc = document.getElementById(elementID);

    if (doc.textContent == newText) {
        //use textContent to compare element text, as it removes whitespace/hidden characters related to HTML tags
        return;
    }

    //Turn color into rgba for CSS
    let clrOut = '' + color[0] + ',' + color[1] + ',' + color[2] + ',';

    doc.style.transition = 'color ' + fadeTime + 'ms';
    doc.style.color = 'rgba(' + clrOut + OFF + ')';
    setTimeout(function () {
            doc.innerText = newText;
            doc.style.color = 'rgba(' + clrOut + ON + ')';
        },
        fadeTime);

    setTimeout(()=> {
        doc.style.transition = '';},2*fadeTime);

    return;
    /* Note: Transitions for fading in and out text (SPECIFICALLY TEXT) need to be done by using RGBA color and
 * adjusting the alpha. Transition fading out divs/other objects can be done using opacity. */
}

async function fadeElement(elementID, newImg, newOpacity) {
    //Takes the URL of newImg, fades the desired elementID out, changes the image, then fades it in to the newOpacity.
    //Is overloaded, so you can neglect passing newOpacity if the final desired opacity is 1.0.
    let doc = document.getElementById(elementID);
    if (newOpacity==undefined) {
        newOpacity="1.0";
        console.log('overloaded fadeElementChange(), no opacity passed');
    }

    console.log(newImg + '  ' + doc.src);

    doc.style.transition = 'opacity ' + fadeTime + 'ms';
    doc.style.opacity = '0.0';
    setTimeout(function () {
            doc.src = newImg;
            doc.style.opacity = newOpacity;
        },
        fadeTime);

    setTimeout(()=> {
        doc.style.transition = '';},2*fadeTime);
    return;
}

function readFile () {
	//returns the XMLHTTPRequest, to call this function, take a look at the following code
	/* 
		await readFile().then(function(returnRequest) {
        stringArr = returnRequest.responseText.split(/\r?\n/);  })
	*/
    let req = new XMLHttpRequest();
    //object defined

    return new Promise((resolve, reject) => {

        req.onreadystatechange = (e) => {
            if (req.readyState !== 4) {
                return;
            }

            if (req.status === 200) {
                console.log('SUCCESSFUL file read status 200)');
                resolve(req); //returns req
            } else {
                console.warn('request_error');
            }
        };

        req.open('GET', SIDECOLORSTXT, true);
        req.send();
    });
}