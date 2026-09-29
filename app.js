let piano = null;
let pianoLoaded = false;


/* =====================================================
   OTWIERANIE SEKCJI
===================================================== */

function toggleInterval(type, button) {

    const item = button.parentElement;
    const wasOpen = item.classList.contains("open");

    document.querySelectorAll(".interval-item").forEach(element => {
        element.classList.remove("open");
    });

    if (!wasOpen) {
        item.classList.add("open");

        setTimeout(() => {
            drawInterval(type);
        }, 100);
    }
}


/* =====================================================
   DANE INTERWAŁÓW
===================================================== */

const intervals = {

    mala: {
        label: "Sekunda mała",
        treble: ["c/4", "db/4"],
        bass: ["c/3", "db/3"],
        piano: ["C4", "C#4"]
    },

    wielka: {
        label: "Sekunda wielka",
        treble: ["c/4", "d/4"],
        bass: ["c/3", "d/3"],
        piano: ["C4", "D4"]
    },

    zwiekszona: {
        label: "Sekunda zwiększona",
        treble: ["c/4", "d#/4"],
        bass: ["c/3", "d#/3"],
        piano: ["C4", "D#4"]
    },

    zmniejszona: {
        label: "Sekunda zmniejszona",

        // MUSI BYĆ C - D PODWÓJNIE OBNIŻONE
        treble: ["c/4", "dbb/4"],
        bass: ["c/3", "dbb/3"],

        // Dbb brzmi enharmonicznie jak C
        piano: ["C4", "C4"]
    }

};


/* =====================================================
   RYSOWANIE INTERWAŁU
===================================================== */

function drawInterval(type) {

    const data = intervals[type];

    drawStaff(
        `${type}-treble`,
        "treble",
        data.treble
    );

    drawStaff(
        `${type}-bass`,
        "bass",
        data.bass
    );
}


/* =====================================================
   POMOCNICZE
===================================================== */

const letterValue = {
    c: 0,
    d: 1,
    e: 2,
    f: 3,
    g: 4,
    a: 5,
    b: 6
};


/*
   Zwraca pozycję nuty względem dolnej linii pięciolinii.

   Klucz wiolinowy:
   E4 = dolna linia

   Klucz basowy:
   G2 = dolna linia
*/

function getStep(note, clef) {

    const [rawPitch, octaveText] = note.toLowerCase().split("/");

    const letter = rawPitch.charAt(0);
    const octave = Number(octaveText);

    const absolute =
        octave * 7 + letterValue[letter];

    let reference;

    if (clef === "treble") {

        reference =
            4 * 7 + letterValue.e;

    } else {

        reference =
            2 * 7 + letterValue.g;
    }

    return absolute - reference;
}


/* =====================================================
   RYSOWANIE PIĘCIOLINII
===================================================== */

