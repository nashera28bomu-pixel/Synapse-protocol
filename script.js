const intro =
document.getElementById("intro-screen");

const scanner =
document.getElementById("scanner-screen");

const game =
document.getElementById("game-screen");

const ambient =
document.getElementById("ambient");

let trust = 100;
let probability = 89;
let currentMission = Missions[0];

/* INTRO */

intro.addEventListener("click",()=>{

play("click");

intro.classList.add("hidden");

scanner.classList.remove("hidden");

startCamera();

});

/* CAMERA */

async function startCamera(){

try{

const stream =
await navigator.mediaDevices.getUserMedia({
video:true
});

document.getElementById("camera").srcObject =
stream;

}catch(err){

console.log(err);

}

}

/* START GAME */

document.getElementById("scan-btn")
.addEventListener("click",()=>{

play("click");

scanner.classList.add("hidden");

game.classList.remove("hidden");

ambient.volume = 0.4;
ambient.play();

startMission();

});

/* START MISSION */

function startMission(){

document.getElementById("mission-briefing")
.innerHTML =
currentMission.briefing;

let i = 0;

const interval = setInterval(()=>{

if(i >= currentMission.updates.length){

clearInterval(interval);

showActions();

return;

}

addFeed(currentMission.updates[i]);

probability += Math.random()*2;

updateHUD();

i++;

},5000);

}

/* FEED */

function addFeed(update){

play("alert");

const div =
document.createElement("div");

div.className = "feed-item";

div.innerHTML = `
<h3>LIVE UPDATE</h3>
<p>${update.text}</p>
`;

document.getElementById("live-feed")
.prepend(div);

}

/* ACTIONS */

function showActions(){

const actions =
document.getElementById("actions");

actions.innerHTML = "";

currentMission.actions.forEach((a,index)=>{

const btn =
document.createElement("button");

btn.className = "action-btn";

btn.innerText = a;

btn.onclick = ()=>choose(index+1);

actions.appendChild(btn);

});

}

/* CHOOSE */

function choose(choice){

play("click");

if(choice === currentMission.correct){

probability -= 18;

addFeed({
text:"Correct tactical action executed."
});

}else{

probability += 15;

trust -= 20;

addFeed({
text:"ERYX detected catastrophic miscalculation."
});

}

updateHUD();

}

/* CHARACTER TALK */

function talkTo(name){

play("click");

const char =
Characters[name];

const line =
char.lines[
Math.floor(Math.random()*char.lines.length)
];

document.getElementById("eryx-status")
.innerText =
`${char.name}: ${line}`;

}

/* UPDATE HUD */

function updateHUD(){

document.getElementById("trust-level")
.innerText = trust;

document.getElementById("threat-level")
.innerText =
Math.floor(probability) + "%";

document.getElementById("probability")
.innerText =
Math.floor(probability) + "%";

document.getElementById("focus")
.innerText =
Math.max(10,trust);

document.getElementById("logic")
.innerText =
Math.max(40,120-probability);

}

/* SOUND */

function play(id){

document.getElementById(id).play();

}

/* MATRIX */

const canvas =
document.getElementById("matrix");

const ctx =
canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const letters =
"01SYNAPSEERYX";

const font = 16;

const cols =
canvas.width/font;

const drops =
Array(Math.floor(cols)).fill(1);

function matrix(){

ctx.fillStyle =
"rgba(0,0,0,.05)";

ctx.fillRect(
0,0,
canvas.width,
canvas.height
);

ctx.fillStyle = "#ff004c";

ctx.font = font + "px monospace";

for(let i=0;i<drops.length;i++){

const txt =
letters[Math.floor(
Math.random()*letters.length
)];

ctx.fillText(
txt,
i*font,
drops[i]*font
);

if(
drops[i]*font >
canvas.height &&
Math.random() > .975
){

drops[i] = 0;

}

drops[i]++;

}

}

setInterval(matrix,40);

window.addEventListener("resize",()=>{

canvas.width = innerWidth;
canvas.height = innerHeight;

});
