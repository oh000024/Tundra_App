let gender = "";    //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = [];

function getProfiles(){
  fetch(url)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      let imgurl = decodeURIComponent(data.imgBaseURL);
      //console.log(data.imgBaseURL);
      //console.log(imgurl);
      profiles = data.profiles;
      profiles.forEach(function(person){
        let img = document.createElement("img");
        let p = document.createElement("p");
        let name = "".concat(person.first, " ", person.last);
        img.src = "http://"+imgurl + person.avatar;
        console.log(img.src);
        p.appendChild(img);
        p.innerHTML += " " + name;
        document.getElementById("output").appendChild(p);
      });
    })
    .catch(function(err){
      alert(err.message);
    });
}

getProfiles();

document.body.addEventListener('click', function(ev){
  getProfiles();
});