// ==UserScript==
// @name         [Slack] Bulk Delete Slack Files
// @version      0.3
// @description  Adds a delete button to the file list
// @author       Js41637
// @match        https://*.slack.com/files*
// @match        https://*.slack.com/files*
// @exclude      https://*.slack.com/files/*/*/*
// ==/UserScript==

var deleteAllButton = '<a class="df_deleteAll btn btn_danger small_right_margin small_bottom_margin"><i class="ts_icon ts_icon_trash small_right_margin"></i>Delete all on page</a>';
var deleteButton = '<button class="btn_icon btn btn_outline ts_tip_btn ts_tip ts_tip_top df_deleteFile">';
var deleteIcon = '<span class="ts_icon ts_icon_trash" style="border:0;color:#555459"></span><div class="star_message ts_tip_tip">Delete</div>';
var deleteFileButton = deleteButton + deleteIcon + '</button>';

var files;
var fileIDs = [];
var errors = 0;

function waitForDOM(attempt) {
  if (!$('#files_list .file_item').length && attempt < 7) {
    setTimeout(function() {
      waitForDOM(attempt++);
    }, 600);
  } else if ($('#files_list .file_item').length) {
    console.debug("Found files");
    files = $('#files_list .file_item');
    addDeleteButtonToFiles();
    addDeleteAllButton();
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

function getFiles() {
  fileIDs = [];
  files.each(function(i, file) {
    var fileID = file.getAttribute('data-file-id');
    if ($(file).find('.starred').length) return;
    fileIDs.push(fileID);
  });
}

function bindClicks() {
  hoverButtons();
  $('.df_deleteFile').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    var fileID = e.currentTarget.getAttribute('data-file-id');
    if (fileID) {
      deleteFile(fileID);
    } else {
      console.error("WTF? No fileID?");
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

function addDeleteAllButton() {
  var delAll = $(deleteAllButton).insertBefore($('.col.span_1_of_3'));
  delAll.click(function() {
    getFiles();
    TS.generic_dialog.start({
      title: "Delete files",
      body: "Are you sure you want to permanently delete all files on this page? Dis can not be undone! Note: This won't delete starred files",
      show_cancel_button: true,
      show_go_button: true,
      go_button_class: "btn_danger",
      go_button_text: "Yes, delete all files",
      cancel_button_text: "Cancel",
      onGo: function() {
        deleteAll(delAll);
      }
    });
  });
}

function deleteAll(btn) {
  var offset = 0;
  var dun = fileIDs.length;
  btn.css('pointer-events', 'none');
  fileIDs.forEach(function(file) {
    setTimeout(function() {
      console.debug("Deleting file", file, dun);
      deleteFile(file);
      dun--;
      btn.text("Deleted " + (fileIDs.length - dun) + '/' + fileIDs.length);
      if (dun === 0) {
        setTimeout(function() {
          if (errors) {
            btn.text("Finished with " + errors + " errors");
          } else {
            btn.text("Finished");
          }
        }, 450);
      }
    }, 210 + offset);
    offset += 210;
  });
}

var apiKey = TS.boot_data.api_token;

function deleteFile(id) {
  if (!apiKey) {
    return console.error("WTF? No api key?");
  }
  $.post('https://slack.com/api/files.delete', {
    token: apiKey,
    file: id
  }, function(resp) {
    if (resp && resp.ok) {
      console.debug("Successfully deleted file", id);
      $('#file_' + id).css('opacity', 0.3);
    } else {
      errors++;
      console.error("Failed to delete file", resp.error);
    }
  });
}

waitForDOM(0);
