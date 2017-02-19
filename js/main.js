/*****************************************************************
File: profiels.js
Author: Jake Oh
Description:
Here is the sequence of logic for the app
- Initialize Zingtouch and set a push event in DOMContentLoaded
- Fetch Profiels from edumedia
- Preparation for First Profiles at createHtmlforProfile
- And binding Zingtouch object with Dom Element
- Process Swiping, When Swiping Event fired
- Swipe to Left side--> Delete profile from interface and global array of profiles
- Swipe to Rift: Delete the profiles from interface and global array of profiles and save to localStorage
- In second page, show all saved profiels from localStorage
- Click icon: Delte saved profile from UL and removed from global array and localStorage

Version: 0.0.1
Updated: Feb 16, 2017
*****************************************************************/


const LEFT = "LEFT";
const RIGHT = "RIGHT";
const MALE = "male";

let gender = ""; //female or male or blank for both
var url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;

let profiles = []; // for all data after fetching
let peopleContainer = [];

var imgurl;
//let content;
let RegionOne;
let regionTwo;
let isFirst = true;


document.addEventListener("DOMContentLoaded", function (ev) {

    RegionOne = ZingTouch.Region(document.querySelector(".content"));

    getProfiles();
    window.addEventListener("push", function (ev) {

        let contentDiv = ev.currentTarget.document.querySelector(".content");
        let id = contentDiv.id;

        switch (id) {
        case "home":
            createHtmlforProfile();
            break;
        case "two":
            createLists();
            break;
        default:
            createHtmlforProfile();
        }
    });
});

/*/****************************************************************
// Fetch Data from server 
// Display first profile
// Used a flag for just only display fist profile
/*****************************************************************/
function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            imgurl = decodeURIComponent(data.imgBaseURL);
            profiles = profiles.concat(data.profiles);
            console.log("Fetch profiles: " + profiles.length);

            if (isFirst) {
                createHtmlforProfile();
                isFirst = false;
            }
            // }
        })
        .catch(function (err) {
            console.log(err);
        });
}

/****************************************************************
// Display function
// Bind tag and Zingtouch
****************************************************************/
function createHtmlforProfile() {

    RegionOne = ZingTouch.Region(document.querySelector(".content"));
    let output = document.getElementById("output");
    let contentregion = document.querySelector(".content");  
    
    let outputitemdiv = document.createElement('div');
    outputitemdiv.classList.add("output-item");

    let img = document.createElement("img");
    let p = document.createElement("p");
    let name = "".concat(profiles[0].first, " ", profiles[0].last);
    let distance = document.createElement("p");
    distance.style.fontSize = "2rem";
    let action = document.createElement("p");
    distance.textContent = "Distance: " + profiles[0].distance;
    img.src = imgurl + profiles[0].avatar;
    p.appendChild(img);
    p.appendChild(distance);

    outputitemdiv.textContent = name;
    let color = "red";
    if (MALE === profiles[0].gender) {
        color = "blue";
    }

    outputitemdiv.style.color = color;
    outputitemdiv.style.fontSize = "3rem";
    outputitemdiv.appendChild(p)
        //outputitemdiv.appendChild(distance);
    output.appendChild(outputitemdiv);
    RegionOne.bind(outputitemdiv, 'pan', eventHandler);
}


/******************************************************************
// Event Function
// it will be invoked, When swiping happened
*****************************************************************/

function next(ev) {

    let left = -1;
    console.log(ev.detail.data[0].currentDirection);
    let direction = ev.detail.data[0].currentDirection;

    if (130 < direction && direction < 240) {
        left = 1;
    } else if (45 >= direction || 330 <= direction) {
        left = 0;
    } else {

        return;
    }

    let old = document.querySelector('.output-item');
    if (old) {

        RegionOne.unbind(old, 'pan');
        //old.classList.remove('fadein');
        old.classList.add('fadeout');
        let p = document.createElement("p");

        if (1 == left) {
            p.textContent = "Delete";
            deleteItem(old.firstChild.textContent);
        } else if (0 == left) {
            p.textContent = "Saved";
            saveItem(old.firstChild.textContent);
        }
        old.appendChild(p);
        //p.classList.add("fadein");
        setTimeout(function () {
            //p.classList.toggle("fadein");
            p.classList.add("fadeout");

        }, 500);

        setTimeout(function () {
            if (profiles.length <= 3) {
                old.parentElement.removeChild(old);
                getProfiles();
                console.log("end of file");
                //return;
            } else {
                old.parentElement.removeChild(old);
                createHtmlforProfile();
                console.log("LocalStorage" + peopleContainer);
            }
        }, 200);
    }
}

