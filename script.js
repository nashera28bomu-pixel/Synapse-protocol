// ui/intro.js logic inside script.js for simplicity
document.addEventListener('DOMContentLoaded', () => {
    const brand = document.getElementById('brand-intro');
    const title = document.getElementById('title-cinematic');
    const bio = document.getElementById('biometric-screen');
    const hud = document.getElementById('game-hud');

    // 1. Brand Intro
    setTimeout(() => {
        brand.classList.add('hidden');
        title.classList.remove('hidden');
        
        // 2. Cinematic Title
        setTimeout(() => {
            title.classList.add('hidden');
            bio.classList.remove('hidden');
            startCamera();
        }, 4000);
    }, 3000);
});

async function startCamera() {
    const video = document.getElementById('webcam-feed');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.log("Camera blocked or unavailable - using simulated feed.");
    }
}

document.getElementById('sync-btn').addEventListener('click', () => {
    // Transition to Game
    document.getElementById('biometric-screen').classList.add('hidden');
    document.getElementById('game-hud').classList.remove('hidden');
    loadMission(0);
});

function loadMission(idx) {
    const m = Missions[idx];
    document.getElementById('mission-briefing').innerHTML = m.briefing + 
    `<button onclick="startEngagement(${idx})" class="cyber-btn" style="width:100%">ACCEPT PROTOCOL</button>`;
}

function startEngagement(idx) {
    document.getElementById('mission-briefing').classList.add('hidden');
    const feed = document.getElementById('feed-container');
    
    Missions[idx].updates.forEach((update, i) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'glass-panel feed-item';
            item.style.marginBottom = '10px';
            item.innerText = update.text;
            item.onclick = () => verify(update.id, Missions[idx].solution);
            feed.appendChild(item);
        }, i * 2000);
    });
}
