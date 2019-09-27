/**
 * Aidan Lane
 * Updated 9/23
 * Testing a LATE google extension add-on
 * TODO:
 * Fancy HTML widget landing
 * request to add assignments
 * Fix 400 error (sec is set to common domain only)
 */

var send_template = {
    "assessmentType": "",
    "courseCRN": "",
    "description": "",
    "dueDate": "",
    "isRecurring": false,
    "priority": 3,
    "timeEstimate": 1,
    "title": ""
};

function generate_key(index, title, url) {
    return (index.toString()+title+url).split(" ").join("").toLowerCase();
}

function buttonClicked(button) {
    button.innerHTML = "Added!";
    button.style.backgroundColor = "rgb(95, 183, 96)";
    button.disabled = true;
}

// get all current buttons available to student
var buttons = document.getElementsByClassName("btn btn-primary btn-nav btn-nav-submit");
// gets corresponding assignment/exam name by index
var titles = document.getElementsByClassName("course-title");

var button_list = [];

class Button {
    constructor(title, date, time, am_pm, url, index) {
        this.title = title;
        this.date = date;
        this.time = time;
        this.am_pm = am_pm;
        this.url = url;
        this.index = index;

        // physical button object data
        this.button = document.createElement("button");
        this.button.className = "late_add_button"; // class name for CSS
        this.button.innerHTML = "LATE"; // default button text

        // click event
        this.button.onclick = function() {
            buttonClicked(this);
            // create a unique key for the button based on name, url and index
            var key = generate_key(index, title, url);
            chrome.storage.sync.set({[key] : true}, function() { // generated key hold boolean on whether course was added or not
                console.log("Chrome Storage Key Generated:", key);
                // config json and send via http request
                
                let tc = Object.assign({}, send_template); // shallow copy of template
                tc.assessmentType = "Assignment";
                tc.description = "Test";
                tc.title = "test title";

                $.ajax({
                    type: "POST",
                    url: "https://www.late.work/api/assignments",
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    xhrFields: {withCredentials: true},
                    data: JSON.stringify(tc),
                    success: function(data) {},
                    error: function(err) {}
                });
            });
        };
    }
};

// add buttons that appear on submitty page
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

    button_list.push(new Button(title, date, time, am_pm, url, i));
    // appends HTML button as child to Submitty's submit button's div
    buttons[i].parentElement.appendChild(button_list[i].button);
}

// retrieve data from chrome (asychronous)
chrome.storage.sync.get(null, function(result) { 
    console.log(result); 
    for(var i = 0; i < button_list.length; i++) {
        var b = button_list[i];
        var key = generate_key(b.index, b.title, b.url);

        // if previous button state is clicked (true), update button data
        if(result[key] == true) {
            buttonClicked(b.button);
        }
    }
});