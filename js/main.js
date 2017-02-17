let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = []; // for all data after fetching
let peopleContainer = [];
let slideshow;
let currentItem = 0; // for current index
let imgurl;
let content;

// for tab
let tab;
let touchArea;
let myRegion;
let isFirst = true;

var mygesture = new ZingTouch.Swipe({
    numInputs: 1,
    maxRestTime: 100,
    escapeVelocity: 0.1
});

class Person {
    constructor(first, last, avata) {
        this.first = first;
        this.last = last;
        this.avata = avata;
    }
}

class HtmlManager {
    constructor() {
        this.pages = document.querySelectorAll(".content");
        this.tabs = document.querySelectorAll(".tab-item");
        this.Ids = ["home", "profiles"];
        this.slideshow = document.getElementById('output');
        console.debug(this.pages);
    }
    getAllPages() {
        return pages;
    }
    getActivePage() {
        return document.querySelector(".content active");
    }
    getVisiblePageID() {
        document.querySelector(".content active");
    }
    toggleVisible(val) {
        let value = "content " + val;
        [].forEach.call(this.pages, function (page) {
            page.style.visibility = page.classList == value ? "visible" : "hidden";
        })
    }
    toggleTab() {
        [].forEach.call(this.tabs, function (tab) {
            tab.classList.toggle("active");
        })
    }
    createTag(){
        let img = document.createElement("img");
        let p = document.createElement("p");
        let name = "".concat(profiles[0].first, " ", profiles[0].last);
        let distance = document.createElement("p");
        distance.textContent = "Distance: " + profiles[0].distance;
        img.src = imgurl + profiles[0].avatar;
        p.appendChild(img);  

        slideshow.textContent = name; //items[currentItem];
        //item.classList.add("slideshow-item");
        slideshow.appendChild(p)
        slideshow.appendChild(distance);
        content.appendChild(slideshow);      
    }
}

var PageMgr = new HtmlManager();
class ZingManager {
    constructor() {

    };
    Init(content, output) {
        this.content = document.querySelector(content);
        this.output = document.getElementById(output);
        this.region = new ZingTouch.Region(this.content);
    };
    bind(target){
        region.bind(target,mygesture,next);
    }
    unbind(target){
        region.unbind(target,mygesture);
    }
}
/*/****************************************************************
// Ignore it not use it
*****************************************************************/
class EventObj {
    constructor(item) {
        this.id = document.querySelector(item);
    }
    getID() {
        return this.id;
    }
    eventHandler(e) {

    }
}

var zingobj = new ZingManager();
//var eventobj = new EventObj();

// To find profile in profiles
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
/****************************************************************
// Initialize
*****************************************************************/
document.addEventListener("DOMContentLoaded", function (ev) {

    // Getting a display area;
    slideshow = document.getElementById(".content.home");
    
    // Getting a handle for a main page
    var contentregion = document.querySelector(".content.home");
    
    // It contains output(Display area)
    content = document.querySelector(".content.home .content-padded");
    
    // Initialize Zing
    //myRegion = new ZingTouch.Region(contentregion);

    // Getting handle of tab and attaching EventListener
//    tab = document.querySelectorAll(".tab-item");
//    [].forEach.call(tab, function (btn) {
//        btn.addEventListener('click', activePage)
//    });


    zingobj.Init(".content.home","output");
    
    // Let's start;
    getProfiles();
});

