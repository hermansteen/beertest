function Instructions({db}) {   
    return(
    <>
    {db === "beer" && <div id="instructions"> 
        <h2>Intruktioner</h2>

        <p>Uppe till vänster finns en switch för att välja mellan öl- eller vinrekomendationer. Orange för öl och röd för vin.</p>
        <p>Skriv namnet på en specifik öl, ölstil eller producent i sökfältet ovan. Resultaten visas automatiskt ju mer du skriver.</p>
        <p>Genom att trycka på ett av ölkorten så kommer liknande ölsorter att visas på skärmen.</p>
        <p>Uppe i det högra hörnet så ser du vilken öl du jämför med just nu.</p>
        <p>Hoppas att vi kan hjälpa dig att hitta en ny favorit i öldjungeln!</p></div>}

    {db === "wine" && <div id="instructions">
        <h2>Intruktioner</h2>

        <p>Uppe till vänster finns en switch för att välja mellan öl- eller vinrekomendationer. Orange för öl och röd för vin.</p>
        <p>Skriv namnet på ett specifikt vin, en vinstil eller producent i sökfältet ovan. Resultaten visas automatiskt ju mer du skriver.</p>
        <p>Genom att trycka på ett av vinkorten så kommer liknande vinsorter att visas på skärmen.</p>
        <p>Uppe i det högra hörnet så ser du vilket vin du jämför med just nu.</p>
        <p>Hoppas att vi kan hjälpa dig att hitta ett nytt favoritvin!</p></div>}
    </>
    )
}

export default Instructions;