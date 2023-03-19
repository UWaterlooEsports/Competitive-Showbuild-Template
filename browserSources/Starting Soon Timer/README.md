# webcontrol-template
Browser source template/source code for making browser source based graphics and animations, controlled by a Google sheet.
This is a baseline/reference point from which you can adapt and make your own browser source based graphics.

You can open `template.html` in a local webserver and import it as a browser source to see how this example works. 
You will need to make your own HTML/CSS graphics per whatever you are trying to design, and edit 
logic.js to update fields and execute commands, according to your Google sheet. 

I'm doing this using [`python3 webserver` ](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server), which
can be accessed by first [installing python3](https://www.python.org/). Then navigate to the folder with the .html file you want to run, 
and use `python3 -m http.server`, which will open the server at `localhost:8000`.

I tried using the node.js server, but it always threw some error related to jquery...


# Notes
There is no support for logic that involves writing to the google sheet, as that requires Google OAuth Client,
and I haven't gotten around to setting that up yet. All the logic can only read from a google sheet. 

To read from Google sheet, you need a Google Sheets API Key, which you would put into const API_KEY within logic.js.

To add this example as a browser source in OBS, you need to start a local server and copy its URL to 
the OBS browser source. I'm doing this by using Node.js, typing http-server in the command line directory of this project,
and entering localhost:8080/(filename) as the url. 

I've done my best to leave helpful comments that describe what things are for. 

HIGHLY RECOMMEND SELECTING "Shutdown source when not visible" in OBS.

# Function descriptions

`fadeTextChange(string elementID, string newText, int Color[])` will fade text out, change the text, and fade it back in.
It does not change any text if the new text is the same as the current text. It also assumes the color[] you input is
the same as the current text color.

`startTimer()` will start a timer according to values pulled from your Google Sheet. You will have to fiddle around with
changing the values[][] indices according to the data you're pulling to ensure that the push, pause, and timer numbers
are being pulled from the correct cells. Assumes you only have one timer on the browser, whose HTML ID is in 
`const TIMER_ELEMENT`.

`getSheetsValue()` is a function called every `PULLRATE`ms, and as its name suggests, it pulls data from the sheet
and range that you specify. Once it completes a pull, it calls `updateElements(response)` with the Google API 
response object it received from the API pull. `updateElements()` is where the logic for what elements, animations
or other functions should be called based on the data received from the GAPI pull. 