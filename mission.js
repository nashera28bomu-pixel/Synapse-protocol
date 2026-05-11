const Missions = [
    {
        id: "NAIROBI_GHOST",
        title: "OPERATION: GHOST SIGNAL",
        location: "NAIROBI CENTRAL DISTRICT",
        briefing: `
            <h2 style="color:#00d9ff">PRIMARY DIRECTIVE</h2>
            <p>At 04:00 EAT, the Matatu transit grid was hijacked by a rogue neural burst. 
            CymorTech satellites show a 'Ghost Signal' originating from the Old Railway Museum server vaults.</p>
            <br>
            <h3 style="color:#ff003c">RISK ASSESSMENT</h3>
            <p>ERYX has flagged a 89% probability that this is a precursor to a total city blackout. 
            However, Liara Shade reports anomalies in the packet headers—one of the updates you receive will be a fabrication by the intruder... or ERYX itself.</p>
            <br>
            <p><strong>MISSION:</strong> Identify the false data and purge the signal before the grid collapses.</p>
        `,
        updates: [
            { id: 1, text: "[ALERT] Traffic lights in Upper Hill synchronized to Green. Chaos imminent.", type: "truth" },
            { id: 2, text: "[ANALYSIS] Intruder IP traced to a residential villa in Karen.", type: "deception" },
            { id: 3, text: "[SYSTEM] Emergency protocols bypassed in the CBD terminal.", type: "truth" }
        ],
        solution: 2
    }
];
