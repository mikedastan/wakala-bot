const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const GROUP_ID = "120363407884587277@g.us";

app.get('/ping', (req, res) => res.send('pong'));

app.post('/send-report', async (req, res) => {
  try {
    const { report } = req.body;
    await axios.post(
      'https://wasenderapi.com/api/send-message',
      { to: GROUP_ID, text: report },
      { headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Send error:', err.response?.data || err.message);
    res.json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wakala Sinza</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1A8F5E;--green-light:#E6F7F0;--green-dark:#0F5C3A;
  --red:#C0392B;--bg:#F4F6F4;--surface:#fff;--border:#E2E8E2;
  --text:#1A1F1A;--muted:#6B7A6B;
  --radius:14px;--radius-sm:9px;
  --font:'DM Sans',sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);max-width:430px;margin:0 auto;min-height:100vh}
.screen{display:none;flex-direction:column;min-height:100vh}
.screen.active{display:flex}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:14px 16px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.topbar-title{font-size:16px;font-weight:600}
.topbar-sub{font-size:11px;color:var(--muted)}
.logout{font-size:12px;color:var(--muted);background:none;border:none;cursor:pointer;font-family:var(--font)}
.content{flex:1;padding:16px;overflow-y:auto;padding-bottom:40px}
.login-wrap{flex:1;display:flex;flex-direction:column;justify-content:center;padding:2rem 1.5rem}
.logo{width:52px;height:52px;background:var(--green);border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem}
.logo svg{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round}
.brand{font-size:24px;font-weight:600;letter-spacing:-0.5px}
.brand-sub{font-size:13px;color:var(--muted);margin-top:2px;margin-bottom:1.8rem}
.user-cards{display:grid;gap:10px;margin-bottom:1.5rem}
.user-card{border:1.5px solid var(--border);border-radius:var(--radius);padding:13px 15px;cursor:pointer;background:var(--surface);display:flex;align-items:center;gap:12px}
.user-card.sel{border-color:var(--green);box-shadow:0 0 0 3px rgba(26,143,94,0.1)}
.av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0}
.av-g{background:var(--green-light);color:var(--green-dark)}
.av-b{background:#E8F0FE;color:#1A56CC}
.av-k{background:#1A1F1A;color:#fff}
.uname{font-size:14px;font-weight:600}
.urole{font-size:11px;color:var(--muted)}
.rb{font-size:10px;padding:2px 8px;border-radius:20px;font-weight:500;margin-left:auto}
.rb-w{background:var(--green-light);color:var(--green-dark)}
.rb-b{background:#1A1F1A;color:#fff}
.pin-label{font-size:13px;color:var(--muted);margin-bottom:8px}
.pin-dots{display:flex;gap:10px;margin-bottom:12px}
.pin-dot{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--border);background:transparent}
.pin-dot.on{background:var(--green);border-color:var(--green)}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}
.pin-btn{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;font-size:18px;font-weight:500;cursor:pointer;font-family:var(--font)}
.pin-btn:active{background:var(--green-light)}
.pin-err{font-size:13px;color:var(--red);text-align:center;min-height:20px}
.card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);padding:14px 16px;margin-bottom:12px}
.card-title{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px}
.field{margin-bottom:12px}
.field label{font-size:13px;color:var(--muted);display:block;margin-bottom:4px;font-weight:500}
.field input,.field textarea{width:100%;padding:10px 12px;font-size:15px;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);color:var(--text);font-family:var(--font);outline:none}
.field input:focus,.field textarea:focus{border-color:var(--green)}
.field textarea{resize:none;min-height:60px;font-size:14px}
.btn-green{width:100%;padding:13px;background:var(--green);color:#fff;border:none;border-radius:var(--radius-sm);font-size:15px;font-weight:600;cursor:pointer;font-family:var(--font);margin-top:4px}
.btn-green:disabled{background:#9FE1CB;cursor:not-allowed}
.total-bar{background:var(--green-light);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.total-label{font-size:12px;color:var(--green-dark)}
.total-val{font-size:18px;font-weight:600;color:var(--green-dark)}
.success-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center}
.success-icon{width:64px;height:64px;background:var(--green-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem}
.success-icon svg{width:28px;height:28px;stroke:var(--green);fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.err-toast{background:#FDECEA;color:var(--red);font-size:13px;padding:10px 14px;border-radius:var(--radius-sm);margin-top:10px;display:none;text-align:center}
.err-toast.show{display:block}
</style>
</head>
<body>

<div class="screen active" id="s-login">
  <div class="login-wrap">
    <div class="logo"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
    <div class="brand">Wakala Sinza</div>
    <div class="brand-sub">Mfumo wa ripoti za shift</div>
    <div class="user-cards">
      <div class="user-card" onclick="selUser('alfany')" id="c-alfany">
        <div class="av av-g">AF</div>
        <div><div class="uname">Alfany</div><div class="urole">Mfanyakazi</div></div>
        <span class="rb rb-w">Worker</span>
      </div>
      <div class="user-card" onclick="selUser('alex')" id="c-alex">
        <div class="av av-b">AL</div>
        <div><div class="uname">Alex</div><div class="urole">Mfanyakazi</div></div>
        <span class="rb rb-w">Worker</span>
      </div>
      <div class="user-card" onclick="selUser('michael')" id="c-michael">
        <div class="av av-k">MC</div>
        <div><div class="uname">Michael</div><div class="urole">Boss</div></div>
        <span class="rb rb-b">Boss</span>
      </div>
    </div>
    <div class="pin-label">Ingiza PIN yako</div>
    <div class="pin-dots">
      <div class="pin-dot" id="d0"></div><div class="pin-dot" id="d1"></div>
      <div class="pin-dot" id="d2"></div><div class="pin-dot" id="d3"></div>
    </div>
    <div class="pin-pad">
      <button class="pin-btn" onclick="pp('1')">1</button><button class="pin-btn" onclick="pp('2')">2</button><button class="pin-btn" onclick="pp('3')">3</button>
      <button class="pin-btn" onclick="pp('4')">4</button><button class="pin-btn" onclick="pp('5')">5</button><button class="pin-btn" onclick="pp('6')">6</button>
      <button class="pin-btn" onclick="pp('7')">7</button><button class="pin-btn" onclick="pp('8')">8</button><button class="pin-btn" onclick="pp('9')">9</button>
      <button class="pin-btn" onclick="pp('c')" style="font-size:13px;color:#6B7A6B">CLR</button>
      <button class="pin-btn" onclick="pp('0')">0</button>
      <button class="pin-btn" onclick="pp('d')" style="font-size:13px">&#9003;</button>
    </div>
    <div class="pin-err" id="pin-err"></div>
  </div>
</div>

<div class="screen" id="s-worker">
  <div class="topbar">
    <div><div class="topbar-title" id="w-name">Wakala Sinza</div><div class="topbar-sub" id="w-shift">Shift ya sasa</div></div>
    <button class="logout" onclick="logout()">Toka</button>
  </div>
  <div class="content">
    <div class="card">
      <div class="card-title">Salio za float</div>
      <div class="field"><label>M-Pesa (TZS)</label><input type="number" id="f-mpesa" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Tigo Pesa (TZS)</label><input type="number" id="f-tigo" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Airtel Money (TZS)</label><input type="number" id="f-airtel" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Halotel (TZS)</label><input type="number" id="f-halotel" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Selcom (TZS)</label><input type="number" id="f-selcom" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Tigo Lipa (TZS)</label><input type="number" id="f-tigolipa" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Airtel Lipa (TZS)</label><input type="number" id="f-airtelipa" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Voda Lipa (TZS)</label><input type="number" id="f-vodalipa" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>NMB Bank (TZS)</label><input type="number" id="f-nmb" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>CRDB Bank (TZS)</label><input type="number" id="f-crdb" placeholder="0" oninput="updTotal()"></div>
      <div class="field"><label>Cash (TZS)</label><input type="number" id="f-cash" placeholder="0" oninput="updTotal()"></div>
    </div>

    <div class="total-bar">
      <span class="total-label">Jumla ya float</span>
      <span class="total-val" id="total-float">TZS 0</span>
    </div>

    <div class="card">
      <div class="card-title">Huduma za lipa namba (fees ulizokusanya)</div>
      <div class="field"><label>Voda Lipa fees (TZS)</label><input type="number" id="lipa-voda" placeholder="0"></div>
      <div class="field"><label>Tigo Lipa fees (TZS)</label><input type="number" id="lipa-tigo" placeholder="0"></div>
      <div class="field"><label>Airtel Lipa fees (TZS)</label><input type="number" id="lipa-airtel" placeholder="0"></div>
    </div>

    <div class="card">
      <div class="card-title">Matumizi za shift</div>
      <div class="field"><label>Chakula (TZS)</label><input type="number" id="exp-chakula" placeholder="0"></div>
      <div class="field"><label>Transport (TZS)</label><input type="number" id="exp-transport" placeholder="0"></div>
      <div class="field"><label>Airtime / Data (TZS)</label><input type="number" id="exp-airtime" placeholder="0"></div>
      <div class="field"><label>Mengineyo (TZS)</label><input type="number" id="exp-other" placeholder="0"></div>
      <div class="field"><label>Maelezo (optional)</label><textarea id="exp-note" placeholder="Eleza matumizi mengine..."></textarea></div>
    </div>

    <button class="btn-green" id="submit-btn" onclick="submitReport()">Tuma ripoti kwa Michael</button>
    <div class="err-toast" id="err-toast">Hitilafu! Angalia mtandao wako na jaribu tena.</div>
  </div>
</div>

<div class="screen" id="s-success">
  <div class="success-wrap">
    <div class="success-icon">
      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div style="font-size:20px;font-weight:600;margin-bottom:8px">Ripoti imetumwa!</div>
    <div style="font-size:14px;color:#6B7A6B;margin-bottom:2rem">Michael amepokea ripoti yako kwenye WhatsApp group.</div>
    <button class="btn-green" style="max-width:200px" onclick="logout()">Maliza shift</button>
  </div>
</div>

<script>
const USERS={alfany:{pin:'1234',name:'Alfany'},alex:{pin:'0755',name:'Alex'},michael:{pin:'1234',name:'Michael'}};
let cu=null,pin='';
const fmt=n=>'TZS '+(Math.round(n)||0).toLocaleString();
const g=id=>parseFloat(document.getElementById(id).value)||0;

function selUser(id){
  cu=id;
  document.querySelectorAll('.user-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('c-'+id).classList.add('sel');
  pin=''; updDots(); document.getElementById('pin-err').textContent='';
}

function pp(v){
  if(!cu){document.getElementById('pin-err').textContent='Chagua mtumiaji kwanza.';return;}
  if(v==='c') pin='';
  else if(v==='d') pin=pin.slice(0,-1);
  else if(pin.length<4) pin+=v;
  updDots();
  if(pin.length===4) setTimeout(tryLogin,120);
}

function updDots(){
  for(let i=0;i<4;i++) document.getElementById('d'+i).classList.toggle('on',i<pin.length);
}

function tryLogin(){
  const u=USERS[cu];
  if(pin===u.pin){
    document.getElementById('pin-err').textContent='';
    document.getElementById('w-name').textContent=u.name+' · Wakala Sinza';
    const h=new Date().getHours();
    const t=new Date().toLocaleTimeString('en-TZ',{hour:'2-digit',minute:'2-digit'});
    document.getElementById('w-shift').textContent=(h<12?'Shift ya asubuhi':h<17?'Shift ya mchana':'Shift ya jioni')+' · '+t;
    show('s-worker');
  } else {
    document.getElementById('pin-err').textContent='PIN si sahihi. Jaribu tena.';
    pin=''; updDots();
  }
}

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function logout(){
  pin=''; cu=null;
  document.querySelectorAll('.user-card').forEach(c=>c.classList.remove('sel'));
  updDots();
  document.querySelectorAll('input[type=number]').forEach(i=>i.value='');
  document.getElementById('exp-note').value='';
  document.getElementById('total-float').textContent='TZS 0';
  show('s-login');
}

function updTotal(){
  const t=g('f-mpesa')+g('f-tigo')+g('f-airtel')+g('f-halotel')+g('f-selcom')+
    g('f-tigolipa')+g('f-airtelipa')+g('f-vodalipa')+g('f-nmb')+g('f-crdb')+g('f-cash');
  document.getElementById('total-float').textContent=fmt(t);
}

async function submitReport(){
  const btn=document.getElementById('submit-btn');
  btn.disabled=true; btn.textContent='Inatuma...';
  const name=USERS[cu].name;
  const now=new Date();
  const timeStr=now.toLocaleString('en-TZ',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Africa/Dar_es_Salaam'});
  const h=now.getHours();
  const shift=h<12?'Shift ya asubuhi':h<17?'Shift ya mchana':'Shift ya jioni';
  const floats=[
    {l:'M-Pesa',v:g('f-mpesa')},{l:'Tigo Pesa',v:g('f-tigo')},{l:'Airtel Money',v:g('f-airtel')},
    {l:'Halotel',v:g('f-halotel')},{l:'Selcom',v:g('f-selcom')},{l:'Tigo Lipa',v:g('f-tigolipa')},
    {l:'Airtel Lipa',v:g('f-airtelipa')},{l:'Voda Lipa',v:g('f-vodalipa')},
    {l:'NMB Bank',v:g('f-nmb')},{l:'CRDB Bank',v:g('f-crdb')},{l:'Cash',v:g('f-cash')}
  ];
  const totalFloat=floats.reduce((s,f)=>s+f.v,0);
  const lipaV=g('lipa-voda'),lipaT=g('lipa-tigo'),lipaA=g('lipa-airtel');
  const totalLipa=lipaV+lipaT+lipaA;
  const expC=g('exp-chakula'),expT=g('exp-transport'),expAir=g('exp-airtime'),expO=g('exp-other');
  const totalExp=expC+expT+expAir+expO;
  const note=document.getElementById('exp-note').value;
  const profit=totalLipa-totalExp;

  const report=
    '📊 *RIPOTI YA SHIFT - WAKALA SINZA*\\n'+
    '━━━━━━━━━━━━━━━━━━━━\\n'+
    '👤 Mfanyakazi: *'+name+'*\\n'+
    '🕐 Wakati: '+timeStr+'\\n'+
    '📋 '+shift+'\\n'+
    '━━━━━━━━━━━━━━━━━━━━\\n'+
    '💰 *SALIO ZA FLOAT*\\n'+
    floats.map(f=>'  '+f.l+': '+fmt(f.v)).join('\\n')+'\\n'+
    '━━━━━━━━━━━━━━━━━━━━\\n'+
    '📱 *HUDUMA ZA LIPA NAMBA*\\n'+
    '  Voda Lipa: '+fmt(lipaV)+'\\n'+
    '  Tigo Lipa: '+fmt(lipaT)+'\\n'+
    '  Airtel Lipa: '+fmt(lipaA)+'\\n'+
    '  Jumla: *'+fmt(totalLipa)+'*\\n'+
    '━━━━━━━━━━━━━━━━━━━━\\n'+
    '🧾 *MATUMIZI*\\n'+
    (expC?'  Chakula: '+fmt(expC)+'\\n':'')+
    (expT?'  Transport: '+fmt(expT)+'\\n':'')+
    (expAir?'  Airtime: '+fmt(expAir)+'\\n':'')+
    (expO?'  Mengineyo: '+fmt(expO)+'\\n':'')+
    (note?'  Maelezo: '+note+'\\n':'')+
    '  Jumla: *'+fmt(totalExp)+'*\\n'+
    '━━━━━━━━━━━━━━━━━━━━\\n'+
    '💵 *JUMLA YA FLOAT: '+fmt(totalFloat)+'*\\n'+
    '📈 *FAIDA YA SHIFT: '+fmt(profit)+'*\\n'+
    '━━━━━━━━━━━━━━━━━━━━';

  try {
    const res=await fetch('/send-report',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({report})
    });
    const data=await res.json();
    if(data.success){
      show('s-success');
    } else {
      throw new Error(data.error);
    }
  } catch(err){
    btn.disabled=false;
    btn.textContent='Tuma ripoti kwa Michael';
    const t=document.getElementById('err-toast');
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),4000);
  }
}
</script>
</body>
</html>`);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Wakala Sinza running on port ' + PORT);
  setInterval(() => {
    axios.get('https://wakala-bot.onrender.com/ping').catch(() => {});
  }, 14 * 60 * 1000);
});
