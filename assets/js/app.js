
var btnSearch = $('#btnSearch'); // Boton de busqueda 
initJson();

function initJson() {
  /* 'https://pokeapi.co/api/v2/pokemon/?limit=721' */
  fetch('https://pokeapi.co/api/v2/pokemon/?limit=721')
    .then(function(response) {
      // Turns the the JSON into a JS object
      return response.json();
    })
    .then(function(data) {
      data.results.forEach(poke => {
        let pokeUrl = poke.url; // url del objeto
        let lastSlash = poke.url.lastIndexOf('/', pokeUrl.length - 1); // 1° slash
        let penultimateSlash = poke.url.lastIndexOf('/', lastSlash - 1); // 2 slash
        let pokeId = pokeUrl.slice(penultimateSlash, lastSlash); // variable que toma el id entre los slashes de la url
        let container = $('<div class="card">').addClass('cardItem');

        let img = $('<img>').attr('src', `https://pokeapi.co/media/img/${pokeId}.png`); 
        let title = $('<h2>').text(poke.name);
        container.append(img, title);
        $('#pokemons').append(container);
      });
      console.log(data.results);
    });
};

// funcion de busqueda
btnSearch.on('click', function(element) {
  element.preventDefault();
  var btnSearch = $('btnSearch').val();
  let container = $('<div>').addClass('col-xs-12 col-md-4 cardItem');
  fetch(`https://pokeapi.co/api/v2/pokemon/${btnSearch}/`) // busca por el nombre ingresado en el input
    .then(function(response) {
      // Turns the the JSON into a JS object
      return response.json();
    })
    .then(function(data) {
      let img = $('<img class = "imgPoke">').attr('src', `https://pokeapi.co/media/img/${data.id}.png`); 
      let title = $('<h2 class="name">').text(data.name);
      let height = $('<div class="col-md-4 caract"><p>').text('Altura: ' + data.height / 10 + ' m');
      let weight = $('<div class="col-md-4 caract"><p>').text('Peso: ' + data.weight / 10 + ' kg');

      container.append(title, img, height, weight);
      // obtener la habilidad
      data.abilities.forEach(function(element) {
        if (element.is_hidden === true) {
          container.append('<div class="col-md-5 caract"><p>Habilidad: ' + element.ability.name + '</p></div>');
        }
      });
      $('#pokemons').html(container);
      // para obtener la descripción
      return fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`);
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // para obtener el tipo de pokemon
      data.genera.forEach(function(element) {
        if (element.language.name === 'es') { // restringo a lenguaje español
          let category = $('<div class="caractGenus col-md-6"><p>').text('Categoría: ' + element.genus);
          container.append(category);
        }
      });
      data.flavor_text_entries.forEach(function(element) {
        if (element.language.name === 'es' && element.version.name === 'omega-ruby') {
          $('.imgPoke').after('<p class ="description">' + element.flavor_text + '</p>');
        }
      });
    }).catch(function(error) {
    });
});
// https://pokeapi.co/docsv2/ 