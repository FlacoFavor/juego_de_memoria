const board=document.getElementById("board")
const movesText=document.getElementById("moves")
const timeText=document.getElementById("time")
const recordText=document.getElementById("record")
const difficulty=document.getElementById("difficulty")
const win=document.getElementById("win")

const icons=["🐶","🐱","🐸","🦊","🐼","🐵","🐷","🐯","🐰","🦁"]

let first=null
let second=null
let lock=false

let moves=0
let time=0
let timer

function startGame(){

board.innerHTML=""
win.style.display="none"

moves=0
time=0

movesText.textContent=0
timeText.textContent=0

clearInterval(timer)

timer=setInterval(()=>{
time++
timeText.textContent=time
},1000)

let pairs=difficulty.value/2

let selected=icons.slice(0,pairs)
let cards=[...selected,...selected]

cards.sort(()=>0.5-Math.random())

cards.forEach(icon=>{

let card=document.createElement("div")
card.className="card"
card.dataset.icon=icon

card.innerHTML=`
<div class="face front"></div>
<div class="face back">${icon}</div>
`

card.addEventListener("click",flipCard)

board.appendChild(card)

})

}

function flipCard(){

if(lock) return
if(this.classList.contains("flip")) return

this.classList.add("flip")

if(!first){
first=this
return
}

second=this

moves++
movesText.textContent=moves

checkMatch()

}

function checkMatch(){

if(first.dataset.icon===second.dataset.icon){

first.removeEventListener("click",flipCard)
second.removeEventListener("click",flipCard)

reset()

checkWin()

}else{

lock=true

setTimeout(()=>{

first.classList.remove("flip")
second.classList.remove("flip")

reset()

},800)

}

}

function reset(){
[first,second]=[null,null]
lock=false
}

function checkWin(){

if(document.querySelectorAll(".flip").length===board.children.length){

clearInterval(timer)

saveRecord()

win.style.display="block"

}

}

function saveRecord(){

let best=localStorage.getItem("memoryRecord")

if(!best || time<best){
localStorage.setItem("memoryRecord",time)
}

recordText.textContent=localStorage.getItem("memoryRecord")

}

recordText.textContent=localStorage.getItem("memoryRecord") || "--"

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js")
.then(()=>console.log("Service Worker registrado"))

}

startGame()