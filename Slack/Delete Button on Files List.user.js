// ==UserScript==
// @name         Delete Slack File
// @version      0.1
// @description  Adds a delete button to the file list
// @author       Js41637
// @match        https://*.slack.com/files*
// @exclude      https://*.slack.com/files/*/*
// ==/UserScript==

var deleteButton = '<button class="btn_icon btn btn_outline ts_tip_btn ts_tip ts_tip_top df_deleteFile">';
var deleteIcon = '<span class="ts_icon ts_icon_trash" style="border:0;color:#555459"></span><div class="star_message ts_tip_tip">Delete</div>';
var deleteFileButton = deleteButton + deleteIcon + '</button>';

var files;

function waitForDOM(attempt) {
  if (!$('#files_list .file_item').length && attempt < 7) {
    setTimeout(function() {
      waitForDOM(attempt++);
    }, 600);
  } else if ($('#files_list .file_item').length) {
    console.debug("Found files");
    files = $('#files_list .file_item');
    addDeleteButtonToFiles();
  } else {
    console.error("Couldn't find any files");
  }
}

function addDeleteButtonToFiles() {
  files.each(function(i, file) {
    var fileID = file.getAttribute('data-file-id');
    if (fileID) {
      $(deleteFileButton).attr('data-file-id', fileID).insertBefore($(file).find('.file_star'));
    } else {
      return console.error("Found no file ID for file", i);
    }
  });
  bindClicks();
}

function bindClicks() {
  hoverButtons();
  $('.df_deleteFile').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    var fileID = e.currentTarget.getAttribute('data-file-id');
    var apiKey = TS.boot_data.api_token;
    if (fileID && apiKey) {
      $.post('https://slack.com/api/files.delete', {
        token: apiKey,
        file: fileID
      }, function(resp) {
        if (resp && resp.ok) {
          console.debug("Successfully deleted file", fileID);
          $('#file_' + fileID).css('opacity', 0.3);
        }
      });
    } else {
      console.error("WTF? No fileID or APIKey?");
    }
  });
}

// Sue me
function hoverButtons() {
  $('.df_deleteFile').hover(function(e) {
    $(e.currentTarget).find('span').css('color', '#eb4d5c');
  }, function(e) {
    $(e.currentTarget).find('span').css('color', '#555459');
  });
}

waitForDOM(0);