function drawStaff(containerId, clef, notes) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";


    const width = 700;
    const height = 200;

    const staffLeft = 100;
    const staffRight = 650;

    const staffTop = 65;
    const gap = 14;


    let svg = `
        <svg
            width="100%"
            viewBox="0 0 ${width} ${height}"
            xmlns="http://www.w3.org/2000/svg"
            style="
                display:block;
                max-width:700px;
                margin:0 auto;
            "
        >
    `;


    /* =================================================
       PIĘCIOLINIA
    ================================================= */

    for (let i = 0; i < 5; i++) {

        const y =
            staffTop + i * gap;

        svg += `
            <line
                x1="${staffLeft}"
                y1="${y}"
                x2="${staffRight}"
                y2="${y}"
                stroke="#252238"
                stroke-width="1.5"
            />
        `;
    }


    /* =================================================
       KLUCZ
    ================================================= */

    if (clef === "treble") {

        svg += `
            <text
                x="25"
                y="128"
                font-size="82"
                font-family="serif"
                fill="#252238"
            >𝄞</text>
        `;

    } else {

        svg += `
            <text
                x="25"
                y="116"
                font-size="62"
                font-family="serif"
                fill="#252238"
            >𝄢</text>
        `;
    }


    /* =================================================
       NUTY
    ================================================= */

    const positions = [330, 480];


    notes.forEach((note, index) => {

        const [rawPitch] =
            note.toLowerCase().split("/");

        const x =
            positions[index];

        const step =
            getStep(note, clef);


        /*
           Dolna linia pięciolinii:
           step = 0

           Pierwsza przestrzeń:
           step = 1

           Pierwsza linia:
           step = 2

           itd.
        */

        const y =
            staffTop +
            4 * gap -
            step * (gap / 2);


        /* =================================================
           LINIE DODATKOWE POD PIĘCIOLINIĄ
        ================================================= */

        if (step < 0) {

            /*
               Linie dodatkowe występują na pozycjach:
               -2, -4, -6...
            */

            for (
                let ledgerStep = -2;
                ledgerStep >= step;
                ledgerStep -= 2
            ) {

                const ledgerY =
                    staffTop +
                    4 * gap -
                    ledgerStep * (gap / 2);

                svg += `
                    <line
                        x1="${x - 18}"
                        y1="${ledgerY}"
                        x2="${x + 18}"
                        y2="${ledgerY}"
                        stroke="#252238"
                        stroke-width="1.5"
                    />
                `;
            }
        }


        /* =================================================
           LINIE DODATKOWE NAD PIĘCIOLINIĄ
        ================================================= */

        if (step > 8) {

            for (
                let ledgerStep = 10;
                ledgerStep <= step;
                ledgerStep += 2
            ) {

                const ledgerY =
                    staffTop +
                    4 * gap -
                    ledgerStep * (gap / 2);

                svg += `
                    <line
                        x1="${x - 18}"
                        y1="${ledgerY}"
                        x2="${x + 18}"
                        y2="${ledgerY}"
                        stroke="#252238"
                        stroke-width="1.5"
                    />
                `;
            }
        }


        /* =================================================
           ZNAKI CHROMATYCZNE
        ================================================= */

        let accidental = "";


        if (rawPitch.includes("bb")) {

            accidental = "𝄫";

        } else if (rawPitch.includes("b")) {

            accidental = "♭";

        } else if (rawPitch.includes("#")) {

            accidental = "♯";
        }


        if (accidental) {

            svg += `
                <text
                    x="${x - 34}"
                    y="${y + 8}"
                    font-size="25"
                    font-family="serif"
                    fill="#252238"
                >${accidental}</text>
            `;
        }


        /* =================================================
           GŁÓWKA NUTY
        ================================================= */

        svg += `
            <ellipse
                cx="${x}"
                cy="${y}"
                rx="9"
                ry="6.5"
                transform="rotate(-18 ${x} ${y})"
                fill="#252238"
            />
        `;


        /* =================================================
           LASECZKA
        ================================================= */

        svg += `
            <line
                x1="${x + 7}"
                y1="${y}"
                x2="${x + 7}"
                y2="${y - 42}"
                stroke="#252238"
                stroke-width="2"
            />
        `;
    });


    svg += `
        </svg>
    `;


    container.innerHTML = svg;
}


/* =====================================================
   PIANINO
===================================================== */

async function createPiano() {

    if (pianoLoaded) {
        return;
    }

    try {

        piano = new Tone.Sampler({

            urls: {

                A0: "A0.mp3",
                C1: "C1.mp3",
                "D#1": "Ds1.mp3",
                "F#1": "Fs1.mp3",

                A1: "A1.mp3",
                C2: "C2.mp3",
                "D#2": "Ds2.mp3",
                "F#2": "Fs2.mp3",

                A2: "A2.mp3",
                C3: "C3.mp3",
                "D#3": "Ds3.mp3",
                "F#3": "Fs3.mp3",

                A3: "A3.mp3",
                C4: "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",

                A4: "A4.mp3",
                C5: "C5.mp3",
                "D#5": "Ds5.mp3",
                "F#5": "Fs5.mp3",

                A5: "A5.mp3",
                C6: "C6.mp3",
                "D#6": "Ds6.mp3",
                "F#6": "Fs6.mp3",

                A6: "A6.mp3",
                C7: "C7.mp3"
            },

            release: 1,

            baseUrl:
                "https://tonejs.github.io/audio/salamander/"

        }).toDestination();


        await Tone.loaded();

        pianoLoaded = true;

    }

    catch (error) {

        console.error(
            "Błąd ładowania pianina:",
            error
        );
    }
}


/* =====================================================
   ODTWARZANIE
===================================================== */

async function playInterval(type) {

    const data =
        intervals[type];

    const status =
        document.getElementById(
            `${type}-status`
        );


    if (status) {
        status.textContent =
            "Ładowanie pianina…";
    }


    await Tone.start();

    await createPiano();


    if (!piano) {

        if (status) {
            status.textContent =
                "Nie udało się załadować dźwięku.";
        }

        return;
    }


    if (status) {
        status.textContent =
            "▶ Odtwarzanie…";
    }


    piano.triggerAttackRelease(
        data.piano[0],
        "1n"
    );


    setTimeout(() => {

        piano.triggerAttackRelease(
            data.piano[1],
            "1n"
        );

    }, 850);


    setTimeout(() => {

        if (status) {
            status.textContent =
                "Gotowe";
        }

    }, 2200);
}
