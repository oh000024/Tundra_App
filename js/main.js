let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = []; // for all data after fetching
let peopleContainer = [];
let slideshow;
let currentItem = 0; // for current index
let imgurl;


var touchArea;
var myRegion;

class Person {
    constructor(first, last, avata) {
        this.first = first;
        this.last = last;
        this.avata = avata;
    }
}

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

    getProfiles();
});


function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            imgurl = decodeURIComponent(data.imgBaseURL);

            
            //profiles = data.profiles;
        data.profiles.forEach(function(person){
            profiles.push(person);
        })
            console.log(profiles);
            //            profiles.forEach(function (person) {
            //                let pobj = new Person(person.first, person.last, person.avata);
            //                peopleContainer.push(pobj);
            //
            //            });

            slideshow = document.getElementById('output');
            showfirstone();
            //        let binding;
            //        let events;
            //        let obj;
            //        dispatcher(binding,obj, events);

        })
        .catch(function (err) {
            alert(err.message);
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

    setTimeout(function () {
        item.classList.add('active');
        myRegion.bind(item, mygesture, next);
    }, 20);
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

    setTimeout(function () {
        item.classList.add('active');
        item.classList.add('fadein');

        myRegion.bind(item, mygesture, next);
    }, 20);
//    currentItem++;
//    if (currentItem > profiles.length - 1) {
//        currentItem = 0;
//    }

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
        profiles.splice(ret.index, 1);
        console.log(profiles);
    } else {
        console.log("not found");
    }

}

function saveItem(name) {
    let ret = getIndex(name);

    if (null != ret) {
        console.log("find name: " + "".concat(ret.person.first, " ", ret.person.last));
        profiles.splice(ret.index, 1);
        peopleContainer.push(ret.person);
        localStorage.setItem("oh000024", JSON.stringify(peopleContainer));
    } else {
        console.log("not found");
    }
}