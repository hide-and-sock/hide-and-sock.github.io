window.onload = function() { init() };

$("#secret").keyup(function() {
  console.log($('#secret').val().length);
  console.log($('#secret').val());
  if ( event.which == 13 || $('#secret').val().length==4) {
     // event.preventDefault();
    $('#go').click();
  }
});
$('#go').click(function(){
  youData($('input#secret').val().toUpperCase());
})

// var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html';

var dataObject = {};

function init() {
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   simpleSheet: false } )
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function showInfo(data, tabletop) {
  datafinds = data.finds;
  console.log(data);

  var codes = ['Code 1','Code 2','Code 3','Code 4','Code 5'];

  //initialize dataObject
  var name_phrase = data.finds.column_names[1];
  console.log(data.finds);
  for (var i=0; i < datafinds.elements.length; i++){
    // console.log(datafinds.elements[i]);
    var row = datafinds.elements[i]
    var secret = row[name_phrase].toUpperCase();
    // console.log(secret);
    if (!(secret in dataObject)){
      dataObject[secret] = {
        'finds':[],
        'founds':[],
        'name':"",
        'base':100,
        'bonus':0
      };
    }

    //initialize Finds
    for (var j = 0; j < codes.length; j++){
      if(row[codes[j]]!==""){
        dataObject[secret].finds.push(row[codes[j]].toUpperCase());
      }
    }
  }

  //initialize Founds
  for(el in dataObject){
    for(var i = 0; i<dataObject[el].finds.length; i++){
      if(dataObject[el].finds[i] in dataObject){
        dataObject[dataObject[el].finds[i]].founds.push(el.toUpperCase());
      }
    }
  }

  //sweep NamesArray
  for(var i=0; i < data.userData.elements.length; i++){
    if (data.userData.elements[i]['Code'] in dataObject){
      dataObject[data.userData.elements[i]['Code']].name = data.userData.elements[i]['Name'];
      dataObject[data.userData.elements[i]['Code']].location = data.userData.elements[i]['Location'];
      dataObject[data.userData.elements[i]['Code']].zone = data.userData.elements[i]['Zone'];
      dataObject[data.userData.elements[i]['Code']].team = data.userData.elements[i]['Team'];
    }
  }

  //tally points
  for(el in dataObject){
    dataObject[el].base=100.0/(dataObject[el].founds.length+1);
    // console.log(dataObject[el].founds.length);
    for(var i=0; i<dataObject[el].founds.length; i++){
      dataObject[dataObject[el].founds[i]].bonus += dataObject[el].base;
    }
  }

  //combine base, bonus to score
  for(el in dataObject){
    dataObject[el].score = dataObject[el].base + dataObject[el].bonus;
  }

  //create dataArray from dataObject
  var dataArray = new Array;
  for(var o in dataObject) {
      dataArray.push(dataObject[o]);
  }

  //sort dataArray by score
  dataArray.sort(function(a,b){return a.score < b.score;});

  //print to table
  for(var i=0; i<dataArray.length; i++){
    $('#tops tbody').append("<tr> <td>"+dataArray[i].name+"</td> <td>"+parseInt(dataArray[i].score)+"</td> <td>"+dataArray[i].finds.length+"</td> <td>"+dataArray[i].founds.length+"</td> </tr>");
  }

  renderGraph(process(dataObject));
}

function youData(secret){
  console.log(dataObject);
  if(secret in dataObject){
    $('div#you_data').removeClass('hide', 1000, "easeInBack");
    var obj = dataObject[secret];
    $('ul#you_finds').empty();
    $('ul#you_founds').empty();
    for(var i = 0; i < obj.finds.length; i++){
      if(obj.finds[i] in dataObject){
        $('ul#you_finds').append('<li><small class="grey-text">'+dataObject[obj.finds[i]].location+'</small> '+dataObject[obj.finds[i]].name+'</li>');
      }
    }
    for(var i = 0; i < obj.founds.length; i++){
        $('ul#you_founds').append('<li>'+dataObject[obj.founds[i]].name+' <small class="grey-text">'+dataObject[obj.founds[i]].location+'</small></li>');
    } 
  } else {

  }

}




