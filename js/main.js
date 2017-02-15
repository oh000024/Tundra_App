let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = []; // for all data after fetching
let peopleContainer = [];
let slideshow;
let currentItem = 0; // for current index
let imgurl;


// for tab
let tab;
let touchArea;
let myRegion;
let isFirst = true;


class Person {
    constructor(first, last, avata) {
        this.first = first;
        this.last = last;
        this.avata = avata;
        this.Ids=["home","profiles"];
    }
}
class ContentPage{
    constructor(){
        this.pages=document.querySelectorAll(".content");
        this.tabs=document.querySelectorAll(".tab-item");
        console.debug(this.pages);
    }
    getAllPages(){
        return pages;
    }
    getActivePage(){
        return document.querySelector(".content active");
    }
    getVisiblePageID(){
        document.querySelector(".content active");
    }
    toggleVisible(val){
        let value = "content "+val;
        [].forEach.call(this.pages,function(page){
            page.style.visibility = page.classList==value?"visible":"hidden";     
        }) 
    }
    toggleTab(){
        [].forEach.call(this.tabs,function(tab){
            tab.classList.toggle("active");
        })      
    }
}
var PageMgr = new ContentPage();
class ZingManager{
    constructor(){

    };
    Init(content,output){
        this.content = document.querySelector(content);
        this.output = document.getElementById(output);
        this.region = new ZingTouch.Region(this.content);      
    };
    bind(){
        this.region.bind();
    }
    
}
class EventObj{
    constructor(item){
        this.id = document.querySelector(item);
    }
    getID(){return this.id;}
    eventHandler(e){
        
    }
}
var zingobj = new ZingManager();
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
document.addEventListener("DOMContentLoaded", function (ev) {

    slideshow = document.getElementById('output');
    var contentregion = document.querySelector(".content");
    myRegion = new ZingTouch.Region(contentregion);

    tab = document.querySelectorAll(".tab-item");
    [].forEach.call(tab, function(btn){
        btn.addEventListener('click',activePage)
        
    });
    

    //zingobj.Init(".content","output");
    //slideshow.addEventListener('pageshow',mainpage);
    getProfiles();
});

function mainpage(){
    showfirstone();
    console.log("main page");
}

function activePage(ev){
    ev.preventDefault();
    let tg = ev.currentTarget;
    let id = ev.currentTarget.href.split("#")[1];
    
    if(tg.classList.contains("active")){
        console.log("Sanme page");
        return;
    }
    
//    tg.classList.add("active");
    PageMgr.toggleTab();
    PageMgr.toggleVisible(id);
}


function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            imgurl = decodeURIComponent(data.imgBaseURL);

            profiles = profiles.concat(data.profiles);
            console.log(profiles);
    
        if(isFirst){
            showfirstone();
            //slideshow.addEventListener('pageshow',mainpage);
            isFirst = false;  
        }
        })
        .catch(function (err) {
            //alert(err.message);
        console.log("dkdkdd");
        profiles = JSON.parse(localStorage.getItem("oh000024"));
        });
}

function showfirstone() {

    let item = document.createElement('div');

    let img = document.createElement("img");
    let p = document.createElement("p");
    let name = "".concat(profiles[0].first, " ", profiles[0].last);
    img.src = imgurl + profiles[0].avatar;
    p.appendChild(img);

    item.textContent = name; //items[currentItem];
    item.classList.add("slideshow-item");
    item.appendChild(p)
    slideshow.appendChild(item);

    item.classList.add('active');
    myRegion.bind(item, mygesture, next);
    slideshow.addEventListener('pageshow',mainpage);

}

var mygesture = new ZingTouch.Swipe({
    numInputs: 1,
    maxRestTime: 100,
    escapeVelocity: 0.1
});

function next(ev) {

    let left = -1;
    console.log(ev.detail.data[0].currentDirection);
    let direction = ev.detail.data[0].currentDirection;

    let translatevaleu;
    if (130 < direction && direction < 240) {
        translatevaleu = "translate3d(-150%,0,0)";
        left = 1;
    } else if (45 >= direction || 330 <= direction) {
        translatevaleu = "translate3d(150%,0,0)";
        left = 0;
    } else {

        return;
    }

    let old = document.querySelector('.slideshow-item');
    if (old) {
        old.style.transform = translatevaleu;
        myRegion.unbind(old, mygesture);
        old.classList.remove('active');
        old.classList.remove('fadein');
        old.classList.add('fadeout');
        if (1 == left) {
            deleteItem(old.firstChild.textContent);
        } else if (0 == left) {
            saveItem(old.firstChild.textContent);
        }

        //fadeOut(old);
        //old.classList.add('fadeout');
        console.log(old.style.textTransform);
        setTimeout(function () {

            old.parentElement.removeChild(old);
        }, 200);
    }

    if (profiles.length <= 3) {
        getProfiles();
        console.log("end of file");
        //return;
    }
    //add the new one
    let item = document.createElement('div');

    let img = document.createElement("img");
    let p = document.createElement("p");
    let pdistance = document.createElement("p");
    let name = "".concat(profiles[0].first, " ", profiles[0].last);
    img.src = imgurl + profiles[0].avatar;
    pdistance.textContent = "Distance: " + profiles[0].distance;
    p.appendChild(img);
    //p.appendChild(pdistance);

    item.textContent = name; //items[currentItem];
    item.classList.add("slideshow-item");
    item.appendChild(p)
    p.appendChild(pdistance);
    slideshow.appendChild(item);
    item.classList.add('active');
    myRegion.bind(item, mygesture, next);

}


function fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

// fade in

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

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