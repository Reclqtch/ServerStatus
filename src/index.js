const serverutil = require('minecraft-server-util');

const UNKOWN_SERVER = 'unknown_server.png';
const ipIpt = document.getElementById('ip');
const checkBtn = document.getElementById('check');
const icon = document.getElementById('icon');
const players = document.getElementById('players');
const motd = document.getElementById('motd');

checkBtn.onclick = updateStatus;
ipIpt.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkBtn.click();
    }
});

async function updateStatus() {
    icon.src = UNKOWN_SERVER;
    players.innerHTML = '<br>';
    players.title = null;
    motd.innerHTML = '<span style="color: #AAAAAA">Pinging...</span>';
    checkBtn.className = 'is-loading';
    try {
        const address = serverutil.parseAddress(ipIpt.value);
        const responce = await serverutil.status(address.host, address.port, { timeout: 5000 });
        if (responce.favicon != null) icon.src = responce.favicon;
        players.innerHTML = `${responce.version.name} <span style="color: #555555">|</span> ${responce.players.online}<span style="color: #555555">/</span>${responce.players.max} <span style="color: #555555">|</span> ${responce.roundTripLatency}ms`;
        if (responce.players.sample != null) players.title = responce.players.sample.map(obj => obj.name).join('\n');
        motd.innerHTML = responce.motd.html;
    } catch (err) {
        motd.innerHTML = '<span style="color: #aa0000">Can\'t connect to server.</span>';
    }
    checkBtn.className = '';
}

updateStatus();
