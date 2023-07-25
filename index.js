

function onJson_book(json){
    console.log('JSON bibbia ricevuto');
    console.log(json);
    const library = document.querySelector("#bible-view");
    library.classList.remove('hidden');
    library.innerHTML='';
    const results = json.data.content;
    const name = json.data.reference;
    for(result of results){
        console.log(result + 'questo è un result');
    }
    if(results.lenght == 0)
    {
        const errore = document.createElement("h1")
        const messaggio = document.createTextNode("mi spiace, capitolo non trovato");
        errore.appendChild(messaggio);
        library.appendChild(errore);
    }
    const title = document.createElement('h1');
    title.style.fontSize= "40px"
    title.textContent = name;
    library.appendChild(title);
    

    let isFirstText = true; // Aggiungiamo una variabile per tenere traccia del primo "text" (il titolo)

    for (result of results) {
      let versi = "";
      if (result.type === "tag" && result.name === "para") {
        var items = result.items;
        var attrs = result.items.attrs;
    
        for (var j = 0; j < items.length; j++) {      
          if (items[j].type === "text") {
            if (isFirstText) {
              versi += "<h1>" + items[j].text + "</h1>"; 
              isFirstText = false; 
            } else {
                  versi += items[j].text;
                
            }
          }
        }
      }
    
      const cap = document.createElement('div');
      const testo = document.createElement('p');
      testo.innerHTML = versi + "</br>";
      testo.classList.add('Bible-verse');
      cap.appendChild(testo);
      library.appendChild(cap);
    }
    var currentURL = window.location.href;
    
    if (currentURL.includes('http://127.0.0.1:8000/home')) {

        const bibleVerses = document.getElementsByClassName("Bible-verse");
        for (let i = 0; i < bibleVerses.length; i++) {
            
         bibleVerses[i].addEventListener("click", comments);
        }
        console.log('Il file JS è stato chiamato dalla home.php');
    }
}




function onResponse(response){
    console.log('risposta ricevuta');
    return response.json();
}




  

function search(event) {
    event.preventDefault();
    window.scrollTo(0, 585);
    const chap = document.querySelector("#options").value;
    const tipo = document.querySelector("#type").value;

    console.log("Il tipo selezionato è: " + tipo + " cap: " + chap);

    fetch("/search?tipo=" + encodeURIComponent(tipo) + "&chap=" + encodeURIComponent(chap))
        .then(onResponse)
        .then(onJson_book);
}

function onJson_search(json){
    console.log('JSON search ricevuto');
    console.log(json);
    window.scrollTo(0, 700);
    const library = document.querySelector("#bible-view");
    library.classList.remove('hidden');
    library.innerHTML='';
    const word = json.data.query;
    const results = json.data.verses; 

    
    for(result of results){
        console.log(result + 'questo è un result');
    }
    if(results.lenght == 0)
    {
        const errore = document.createElement("h1")
        const messaggio = document.createTextNode("mi spiace, capitolo non trovato");
        errore.appendChild(messaggio);
        library.appendChild(errore);
    }

    const info = document.createElement('h1');
    info.textContent = "parola cercata: " + word + " | " + "ecco i primi 10 risultati... " ;
    library.appendChild(info);
    
    for(result of results){
        const versi = result.text;
        const reference = result.reference;
        const cap = document.createElement('div');
        const testo = document.createElement('p');
        testo.classList.add('Bible-verse');
        testo.textContent = reference + " -> " + versi;
        cap.appendChild(testo);
        library.appendChild(cap);

    }
    var currentURL = window.location.href;

    if (currentURL.includes('http://127.0.0.1:8000/home')) {
        const bibleVerses = document.getElementsByClassName("Bible-verse");
        for (let i = 0; i < bibleVerses.length; i++) {
         bibleVerses[i].addEventListener("click", comments);
        }
        console.log('Il file JS è stato chiamato dalla home.php');
    }
   
}

function search_word (event)
{
    event.preventDefault();
    window.scrollTo(0, 700);

    const object = document.getElementById("searchInput").value;


    fetch("/search_word/" + encodeURIComponent(object))
    .then(onResponse)
    .then(onJson_search);

}



function Bible_click(event){
    event.preventDefault();
    const tipo = document.querySelector('#bibbia');
    tipo.classList.remove('hidden');
    
}

function toggleForm() {
    var form = document.getElementById('bible-content');
    var section = document.getElementById('bible-view');
    var button = document.getElementById('bible');
    
    if (form.style.display === 'none') {
      form.style.display = 'block';
      section.classList.remove('hidden');
      button.textContent = 'NASCONDI';
    } else {
      form.style.display = 'none';
      button.textContent = 'LEGGI LA BIBBIA';
      section.classList.add('hidden');
    }
  }
  function toggleMenu() {
    var links = document.getElementById("links");
    if (links.style.display === "block") {
      links.style.display = "none";
    } else {
      links.style.display = "block";
    }
  }
  
const menuIcon = document.getElementById("menu-icon");
menuIcon.addEventListener("click", toggleMenu);


const form = document.querySelector("#bible-content");
form.addEventListener("submit", search);



const search_w = document.querySelector("#search_word");
search_w.addEventListener("submit", search_word );


















//per far variare il numero di capitoli in base al libro selezionato
function updateOptions() {
    var typeSelect = document.getElementById('type');
    var optionsSelect = document.getElementById('options');

    // Rimuovi tutte le opzioni esistenti
    while (optionsSelect.options.length > 0) {
      optionsSelect.remove(0);
    }
    var typeValue = typeSelect.value;

    if (typeValue === 'GEN') {
      var optionsSelect = document.getElementById('options');

      for (var i = 1; i <= 50; i++) {
      var option = new Option(i.toString(), i.toString());
      optionsSelect.add(option);
    }

    } else if (typeValue === 'EXO') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 40; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    
    } else if (typeValue === 'LEV') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 27; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'NUM') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 36; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'DEU') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 34; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JOS') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 24; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JDG') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 21; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'RUT') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1SA') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 31; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2SA') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 24; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1KI') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 22; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2KI') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 25; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1CH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 29; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2CH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 36; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'EZR') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 10; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'NEH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 13; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'EST') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 10; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JOB') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 42; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'PSA') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 150; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'PRO') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 31; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ECC') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 12; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'SNG') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 8; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ISA') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 66; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JER') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 52; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'LAM') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 5; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'EZK') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 48; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'DAN') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 12; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'HOS') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 14; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JOL') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'AMO') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 9; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'OBA') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 1; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JON') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'MIC') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 7; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'NAM') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'HAB') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ZEP') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'HAG') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 2; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ZEC') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 14; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'MAL') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'MAT') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 28; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'MRK') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 16; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'LUK') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 24; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JHN') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 21; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ACT') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 28; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'ROM') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 16; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1CO') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 16; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2CO') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 13; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'GAL') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 6; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'EPH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 6; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'PHP') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'COL') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1TH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 5; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2TH') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1TI') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 6; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2TI') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 4; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'TIT') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'PHM') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 1; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'HEB') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 13; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JAS') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 5; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1PE') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 5; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2PE') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 3; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '1JN') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 5; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '2JN') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 1; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === '3JN') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 1; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'JUD') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 1; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }
    } else if (typeValue === 'REV') {
        var optionsSelect = document.getElementById('options');
        for (var i = 1; i <= 22; i++) {
        var option = new Option(i.toString(), i.toString());
        optionsSelect.add(option);
    }

    }   
}

