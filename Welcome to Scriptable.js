// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic-wand;
/************
 * Thank you for downloading Scriptable.
 * This script highlights some of the
 * features in the app. It fetches the
 * latest news from MacStories and
 * presents the headlines along with an
 * image in a table. You can even run the
 * script from a Siri Shortcut.
 * 
 * Press the play button to run
 * the script.
 * 
 * Congratulations! You've just run your
 * first script in Scriptable. 
 * 
 * Now let's create a Siri Shortcut. 
 * Press the "toggles" to open the script
 * settings. Rhen press "Add to Siri".
 * Follow the instructions on the screen.
 * 
 * If you've created a Siri Shortcut, 
 * trigger the shortcut with Siri.
 * This presents the latest news inside
 * of Siri without even opening the app.
 * 
 * Alright. It's time to become familiar
 * with some of the APIs that Scriptable
 * provides. Remember that you can always
 * find the documentation for these APIs
 * by pressing the paper button.
 * 
 * You will find comments explaining what
 * is going on in each of the steps in the
 * script below.
*/

// First we need to fetch the news. We create a Request object which can make HTTP requests. MacStories provide their news in a JSON feed. The Request object can automatically parse JSON by calling the "loadJSON()" function. Note that "await" keyword here. "loadJSON()" returns a native JavaScript promise. This is an object which will provide a value sometime in the future. We use "await" to wait for this value and halt execution of the script in the mean time.
let url = "https://macstories.net/feed/json"
let req = new Request(url)
let json = await req.loadJSON()
// We want to present the articles in a table, so we create a new UITable. A table contains rows which are displayed vertically. A row in turn contains cells which are displayed horizontally.
let table = new UITable()
for (item of json.items) {
  // For each item, i.e. each story, we create a row in the table.
  let row = new UITableRow()
  // Call our extractImageURL function to extract an image URL from the HTML body of the story.
  let body = item["content_html"]
  let imageURL = extractImageURL(body)
  // Call our decode() function to decode HTML entities from the title.
  let title = decode(item.title)
  // Add an image cell to the row. Cells are displayed in the order they are added, from left to right.
  let imageCell = row.addImageAtURL(imageURL)
  // Add the title cell to the row.
  let titleCell = row.addText(title)
  // Set the width weights of our cells. Cell widths are relative. In this case we have two cells, imageCell with a widthWeight of 20 and titleCell with a widthWeight of 80. This gives us a total widthWeight of 20 + 80 = 100. So the imageCell will fill 20/100 (20%) of the available screen space and the titleCell will fill 80/100 (80%) of the available screen space.
  imageCell.widthWeight = 20
  titleCell.widthWeight = 80
  // Set height of the row and spacing between cells, in pixels.
  row.height = 60
  row.cellSpacing = 10
  // Add the row to the table. Rows are displayed in the order they are added.
  table.addRow(row)
}
// Presents the table using the QuickLook bridge. "Bridges" is the concept that allows JavaScript to use native iOS APIs. For example, presenting the table with QuickLook will present a native view containing the table. The same API also works in Siri.
QuickLook.present(table)
// We want Siri to say a kind message whenthe script is run using a Siri Shortcut.
// We use the global variable "config" to determine how the script is  being run.
// The Speech API will speak a text using Siri. While this also works when the script is run with the app, it's much more enjoyable when the script is run from a Siri Shortcut.
if (config.runsWithSiri) {
  Speech.speak("Here's the latest news.")
}
// It is good practice to call Script.complete() at the end of a script, especially when the script is used with Siri or in the Shortcuts app. This lets Scriptable report the results faster. Please see the documentation for details.
Script.complete()

// Finds the first image in the HTML and returns its URL. Returns null if no image is found.
function extractImageURL(html) {
  let regex = /<img src="(.*)" alt="/
  let matches = html.match(regex)
  if (matches && matches.length >= 2) {
    return matches[1]
  } else {
    return null
  }
}

// Decodes HTML entities in the input string. Returns the result.
function decode(str) {
  let regex = /&#(\d+);/g
  return str.replace(regex, (match, dec) => {
    return String.fromCharCode(dec)
  })
}