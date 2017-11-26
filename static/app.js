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
  return getAllCounters(); // to get initial state
});

function getAllCounters() {
  $.ajax({
    method: "GET",
    url: "/api/v1/counters",
  }).done((res) => {
    __Counters = _.cloneDeep(res);
    getAll();
  });
}

function post(url, data) {
  $.ajax({
    method: "POST",
    url,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).done((res) => {
    // Do nothing
  }).fail((err) => {
    console.log('Fail:', err);
  });
}

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
  __Counters.push({id: id, title: title, count: 0});
  post('/api/v1/counter', { title, data: __Counters });
  $('#title').val('');
  $('#btn-submit').prop('disabled',true);
  return getAllCounters();
}

function getIndex(id) {
  return __Counters.findIndex(() => { return id; });
}

function removeItem(id) {
  __Counters.splice(getIndex(id));
  $.ajax({
    method: "DELETE",
    url: '/api/v1/counter',
    data: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return getAllCounters();
}

function inc(id, n) {
  __Counters[getIndex(id)].count = parseInt(n, 10) + 1;
  post('/api/v1/counter/inc', { id, data: __Counters });
  return getAllCounters();
}

function dec(id, n) {
  __Counters[getIndex(id)].count = parseInt(n, 10) - 1;
  post('/api/v1/counter/dec', { id, data: __Counters });
  return getAllCounters();
}

function sum() {
  var total = 0;
  _.forEach(__Counters, (item) => { total += parseInt(item.count, 10); });
  $('#total').text(total);
}
