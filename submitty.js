/**
 * Aidan Lane
 * Updated 9/23
 * Testing a LATE google extension add-on
 * TODO:
 * automatic user grabbing when on LATE page
 * manual sign in option
 * mongo integration
 * chrome global and local storage
 */

// get all current buttons available to student
var buttons = document.getElementsByClassName("btn btn-primary btn-nav btn-nav-submit");
// gets corresponding assignment/exam name by index
var titles = document.getElementsByClassName("course-title");

class Button {
    constructor(title, date, time, am_pm, url, button) {
        this.title = title;
        this.date = date;
        this.time = time;
        this.am_pm = am_pm;
        this.url = url;

        // physical button object data
        this.button = button;
        this.button.className = "late_add_button"; // class name for CSS
        this.button.innerHTML = "LATE"; // default button text

        // click event
        button.onclick = function() {
            this.innerHTML = "Added!";
            this.style.backgroundColor = "rgb(95, 183, 96)";
            this.disabled = true;
        };
    }
};

var button_list = [];

for(var i = 0;i < buttons.length; i++) {
    var subtitle = buttons[i].getElementsByClassName("subtitle"); // due date data that appears in button
    var due_date_raw = "";
    if(subtitle.length > 0)
        due_date_raw = subtitle[0].innerText;
    var parsed = due_date_raw.split(" ");

    // parse raw button data into useful information
    var title = titles[i].innerText;
    var date = parsed[1];
    var time = parsed[3];
    var am_pm = parsed[4];
    var url = buttons[i].href;

    button_list.push(new Button(title, date, time, am_pm, url, document.createElement("button")));
    // appends HTML button as child to Submitty's submit button's div
    buttons[i].parentElement.appendChild(button_list[i].button);
}