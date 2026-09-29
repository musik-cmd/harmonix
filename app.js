let piano = null;
let pianoLoaded = false;


/* =========================
   ROZWIJANIE SEKCJI
========================= */

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


/* =========================
   DANE INTERWAŁÓW
========================= */

const intervals = {

    mala: {
        label: "Sekunda mała",
        treble: ["C/4", "Db/4"],
        bass: ["C/3", "Db/3"],
        piano: ["C4", "C#4"]
    },

    wielka: {
        label: "Sekunda wielka",
        treble: ["C/4", "D/4"],
        bass: ["C/3", "D/3"],
        piano: ["C4", "D4"]
    },

    zwiekszona: {
        label: "Sekunda zwiększona",
        treble: ["C/4", "D#/4"],
        bass: ["C/3", "D#/3"],
        piano: ["C4", "D#4"]
    },

    zmniejszona: {
        label: "Sekunda zmniejszona",
        treble: ["C/4", "C/4"],
        bass: ["C/3", "C/3"],
        piano: ["C4", "C4"]
    }

};


/* =========================
   RYSOWANIE OBU KLUCZY
========================= */

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


/* =========================
   PIĘCIOLINIA — VEXFLOW
========================= */

function drawStaff(containerId, clef, notes) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    try {

        // VexFlow 5
        const VF = window.VexFlow;

        if (!VF) {
            throw new Error("VexFlow nie został załadowany.");
        }

        const renderer = new VF.Renderer(
            container,
            VF.Renderer.Backends.SVG
        );

        renderer.resize(700, 180);

        const context = renderer.getContext();

        const stave = new VF.Stave(
            60,
            40,
            570
        );

        stave
            .addClef(clef)
            .addTimeSignature("2/4");

        stave
            .setContext(context)
            .draw();


        /* -------------------------
           NUTY
        ------------------------- */

        const staveNotes = notes.map(noteName => {

            return new VF.StaveNote({
                clef: clef,
                keys: [noteName],
                duration: "q",
                auto_stem: true
            });

        });


        /* -------------------------
           GŁOS
        ------------------------- */

        const voice = new VF.Voice({
            num_beats: 2,
            beat_value: 4
        });

        voice.addTickables(staveNotes);


        /* -------------------------
           FORMATOWANIE
        ------------------------- */

        new VF.Formatter()
            .joinVoices([voice])
            .format([voice], 400);


        /* -------------------------
           RYSOWANIE
        ------------------------- */

        voice.draw(
            context,
            stave
        );

    }

    catch (error) {

        console.error(
            "Błąd VexFlow:",
            error
        );

        container.innerHTML = `
            <p style="
                padding: 35px;
                text-align: center;
                color: #777187;
                font-size: 14px;
            ">
                Nie udało się narysować pięciolinii.
            </p>
        `;
    }
}


/* =========================
   PRAWDZIWE PIANINO
========================= */

async function createPiano() {

    if (pianoLoaded) return;

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


/* =========================
   ODTWARZANIE
========================= */

async function playInterval(type) {

    const data = intervals[type];

    const status =
        document.getElementById(`${type}-status`);

    if (status) {
        status.textContent = "Ładowanie pianina…";
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
        status.textContent = "▶ Odtwarzanie…";
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
            status.textContent = "Gotowe";
        }

    }, 2200);
}
