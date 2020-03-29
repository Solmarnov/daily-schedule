
const currentDayEl = $('#currentDay');
const textareaEl = $('textarea');

let schedule = {
  '9am': '',
  '10am': '',
  '11am': '',
  '12pm': '',
  '1pm': '',
  '2pm': '',
  '3pm': '',
  '4pm': '',
  '5pm': ''
};

setTimeEverySecond();
appendScheduler();
getSchedule();
renderSchedule();
checkCurrentHour();

// ******EVENT LISTENERS****** //
// Save time block input to local storage
$('button').on('click', function() {
  let thisParentSiblings = $(this).parent().siblings();
  let timeBlock = $(thisParentSiblings[0]).text();
  let textareaInput = $(thisParentSiblings[1]).val();

  localStorage.setItem(timeBlock + ' schedule', textareaInput.trim());
  $(this).css({'color':'white', 'font-size':'1.5rem', 'text-shadow':'none'});
});

// Check if textarea input has been modified based on keyup event
$('textarea').on('keyup', function() {
  let thisSiblings = $(this).siblings();
  let thisSiblingsChildren = $(thisSiblings[1]).children();
  let buttonEl = $(thisSiblingsChildren[0]);
  let textareaInput = $(this);
  
  if (
    textareaInput.val().trim() != '' && 
    textareaInput.val() != schedule[textareaInput.attr('#id')]
  ) {
    saveIconYellow();
  } else {
    saveIconDefault();
  };

  function saveIconYellow() {
    buttonEl.css({
      'color':'yellow', 
      'font-size':'1.7rem', 
      'text-shadow':' 0 0 1.5rem yellow', 
      'transition':'all .2s ease-in-out'
    });
  };

  function saveIconDefault() {
    buttonEl.css({
      'color':'white', 
      'font-size':'1.5rem', 
      'text-shadow':'none'
    });
  };
});

// ******TIME FUNCTION****** //
function setTimeEverySecond() {
  setInterval( () => {
    let currentDay = moment().format('Do MMMM YYYY, h:mm:ss a');
    currentDayEl.text(currentDay);
    checkCurrentHour();
  }, 1000);
};

// ******SCHEDULER FUNCTIONS****** // 
function appendScheduler() {
  $('.container').empty();

  for (let i = 9; i < 18; i++) {
    // Define HTML elements
    let containerDiv = $('.container')
    let rowDiv = $('<div class="row">');
    let inputGroupDiv = $('<div class="input-group">');
    let inputGroupPrependDiv = $('<div class="input-group-prepend">');
    let inputGroupTextSpan = $('<span class="input-group-text hour">');
    let formControlTextArea = $('<textarea class="form-control">');
    let inputGroupAppendDiv = $('<div class="input-group-append">');
    let saveButton = $('<button class="btn btn-outline-secondary saveBtn">');
    let saveIcon = $('<i class="fas fa-save"></i>');

    // Set Hour, AM and PM to inputGroupTextSpan element
    if (i < 12) {
      inputGroupTextSpan
        .text(i + ' am')
        .attr('data-hour', i);
    } else if (i == 12) {
      inputGroupTextSpan
        .text(i + ' pm')
        .attr('data-hour', i);
    } else {
      inputGroupTextSpan
        .text(i - 12 + ' pm')
        .attr('data-hour', i);
    };
    
    // Append schedule to HTML
    inputGroupPrependDiv.append(inputGroupTextSpan);
    saveButton
      .attr('data-hour', i)
      .attr('id', 'hour-' + i)
      .append(saveIcon);
    inputGroupAppendDiv.append(saveButton);
    inputGroupDiv.append(inputGroupPrependDiv);
    formControlTextArea.attr('id', i);
    inputGroupDiv.append(formControlTextArea);
    inputGroupDiv.append(inputGroupAppendDiv);
    rowDiv.append(inputGroupDiv);
    containerDiv.append(rowDiv);
  };
};

// Get items saved to local storage and store in schedule object
function getSchedule() {
  for (let i = 9; i < 18; i++) {
    if (i < 12) {
      if (localStorage.getItem(i + ' am schedule') === null) {
        schedule[i + 'am'] = '';
      } else {
        schedule[i + 'am'] = localStorage.getItem(i + ' am schedule');
      };
    } else if (i == 12) {
      if (localStorage.getItem(i + ' pm schedule') === null) {
        schedule[i + 'pm'] = '';
      } else {
        schedule[i + 'pm'] = localStorage.getItem(i + ' pm schedule');
      };
    }
    else {
      if (localStorage.getItem(i - 12 + ' pm schedule') === null) {
        schedule[i + 'pm'] = '';
      } else {
        schedule[i - 12 + 'pm'] = localStorage.getItem(i - 12 + ' pm schedule');
      };
    };
  };
};

// Render schedule using local storage items stored in schedule object
function renderSchedule() {
  for (let i = 9; i < 18; i++) {
    let scheduleContainer = $('#' + i)
    if (i < 12) {
      scheduleContainer.text(schedule[i + 'am']);
    } else if (i == 12) {
      scheduleContainer.text(schedule[i + 'pm']);
    } else {
      scheduleContainer.text(schedule[i - 12 + 'pm']);
    };
  };
};

// Assign past/present/future classes
function checkCurrentHour() {
  let currentHour = moment().hour();
  for (let i = 9; i < 18; i++) {
    let textareaId = $('#' + i)[0].id;
    if (currentHour < +textareaId) {
      $('#' + i).attr('class', 'form-control future');
    } else if (currentHour == +textareaId) {
      $('#' + i).attr('class', 'form-control present');
    } else {
      $('#' + i).attr('class', 'form-control past');
    };
  };
};
