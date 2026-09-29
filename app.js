function pokazInterwal(klucz) {
    const kontener = klucz === "wiolinowy"
        ? "interwal-wiolinowy"
        : "interwal-basowy";

    const div = document.getElementById(kontener);

    if (!div) return;

    div.innerHTML = "";

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "500");
    svg.setAttribute("height", "190");
    svg.setAttribute("viewBox", "0 0 500 190");

    // Tło
    const background = document.createElementNS(svgNS, "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", "500");
    background.setAttribute("height", "190");
    background.setAttribute("rx", "15");
    background.setAttribute("fill", "white");

    svg.appendChild(background);

    // Pięciolinia
    const startX = 90;
    const endX = 460;
    const firstLineY = 65;
    const spacing = 12;

    for (let i = 0; i < 5; i++) {
        const line = document.createElementNS(svgNS, "line");

        line.setAttribute("x1", startX);
        line.setAttribute("x2", endX);
        line.setAttribute("y1", firstLineY + i * spacing);
        line.setAttribute("y2", firstLineY + i * spacing);
        line.setAttribute("stroke", "#252238");
        line.setAttribute("stroke-width", "1.5");

        svg.appendChild(line);
    }

    // Klucz
    const clef = document.createElementNS(svgNS, "text");

    clef.setAttribute("x", "30");
    clef.setAttribute("y", klucz === "wiolinowy" ? "112" : "100");
    clef.setAttribute("font-size", "58");
    clef.setAttribute("font-family", "serif");

    clef.textContent = klucz === "wiolinowy" ? "𝄞" : "𝄢";

    svg.appendChild(clef);

    // Dane nut
    let nuta1;
    let nuta2;

    if (klucz === "wiolinowy") {
        // C4 - Db4 = sekunda mała
        nuta1 = { name: "C", y: 137 };
        nuta2 = { name: "D♭", y: 131 };
    } else {
        // E2 - F2 = sekunda mała
        nuta1 = { name: "E", y: 137 };
        nuta2 = { name: "F", y: 131 };
    }

    rysujNute(svg, svgNS, 190, nuta1.y, nuta1.name);
    rysujNute(svg, svgNS, 320, nuta2.y, nuta2.name);

    div.appendChild(svg);
}


function rysujNute(svg, svgNS, x, y, nazwa) {

    // Linie dodane pod pięciolinią
    if (y > 125) {
        const ledger = document.createElementNS(svgNS, "line");

        ledger.setAttribute("x1", x - 18);
        ledger.setAttribute("x2", x + 18);
        ledger.setAttribute("y1", y);
        ledger.setAttribute("y2", y);
        ledger.setAttribute("stroke", "#252238");
        ledger.setAttribute("stroke-width", "1.5");

        svg.appendChild(ledger);
    }

    // Główka nuty
    const note = document.createElementNS(svgNS, "ellipse");

    note.setAttribute("cx", x);
    note.setAttribute("cy", y);
    note.setAttribute("rx", "10");
    note.setAttribute("ry", "7");
    note.setAttribute("fill", "#252238");

    svg.appendChild(note);

    // Laseczka
    const stem = document.createElementNS(svgNS, "line");

    stem.setAttribute("x1", x + 9);
    stem.setAttribute("x2", x + 9);
    stem.setAttribute("y1", y);
    stem.setAttribute("y2", y - 42);
    stem.setAttribute("stroke", "#252238");
    stem.setAttribute("stroke-width", "2");

    svg.appendChild(stem);

    // Nazwa nuty
    const label = document.createElementNS(svgNS, "text");

    label.setAttribute("x", x);
    label.setAttribute("y", "170");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "14");
    label.setAttribute("font-family", "Arial");
    label.setAttribute("fill", "#6b6680");

    label.textContent = nazwa;

    svg.appendChild(label);
}


// Proste odtwarzanie dźwięków
function zagrajDzwiek(frequency, duration = 0.7) {

    const AudioContext =
        window.AudioContext || window.webkitAudioContext;

    const audio = new AudioContext();

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.25,
        audio.currentTime + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
}


function zagrajSekundeMala() {

    zagrajDzwiek(261.63, 0.6);

    setTimeout(() => {
        zagrajDzwiek(277.18, 0.6);
    }, 650);
}
