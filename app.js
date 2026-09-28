const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow;

function pokazInterwal(klucz) {
    const kontener = klucz === "wiolinowy"
        ? "interwal-wiolinowy"
        : "interwal-basowy";

    const div = document.getElementById(kontener);

    div.innerHTML = "";

    const renderer = new Renderer(div, Renderer.Backends.SVG);

    renderer.resize(500, 180);

    const context = renderer.getContext();

    const stave = new Stave(20, 30, 430);

    stave.addClef(klucz === "wiolinowy" ? "treble" : "bass");

    stave.setContext(context).draw();

    const nuta1 = new StaveNote({
        keys: klucz === "wiolinowy" ? ["c/4"] : ["e/2"],
        duration: "q"
    });

    const nuta2 = new StaveNote({
        keys: klucz === "wiolinowy" ? ["db/4"] : ["f/2"],
        duration: "q"
    });

    const voice = new Voice({
        numBeats: 2,
        beatValue: 4
    });

    voice.addTickables([nuta1, nuta2]);

    new Formatter()
        .joinVoices([voice])
        .format([voice], 350);

    voice.draw(context, stave);
}
