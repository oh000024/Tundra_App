// Feb 15 2017 Jake Oh

let tbahome;
let lists = [];
let listcontent;
document.addEventListener("DOMContentLoaded", function () {

    tabhome = document.querySelector('[tab-role="home"]');
    tabhome.addEventListener('push', function () {
        console.log("This is Push Test");
    });

    lists = JSON.parse(localStorage.getItem("oh000024"));
    console.log(lists);
    listcontent = document.querySelector(".content");
    
    createLists();
})

function createLists() {
    let ul = document.createElement("ul");
    ul.classList.add("table-vbiew");
    ul.style.listStyle="none";

    [].forEach.call(lists, function (list) {
        let li = document.createElement("li");
        li.classList.add("table-view-cell","media");
        
        let span = document.createElement("span");
        span.classList.add("media-object","pull-left", "icon", "icon-trash");
        
        let img = document.createElement("img");
        img.classList.add("media-object", "pull-left");
        img.style.src= + list.avatar;
        
        let div = document.createElement("div");
        div.classList.add("media-body");
        div.textContent="".concat(list.first, " ", list.last);;
        
        li.appendChild(span);
        li.appendChild(div);
        ul.appendChild(li);
        span.addEventListener('click',deleteItem);
    })
    listcontent.appendChild(ul);

    //let a  = document.createElement("a");

}

function deleteItem(e)
{
    let li = e.currentTarget.parentNode;
    let ul = e.currentTarget.parentNode.parentNode;
    //e.currentTarget.parentElement.removeChild(e);
    //e.parentNode.parentNode.removeChild(link.parentNode);
    ul.removeChild(li);
}

//<img class="media-object pull-left" src="images/img1.jpeg">