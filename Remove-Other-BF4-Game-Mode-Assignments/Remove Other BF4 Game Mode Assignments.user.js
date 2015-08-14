// ==UserScript==
// @name        Remove Other BF4 Game Mode Assignments
// @version     1.0
// @author      Js41637
// @match       *://battlelog.battlefield.com/bf4/soldier/*/assignments/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

function checkjQuery() {
    if (window.jQuery) {
        waitForAssignments();
    } else {
        setTimeout(function() { checkjQuery() }, 500);
    }
}

function updateAssignments() {
    var dBronzeAssign = ['XP3AS03','xp2as01','xp1as02','as13','as12'];
    var dSilverAssign = ['XP3AS09','xp1as09','XP0AS07b'];
    var dGoldAssign = ['xp2as10'];
    var bronzeProgress = $('#assignments-statistics header h1 span.pull-right')[0].innerText;
    var silverProgress = $('#assignments-statistics header h1 span.pull-right')[1].innerText;
    var goldProgress = $('#assignments-statistics header h1 span.pull-right')[2].innerText;

    for(var i = 0; i < dBronzeAssign.length; i++) {
        $("li[data-mission-code=" + dBronzeAssign[i] + "]").remove();
    }
    for(var i = 0; i < dSilverAssign.length; i++) {
        $("li[data-mission-code=" + dSilverAssign[i] + "]").remove();
    }
    for(var i = 0; i < dGoldAssign.length; i++) {
        $("li[data-mission-code=" + dGoldAssign[i] + "]").remove();
    }
    $('#assignments-statistics header h1 span.pull-right')[0].innerText = bronzeProgress.slice(0,2).replace('/', '') + '/' + (bronzeProgress.slice(-2) - dBronzeAssign.length);
    $('#assignments-statistics header h1 span.pull-right')[1].innerText = silverProgress.slice(0,2).replace('/', '') + '/' + (silverProgress.slice(-2) - dSilverAssign.length);
    $('#assignments-statistics header h1 span.pull-right')[2].innerText = goldProgress.slice(0,2).replace('/', '') + '/' + (goldProgress.slice(-2) - dGoldAssign.length);
}

function waitForAssignments() {
    console.info("Waiting for Assignments");
    if ($('#assignments-statistics').length == 0) {
        setTimeout(function() {
            waitForAssignments();
        }, 500);
    } else {
        console.info("Updating Assignments");
        setTimeout(function() {
            updateAssignments();
        }, 350);
    }
}

checkjQuery();