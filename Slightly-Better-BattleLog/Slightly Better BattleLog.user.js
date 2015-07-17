// ==UserScript==
// @name        Slightly Better Battlelog
// @version     1.0
// @author      Js41637
// @match       http://battlelog.battlefield.com/bf4/*
// @grant       none
// @run-at      document-body
// ==/UserScript==

// 1 = hidden, 0 = shown. Hide by default
var status = 1;

function checkjQuery() {
    if (window.jQuery) {
        console.info("jQuery loaded!");
        initialize();
    } else {
        console.info("Waiting for jQuery");
        setTimeout(function() { checkjQuery() }, 50);
    }
}

var initialize = function() {
    console.info("Loading CSS and Waiting for BattleLog");
    $J = jQuery;

    // Minified CSS to add into the page
    $J("<style type='text/css'>#toggle-sidepanel{position:fixed;right:213px;transform:rotate(90deg);top:37px;background-color:rgba(0,0,0,.6);padding:10px;z-index:5000;font-size:15px;text-transform:uppercase;transition:background-color,right .2s ease-in-out;cursor:pointer}#toggle-sidepanel:hover{background-color:rgba(60,60,60,.5)}#comcenter-friends{transition:width .2s ease-in-out}#base-header,#unified-game-manager{transition:right .2s ease-in-out}#viewport{transition:padding .2s ease-in-out}.hidesidepanel #comcenter-friends{width:0!important}.hidesidepanel #base-header,.hidesidepanel #unified-game-manager{right:0!important}.hidesidepanel #viewport{padding-right:0!important}.hidesidepanel #toggle-sidepanel{right:-24px !important}#base-container:before{height:64px;}.game-bar .battlelog-logo{position:absolute;top:0px;left:30px;z-index:1000}.game-bar .battlelog-logo .logo{display:block;width:70px;height:48px;background:url(//d34ymitoc1pg7m.cloudfront.net/common/battlelog-logo-082bd9ee.png) 0 50% no-repeat;background-size:contain;}#uioverlay .uioverlaysectionleft{left:20px !important;}</style>").appendTo("head");

    // Delay to wait for BattleLogs weird DOM
    setTimeout(function() { waitForBattleLog(); }, 550);
}

var waitForBattleLog = function() {
    console.info("BattleLog loaded, hopefully")
    hideSidePanel();
    $J('body').append('<div id="toggle-sidepanel">Toggle</div>');

    $J('#toggle-sidepanel').on('click', function() {
        if (status == 1) {
            showSidePanel();
        } else {
            hideSidePanel();
        }
    });

    // Remove a bunch of un-needed stuff and move stuff around
    // Delete contents of base-header and move user-tools into it
    $J('#base-header-secondary-nav').empty();
    $J('#base-header-user-tools').appendTo($J('#base-header-secondary-nav'));
    // Moves the battlelog logo to secondary header and then removes top header
    $J('#community-bar .battlelog-logo').appendTo($J('#base-header .game-bar'));
    $J('#community-bar').empty();
};

var hideSidePanel = function() {
    status = 1;
    $J('body').addClass('hidesidepanel');
};

var showSidePanel = function() {
    status = 0;
    $J('body').removeClass('hidesidepanel');
};

checkjQuery();

window.onbeforeunload = function() {
    return "Are you sure you want to leave? If you're in a queue your spot will be lost!";
};