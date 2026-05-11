const intro = document.getElementById('intro-screen');
const bio = document.getElementById('bio-screen');
const hud = document.getElementById('hud');

const continueBtn = document.getElementById('continueBtn');
const scanBtn = document.getElementById('scanBtn');

continueBtn.addEventListener('click',()=>{

    playClick();

    intro.classList.add('hidden');
    bio.classList.remove('hidden');

    startCamera();

});

scanBtn.addEventListener('click',()=>{

    playClick();

    bio.classList.add('hidden');
    hud.classList.remove('hidden');

    loadMission(0);

});

function playClick(){

    document.getElementById('clickSound').play();

}

async function startCamera(){

    const video = document.getElementById('webcam');

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            video:true
        });

        video.srcObject = stream;

    }catch(err){

        console.log('Camera unavailable');

    }

}

function loadMission(id){

    document.getElementById('missionBrief').innerHTML =
    Missions[id].briefing;

}

function startMission(id){

    const feed = document.getElementById('liveFeed');

    feed.innerHTML = '';

    Missions[id].updates.forEach((u,i)=>{

        setTimeout(()=>{

            const div = document.createElement('div');

            div.className = 'feed-item';

            div.innerText = u;

            feed.prepend(div);

            updateProbability();

        }, i*3000);

    });

}

function updateProbability(){

    const prob = document.getElementById('probability');

    let num = parseInt(prob.innerText);

    num += Math.floor(Math.random()*6)-2;

    num = Math.max(10,Math.min(99,num));

    prob.innerText = num + '%';

}

function talkTo(person){

    const box = document.getElementById('eryxDialogue');

    const list = Characters[person].advice;

    box.innerText =
    Characters[person].name + ': ' +
    list[Math.floor(Math.random()*list.length)];

}

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const letters = '01SYNAPSECYMOR';
const size = 16;
const cols = canvas.width / size;
const drops = Array(Math.floor(cols)).fill(1);

function drawMatrix(){

    ctx.fillStyle = 'rgba(0,0,0,.06)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = '#ff003c';
    ctx.font = size + 'px monospace';

    for(let i=0;i<drops.length;i++){

        const txt = letters[Math.floor(Math.random()*letters.length)];

        ctx.fillText(txt,i*size,drops[i]*size);

        if(drops[i]*size > canvas.height && Math.random() > .97){
            drops[i] = 0;
        }

        drops[i]++;

    }

}

setInterval(drawMatrix,40);
