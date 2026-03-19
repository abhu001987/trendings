const params = new URLSearchParams(window.location.search)
const category = params.get("cat")

let allPosts = []
let visiblePosts = 0
const loadCount = 10

function goBack(){
window.location.href="/"
}

/* 🚀 FORCE FRESH LOAD (NO CACHE) */

const file = category ? `${category}.json` : "posts.json"
const url = file + "?v=" + new Date().getTime()

fetch(url)
.then(res => res.json())
.then(data => {

allPosts = data
loadMore()

})
.catch(() => {
document.getElementById("posts").innerHTML =
"<h2 style='padding:40px;text-align:center'>No posts found</h2>"
})

function loadMore(){

const container = document.getElementById("posts")

let nextPosts = allPosts.slice(visiblePosts, visiblePosts + loadCount)

nextPosts.forEach(post => {

/* HERO IMAGE POST */

if(post.heroImage){

const hero = document.createElement("div")
hero.className = "hero-post"

hero.innerHTML = `

<img src="${post.heroImage}" class="hero-img">

<div class="hero-overlay">
<a href="${post.ctaLink}" class="hero-btn">${post.ctaText}</a>
</div>

${post.music ? `<audio class="hero-music" src="${post.music}" loop></audio>` : ""}

`

container.appendChild(hero)
return
}

/* NORMAL POST */

const card = document.createElement("div")
card.className = "post"

card.innerHTML = `

<div class="image-frame">

<img src="${post.image}">

<div class="back-btn" onclick="goBack()">←</div>

</div>

<div class="post-meta">
<span class="category-badge">${post.category}</span>
<span class="post-date">${post.time}</span>
</div>

<div class="content">
<h2>${post.title}</h2>
<p>${post.content}</p>
</div>

`

container.appendChild(card)

})

visiblePosts += loadCount

}

/* SCROLL LOAD */

document.getElementById("posts").addEventListener("scroll",function(){

const container = this

if(container.scrollTop + container.clientHeight >= container.scrollHeight - 5){
loadMore()
}

})

/* HERO AUDIO */

const heroObserver = new IntersectionObserver(entries => {

entries.forEach(entry => {

const audio = entry.target.querySelector(".hero-music")

if(!audio) return

if(entry.isIntersecting){
audio.play().catch(()=>{})
}else{
audio.pause()
audio.currentTime = 0
}

})

},{threshold:0.6})

function observeHeroPosts(){
document.querySelectorAll(".hero-post").forEach(post=>{
heroObserver.observe(post)
})
}

// ===== DICTIONARY FEATURE (GLOBAL) =====

function closeDict(){
  document.getElementById("dictPopup").style.display="none";
}

// IMPORTANT: use event delegation (works with dynamic posts)
document.addEventListener("mouseup", handleSelection);
document.addEventListener("touchend", handleSelection);

function handleSelection(){
  let word = window.getSelection().toString().trim();

  if(word.length < 2 || word.length > 20 || word.includes(" ")) return;

  fetchMeaning(word);
}

function fetchMeaning(word){
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json())
    .then(data => {

      let meaning = "No meaning found";

      if(Array.isArray(data)){
        meaning = data[0]?.meanings[0]?.definitions[0]?.definition || meaning;
      }

      showPopup(word, meaning);

    })
    .catch(() => {
      showPopup(word, "Error fetching meaning");
    });
}

function showPopup(word, meaning){
  document.getElementById("dictWord").innerText = word;
  document.getElementById("dictMeaning").innerText = meaning;
  document.getElementById("dictPopup").style.display = "block";
}
