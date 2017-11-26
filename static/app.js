/***
 Created by Anna Castaneda for Site Point. 26 Nov 2017
 Used Bootstrap for quick UI
 Used jQuery for id reference and quick change of innerHTML, although
 complexity is the same even if I used vanilla js
***/

var __Counters = {};

$(document).ready(function(){
  $('#btn-submit').prop('disabled',true);
  $('#title').keyup(function(){
    $('#btn-submit').prop('disabled', _.isEmpty(this.value) ? true : false);
  })
  return getAll(); // to get initial state
});

function genId() { // taken from Counters.js
  return (+new Date() + ~~(Math.random * 999999)).toString(36);
}

function getAll() {
  let list;
  if (_.isEmpty(__Counters)) {
    list = '<div class="row bg-info">' +
    '<div class="col-md-10 col-md-offset-1 text-center">' +
    'No data found. Please add new item.' +
    '</div>' +
    '</div>';
    $('div.sum').css('display', 'none');
  } else {
    list = _.map(__Counters, (item) => {
      var { id, title, count } = item;
      return (
        '<div id="' + id + '" class="row list-item">' +
        '<div class="col-md-1">' +
        '<button id="btn-delete" type="button" class="glyphicon glyphicon-trash" onclick="removeItem(\''+ id +'\')" />' +
        '</div>' +
        '<div class="col-md-5 name">' +
        title +
        '</div>' +
        '<div class="col-md-1">' +
        '<button id="btn-subtract" type="button" class="glyphicon glyphicon-minus" onclick="dec(\''+ id +'\', \''+ count +'\')" />' +
        '</div>' +
        '<div class="col-md-3 count text-center">' +
        '<strong>' + count + '</strong>' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button id="btn-add" type="button" class="glyphicon glyphicon-plus" onclick="inc(\''+ id +'\', \''+ count +'\')" />' +
        '</div>' +
        '</div>'
      );
    }).join('');
    $('div.sum').css('display', 'block');
  }
  document.getElementById('list').innerHTML = list;
  sum();
}

function addItem() {
  var id = genId();
  var title = $('#title').val();
  __Counters[id] = {id: id, title: title, count: 0};
  $('#title').val('');
  $('#btn-submit').prop('disabled',true);
  return getAll();
}

function removeItem(id) {
  delete __Counters[id];
  return getAll();
}

function inc(id, n) {
  __Counters[id].count = parseInt(n, 10) + 1;
  return getAll();
}

function dec(id, n) {
  __Counters[id].count = parseInt(n, 10) - 1;
  return getAll();
}

function sum() {
  var total = 0;
  _.forEach(__Counters, (item) => { total += parseInt(item.count, 10); });
  $('#total').text(total);
}
