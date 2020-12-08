'use strict'


let clientId = '91f71f725804f4915f4cc95f69fff503';
let soundCloudURL = 'https://api.soundcloud.com/tracks/';

function todaysDateFormatted() {
    let today = new Date();

    return `${today.getFullYear().toString().padStart(4, '0')}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}+00:00:00`
}


function getTrack(selectedGenre) {
    const params = {
        'client_id': clientId,
        'genres': selectedGenre,
        'created_at[from]': todaysDateFormatted(),
        'limit': 10
    };

    const queryString = formatQueryParams(params);
    const url = soundCloudURL + '?' + queryString;
    console.log(url);

$.ajax({
    type : "GET",
    url: url,
    dataType: "json"
    })
    .done(function(response){
        console.log(response)
        displayTrack(response);
    })
    .fail(function(jqXHR, textStatus){
        console.log(textStatus);
        console.log(jqXHR);
        $('#error-msg').text(`Something went wrong: ${txtStatus}`);
    })
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&')
    .replace('%5B', '[')
    .replace('%5D', ']')
    .replace('%2B', '+')
    .replace('%3A', ':')
    .replace('%3A', ':');
}

function getPlayerIframe(randomTrackURL) {
    fetch(`https://soundcloud.com/oembed?url=${randomTrackURL}&maxheight=150&format=json`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(responseJson => injectIframe(responseJson.html))
        .catch(err => {
            $('#error-msg').text(`Something went wrong: ${err.message}`);
        })
}


function displayTrack(response) {
    getPlayerIframe(response[Math.floor(Math.random() * response.length)].permalink_url);
}

function injectIframe(ombedResponse) {
    $('.results').empty();
    $('.results').append(ombedResponse);
}



function watchForm() {
    $('form').submit(e => {
        e.preventDefault();
        let selectedGenre = $("#genres :selected").val();

        getTrack(selectedGenre);
    })
}

$(watchForm)