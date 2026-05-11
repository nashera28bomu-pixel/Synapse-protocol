const Missions = [

{
id:"NAIROBI_GHOST",

title:"OPERATION GHOST SIGNAL",

location:"NAIROBI CENTRAL DISTRICT",

time:60,

briefing:`

<h2>MISSION BRIEFING</h2>

<p>
At exactly 04:13 EAT,
multiple transport systems across Nairobi
began responding to unauthorized neural traffic.
</p>

<br>

<p>
CymorTech satellites traced the intrusion
to abandoned railway tunnels beneath the CBD.
</p>

<br>

<p>
ERYX predicts an 89% chance
of total infrastructure collapse.
</p>

<br>

<p style="color:#00e5ff">
WARNING:
One field update will be intentionally false.
</p>

`,

updates:[

{
text:"Traffic systems locked to green in Upper Hill.",
truth:true
},

{
text:"Signal source traced to a Karen residence.",
truth:false
},

{
text:"Unknown neural burst detected underground.",
truth:true
},

{
text:"Emergency response network disconnected.",
truth:true
}

],

actions:[

"TRACE SIGNAL",
"ISOLATE NODE",
"CUT POWER",
"TRUST ERYX"

],

correct:2

}

];
