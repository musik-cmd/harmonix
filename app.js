function pokazInterwal(klucz) {
    const kontener = klucz === "wiolinowy"
        ? "interwal-wiolinowy"
        : "interwal-basowy";

    const div = document.getElementById(kontener);

    if (!div) return;

    div.innerHTML = "";

    const VF = Vex.Flow;

    const renderer = new VF.Renderer(
        div,
        VF.Renderer.Backends.SVG
    );

    renderer.resize(500, 180);

    const context = renderer.getContext();

    const stave = new VF.Stave(20, 30, 430);

    stave.addClef(klucz === "wiolinowy" ? "treble" : "bass");

    stave.setContext(context).draw();

    const nuta1 = new VF.StaveNote({
        keys: klucz === "wiolinowy" ? ["c/4"] : ["e/2"],
        duration: "q"
    });

    const nuta2 = new VF.StaveNote({
        keys: klucz === "wiolinowy" ? ["db/4"] : ["f/2"],
        duration: "q"
    });

    const voice = new VF.Voice({
        numBeats: 2,
        beatValue: 4
    });

    voice.addTickables([nuta1, nuta2]);

    new VF.Formatter()
        .joinVoices([voice])
        .format([voice], 350);

    voice.draw(context, stave);
}
