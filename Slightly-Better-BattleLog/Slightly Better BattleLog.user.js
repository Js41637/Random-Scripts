// ==UserScript==
// @name        Slightly Better Battlelog
// @version     1.3
// @author      Js41637
// @match       http://battlelog.battlefield.com/bf4/*
// @grant       none
// @run-at      document-body
// ==/UserScript==

//TODO: Don't load script on Login Page

// 1 = hidden, 0 = shown. Hide by default
var status = 1;
//var checkPageChange = null;

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
    $J("<style type='text/css'>#toggle-sidepanel{position:fixed;right:-24px;transform:rotate(90deg);top:37px;background-color:rgba(0,0,0,.6);padding:10px;z-index:5000;font-size:15px;text-transform:uppercase;transition:background-color,right .2s ease-in-out;cursor:pointer}#toggle-sidepanel:hover{background-color:rgba(60,60,60,.5)}#comcenter-friends{width:0;transition:width .2s ease-in-out}#base-bf4-html #base-header,#base-bf4-html #unified-game-manager{right:0;transition:right .2s ease-in-out}#base-bf4-html #viewport{padding-right:0;transition:padding .2s ease-in-out}#base-bf4-html #base-background{margin-left:0;transition:margin .2s ease-in-out}.show-sidepanel #comcenter-friends{width:237px!important}.show-sidepanel #base-header,.show-sidepanel #unified-game-manager{right:237px!important}.show-sidepanel #viewport{padding-right:237px!important}.show-sidepanel #toggle-sidepanel{right:213px!important}#base-container:before{height:64px}.game-bar .battlelog-logo{position:absolute;top:0;left:30px;z-index:1000}.game-bar .battlelog-logo .logo{display:block;width:70px;height:48px;background:url(//d34ymitoc1pg7m.cloudfront.net/common/battlelog-logo-082bd9ee.png) 0 50% no-repeat;background-size:contain}#uioverlay .uioverlaysectionleft{left:20px!important}#selected-server-scoreboard .box-content{min-height:67px}#comcenter-tab-friends-content{width:237px!important}#bblog-icon{top:58px!important}#bblog-teamspeak{top:217px!important}#serverbrowser .servers-list tbody .server-row{height:63px}#base-header-secondary-nav{line-height:initial}#friendlist-header .icon-search{display:none}.show-sidepanel #friendlist-header .icon-search{display:initial}.main-header .suggestions .suggestion .image{margin:10% 0}#main-postlistsmall footer:hover{background:rgba(7,7,7,0.6)!important}.get-bfh-tile,#cookie-preferences,#serverbrowser-show .bblog-local-comment{display:none}#cookie-preferences</style>").appendTo("head");

    // Delay to wait for BattleLogs weird DOM
    setTimeout(function() { waitForBattleLog(); }, 650);
}

// Delayed until BattleLogs weird DOM has stopped changing
var waitForBattleLog = function() {
    console.info("BattleLog loaded, hopefully")
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

    // Wait for Surface to be defined
    waitForSurface();
};

var hideSidePanel = function() {
    status = 1;
    $J('body').removeClass('show-sidepanel');
};

var showSidePanel = function() {
    status = 0;
    $J('body').addClass('show-sidepanel');
};


// Fix stupid BattleLog that doesn't check if variables exist before it tries to update
// Which needs a loop because i've no idea how long it takes to load :/
function waitForSurface() {
    if (window.Surface) {
        console.info("Surface found!");
        Surface.Renderer.updateElement = function(replaceEl, html) {
            if(replaceEl && html) {
                replaceEl.innerHTML = Surface.Renderer.createElement(html).innerHTML;
            }
        }
        //monitorPage();
    } else {
        console.info("Waiting for Surface");
        setTimeout(function() { waitForSurface() }, 1000);
    }
}

// If we're in queue show a warning that your about to close page, ignore if we're already ingame
window.onbeforeunload = function() {
    if (unifiedgamemanager.getUgmPresence().hidden == false && unifiedgamemanager.getUgmPresence().isPlaying == false) {
        return "You are currently in a queue, leaving page or closing browser will loose your position!";
    }
};

// Starts main script
checkjQuery();

/* Checks if page has changed every 3 seconds and redos any page specific alterations
function monitorPage() {
    var lastChange = undefined;
    checkPageChange = setInterval(function() {
        if (Surface.ajaxNavigation.sequenceId != lastChange) {
            console.log("Page Changed");
            lastChange = Surface.ajaxNavigation.sequenceId;
            reAdd();
        }
    }, 3000);
}*/