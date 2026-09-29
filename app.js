function pokazInterwal(klucz, rodzaj = "mala") {

    const kontener = klucz === "wiolinowy"
        ? "interwal-wiolinowy"
        : "interwal-basowy";

    const div = document.getElementById(kontener);

    if (!div) return;

    div.innerHTML = "";

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("width", "600");
    svg.setAttribute("height", "210");
    svg.setAttribute("viewBox", "0 0 600 210");

    // pięciolinia
    const startX = 100;
    const firstLineY = 70;
    const spacing = 12;

    for (let i = 0; i < 5; i++) {

        const line = document.createElementNS(svgNS, "line");

        line.setAttribute("x1", startX);
        line.setAttribute("x2", "560");

        line.setAttribute("y1", firstLineY + i * spacing);
        line.setAttribute("y2", firstLineY + i * spacing);

        line.setAttribute("stroke", "#252238");
        line.setAttribute("stroke-width", "1.5");

        svg.appendChild(line);
    }

    // klucz
    const clef = document.createElementNS(svgNS, "text");

    clef.setAttribute("x", "35");
    clef.setAttribute("y", "120");
    clef.setAttribute("font-size", "60");
    clef.setAttribute("font-family", "serif");

    clef.textContent =
        klucz === "wiolinowy" ? "𝄞" : "𝄢";

    svg.appendChild(clef);


    // Rodzaje sekund
    const dane = {

        mala: {
            nazwa: "Sekunda mała",
            znak: "♭",
            przesuniecie: 1
        },

        wielka: {
            nazwa: "Sekunda wielka",
            znak: "",
            przesuniecie: 1
        },

        zwiekszona: {
            nazwa: "Sekunda zwiększona",
            znak: "♯",
            przesuniecie: 1
        },

        zmniejszona: {
            nazwa: "Sekunda zmniejszona",
            znak: "♭♭",
            przesuniecie: 1
        }
    };


    const info = dane[rodzaj] || dane.mala;


    // Pozycje nut
    let y1;
    let y2;

    if (klucz === "wiolinowy") {

        y1 = 130;
        y2 = 118;

    } else {

        y1 = 130;
        y2 = 118;

    }


    rysujNute(
        svg,
        svgNS,
        220,
        y1,
        "C"
    );

    rysujNute(
        svg,
        svgNS,
        350,
        y2,
        info.znak + "D"
    );


    // podpis
    const label = document.createElementNS(svgNS, "text");

    label.setAttribute("x", "285");
    label.setAttribute("y", "195");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "17");
    label.setAttribute("font-family", "Arial");
    label.setAttribute("fill", "#6b6680");

    label.textContent = info.nazwa;

    svg.appendChild(label);

    div.appendChild(svg);
}


function rysujNute(svg, svgNS, x, y, nazwa) {

    const note = document.createElementNS(svgNS, "ellipse");

    note.setAttribute("cx", x);
    note.setAttribute("cy", y);

    note.setAttribute("rx", "10");
    note.setAttribute("ry", "7");

    note.setAttribute("fill", "#252238");

    svg.appendChild(note);


    const stem = document.createElementNS(svgNS, "line");

    stem.setAttribute("x1", x + 9);
    stem.setAttribute("x2", x + 9);

    stem.setAttribute("y1", y);
    stem.setAttribute("y2", y - 45);

    stem.setAttribute("stroke", "#252238");
    stem.setAttribute("stroke-width", "2");

    svg.appendChild(stem);


    // znak przy nucie
    if (nazwa.includes("♭") || nazwa.includes("♯")) {

        const accidental = document.createElementNS(
            svgNS,
            "text"
        );

        accidental.setAttribute("x", x - 25);
        accidental.setAttribute("y", y + 6);

        accidental.setAttribute("font-size", "24");
        accidental.setAttribute("font-family", "Arial");

        accidental.textContent =
            nazwa.includes("♯") ? "♯" : "♭";

        svg.appendChild(accidental);
    }
}