/*****************************************************************
// Ignore it(Delete). It's for one page
******************************************************************/
function activePage(ev) {
    ev.preventDefault();
    let tg = ev.currentTarget;
    let id = ev.currentTarget.href.split("#")[1];

    if (tg.classList.contains("active")) {
        console.log("Sanme page");
        return;
    }

    PageMgr.toggleTab();
    PageMgr.toggleVisible(id);
}


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
            console.log(profiles);

            if (isFirst) {
                createHtmlforProfile();
                //slideshow.addEventListener('pageshow',mainpage);
                isFirst = false;
            }
        })
        .catch(function (err) {
            console.log("dkdkdd");
            profiles = JSON.parse(localStorage.getItem("oh000024"));
        });
}
/****************************************************************
// Display function
// Bind tag and Zingtouch
****************************************************************/
function createHtmlforProfile(){
    
    let item = document.createElement('div');
    item.classList.add("output-item");
    
    let img = document.createElement("img");
    let p = document.createElement("p");
    let name = "".concat(profiles[0].first, " ", profiles[0].last);
    let distance = document.createElement("p");
    distance.textContent = "Distance: " + profiles[0].distance;
    img.src = imgurl + profiles[0].avatar;
    p.appendChild(img);  
    
    item.textContent = name; //items[currentItem];
    //item.classList.add("slideshow-item");
    item.appendChild(p)
    item.appendChild(distance);
    //content.appendChild(slideshow);
    
    item.classList.remove("fadeout");
    item.classList.add("fadein");
    slideshow.appendChild(item);
    
    //myRegion.bind(content, 'pan', next);    
    myRegion.bind(img, mygesture, next); 
}
/*****************************************************************
// Ignore it, I want to use promise but 
******************************************************************/
var pp = function(e){
    return new Promise(function(resolve,reject){
        
        let action;;
        console.log(ev.detail.data[0].currentDirection);
        let direction = ev.detail.data[0].currentDirection;

        let translatevaleu;
        if (100 < direction && direction < 260) {
            //translatevaleu = "translate3d(-150%,0,0)";
            action = "delete";
        } else if (85 >= direction || 280 <= direction) {
            ///translatevaleu = "translate3d(150%,0,0)";
            action = "sage";
        } else {

            reject();
        }        
        console.log("Test");
       
        let old = document.querySelector('.output-item');
        if (old) {
            //old.style.transform = translatevaleu;
            myRegion.unbind(old, mygesture);
            old.classList.remove('fadein');
    //        old.classList.remove('fadein');
            old.classList.add('fadeout');
            if (1 == left) {
                deleteItem(old.firstChild.textContent);
            } else if (0 == left) {
                saveItem(old.firstChild.textContent);
            }

            //fadeOut(old);
            //old.classList.add('fadeout');
            console.log(old.style.textTransform);
    //        setTimeout(function () {
    //
    //            old.parentElement.removeChild(old);
    //        }, 200);
            //old.innerHTML="";
            old.parentElement.removeChild(old);
    //        old.removeChild(old);
        }
    
        resolve(action);

    }) 
}

function eventHandler(ev){
  pp(ev).then(function(text){
    console.debug(ev);
    console.log("fadeout and Fadein");
    console.log("Is Left or Right");
})
.then(function(text){
    console.log("Flash Delete or Save");
})  
}


/******************************************************************
// Event Function
// it will be invoked, When swiping happened
*****************************************************************/

function next(ev) {
    
    let left = -1;
    console.log(ev.detail.data[0].currentDirection);
    let direction = ev.detail.data[0].currentDirection;

    let translatevaleu;
    if (130 < direction && direction < 240) {
        //translatevaleu = "translate3d(-150%,0,0)";
        left = 1;
    } else if (45 >= direction || 330 <= direction) {
        //translatevaleu = "translate3d(150%,0,0)";
        left = 0;
    } else {

        return;
    }

    let old = document.querySelector('.output-item');
    if (old) {
        //old.style.transform = translatevaleu;
        myRegion.unbind(old, mygesture);
        old.classList.remove('fadein');
//        old.classList.remove('fadein');
      
        old.classList.add('fadeout');
        
        setTimeout(function(){},1000);
        if (1 == left) {
            {
                let p = document.createElement("p");
                p.textContent="Delete";
                p.classList.add("fadein");
                old.appendChild(p);
                
            }
            deleteItem(old.firstChild.textContent);
        } else if (0 == left) {
            saveItem(old.firstChild.textContent);
        }

        //fadeOut(old);
        //old.classList.add('fadeout');
        console.log(old.style.textTransform);
//        setTimeout(function () {
//
//            old.parentElement.removeChild(old);
//        }, 200);
        //old.innerHTML="";
        old.parentElement.removeChild(old);
//        old.removeChild(old);
    }

    if (profiles.length <= 3) {
        getProfiles();
        console.log("end of file");
        //return;
    }
    createHtmlforProfile();
}

/******************************************************************
// Delete profile in profiles
*****************************************************************/

function deleteItem(name) {
    let ret = getIndex(name);

    if (null != ret) {
        console.log("find name: " + "".concat(ret.person.first, " ", ret.person.last));
        profiles.shift();
        //        profiles.splice(ret.index, 1);
        console.log(profiles);
    } else {
        console.log("not found");
    }

}
/******************************************************************
// Delete profile in profiles
*****************************************************************/
function saveItem(name) {
    let ret = getIndex(name);

    if (null != ret) {
        console.log("find name: " + "".concat(ret.person.first, " ", ret.person.last));
        profiles.shift();
        //        profiles.splice(ret.index, 1);
        peopleContainer.push(ret.person);
        localStorage.setItem("oh000024", JSON.stringify(peopleContainer));
    } else {
        console.log("not found");
    }
}