function eventHandler(ev) {

    //let p = new Promise(function (resolve, reject) {
    let left = -1;
    console.log(ev.detail.data[0].currentDirection);
    let direction = ev.detail.data[0].currentDirection;
    

    let old = document.querySelector('.output-item');
    let pa =old.parentElement;
    if(pa===null){
        console.log("It's NULL");
        console.debug(pa);
        console.trace(pa);
    }    
    if (old) {
        RegionOne.unbind(old, 'pan');
        let name = old.firstChild.data;

        let h = document.createElement("h1");
        let color;
        let text;
        let action;

        (90 < direction && direction < 270) ?
        function () {
            console.log(LEFT);
            text = "Profile Delete";
            color = "red";
            action = LEFT;
        }() : function () {
            console.log(RIGHT);
            text = "Profile Saved";
            color = "green";
            action = RIGHT;
        }();
        old.classList.add('fadeout');
        setTimeout(function () {
            old.innerHTML = "";
            h.textContent = text;
            h.style.color = color;
            old.appendChild(h);
            old.classList.remove('fadeout');
            old.classList.add("fadein");

            //output.innerHTML="";

        }, 300);
        setTimeout(function () {
            if(pa===null){
                console.log("It's NULL");
                console.debug(pa);
                console.trace(pa);
            }
            pa.removeChild(old);
            processProfile(name, action);
            if (profiles.length <= 3) {
                getProfiles();
            }
            createHtmlforProfile();
        }, 800)
    }
    // });

}
//

function getIndex(value) {

    for (let i = 0; i < profiles.length; i++) {
        let name = "".concat(profiles[i].first, " ", profiles[i].last);
        if (name == value) {
            return {
                person: profiles[i],
                index: i
            };
        }
    }
    return null;
}

/******************************************************************
// Delete profile in profiles
*****************************************************************/

function processProfile(name, action) {
    let ret = getIndex(name);

    if (null != ret && action === LEFT) {
        //console.log("find name: " + "".concat(ret.person.first, " ", ret.person.last));

        profiles.shift();
        console.log(profiles);
    } else if (null != ret && action === RIGHT) {
        profiles.shift();
        peopleContainer.push(ret.person);
        localStorage.setItem("oh000024", JSON.stringify(peopleContainer));
    } else {
        console.log("Not Found Name!!!!");
    }
}


function createLists() {
    
    regionTwo = ZingTouch.Region(document.querySelector(".content"));
    
    let ul = document.createElement("ul");
    ul.classList.add("table-vbiew");
    ul.style.listStyle = "none";
    listcontent = document.querySelector(".content");
    //let lists = JSON.parse(localStorage.getItem("oh000024"));
    [].forEach.call(peopleContainer, function (list) {
        let li = document.createElement("li");
        li.classList.add("table-view-cell", "media");

        let span = document.createElement("span");
        span.classList.add("media-object", "pull-left", "icon", "icon-trash");

        //<img class="media-object pull-left" src="http://placehold.it/42x42">
        let img = document.createElement("img");
        img.classList.add("media-object", "pull-left");
        img.src = imgurl + list.avatar;
        img.style.width = "10%";
        img.style.height = "10%";
        // img.src = imgurl + profiles[0].avatar;

        let div = document.createElement("div");
        div.classList.add("media-body");
        div.textContent = "".concat(list.first, " ", list.last);;

        li.appendChild(span);
        li.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);
        //span.addEventListener(span, deleteList);
        regionTwo.bind(span,'tap', deleteList);
    })
    listcontent.appendChild(ul);

}

function deleteList(e) {
    let span = e.currentTarget;
    let li = e.currentTarget.parentNode;
    let ul = e.currentTarget.parentNode.parentNode;

    for (let i = 0; i < peopleContainer.length; i++) {
        let name = "".concat(peopleContainer[i].first, " ", peopleContainer[i].last);
        if (name == li.textContent) {
            regionTwo.unbind(span,'tap');
            peopleContainer.splice(i, 1);
            ul.removeChild(li);
            localStorage.setItem("oh000024", JSON.stringify(peopleContainer));
            break;
        }
    }
}