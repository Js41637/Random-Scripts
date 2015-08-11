// ==UserScript==
// @name        Slightly Better Battlelog
// @version     1.5
// @author      Js41637
// @match       *://battlelog.battlefield.com/bf4/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

console.info("Slighty-Better-BattleLog Loading");

// 1 = hidden, 0 = shown. Hide by default
var status = 1,
    $J;
//var checkPageChange = null;

// Inject CSS into page
console.info("Injecting CSS into page");
var css = '#community-bar{display:none}#toggle-sidepanel{position:fixed;right:-24px;transform:rotate(90deg);top:37px;background-color:rgba(0,0,0,.75);padding:10px;z-index:5000;font-size:15px;text-transform:uppercase;transition:background-color,right .2s ease-in-out;cursor:pointer}#toggle-sidepanel:hover{background-color:rgba(60,60,60,.6)}#comcenter-friends{width:0!important;transition:width .2s ease-in-out;background-color:rgba(0, 0, 0, 0.8)!important}#base-bf4-html #base-header,#base-bf4-html #unified-game-manager{right:0}#base-bf4-html #viewport{padding-right:0}#base-bf4-html #base-background{margin-left:0}.show-sidepanel #comcenter-friends{width:237px!important}.show-sidepanel #toggle-sidepanel{right:213px!important}#base-container:before{height:64px}.game-bar .battlelog-logo{position:absolute;top:0;left:30px;z-index:1000}.game-bar .battlelog-logo .logo{display:block;width:70px;height:48px;background:url(//d34ymitoc1pg7m.cloudfront.net/common/battlelog-logo-082bd9ee.png) 0 50% no-repeat;background-size:contain}#uioverlay .uioverlaysectionleft{left:20px!important}#selected-server-scoreboard .box-content{min-height:67px}#comcenter-tab-friends-content{width:237px!important}#bblog-icon{top:58px!important}#bblog-teamspeak{top:217px!important}#serverbrowser .servers-list tbody .server-row{height:63px}#base-header-secondary-nav{line-height:initial}#friendlist-header .icon-search{display:none}.show-sidepanel #friendlist-header .icon-search{display:initial}.main-header .suggestions .suggestion .image{margin:10% 0}#main-postlistsmall footer:hover{background:rgba(7,7,7,0.6)!important}.get-bfh-tile,#cookie-preferences,#serverbrowser-show .bblog-local-comment{display:none}#uioverlay{width: 100% !important;height:calc(100% + 16px)}'
    head = document.head,
    style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);

function checkjQuery() {
    if (window.jQuery) {
        console.info("jQuery loaded!");
        initialize();
    } else {
        console.info("Waiting for jQuery");
        setTimeout(function() { checkjQuery() }, 500);
    }
}

var initialize = function() {
    console.info("Waiting for BattleLog to load");
    $J = jQuery;

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
        fixBattleScreen();
        Surface.Renderer.updateElement = function(replaceEl, html) {
            if(replaceEl && html) {
                replaceEl.innerHTML = Surface.Renderer.createElement(html).innerHTML;
            }
        }
        //monitorPage();
    } else {
        console.info("Waiting for Surface");
        setTimeout(function() { waitForSurface() }, 500);
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

/* Override BattleScreens render function */
function fixBattleScreen() {
    BattleScreen.prototype.render = function(timestamp) {
        if (!bs) {
            return;
        }
        window.requestAnimationFrame(this.render.bind(this));
        var width = window.innerWidth,
            height = window.innerHeight;
        if (!S.globalContext.standalone) {
            if (S.globalContext.staticContext.detectedBrowser.isTouchDevice) {
                width = 1024;
            } if ($("#base-header").is(":visible")) {
                height -= headerHeight;
            }
        }
        if (width != this.curWinWidth || height != this.curWinHeight) {
            this.curWinWidth = width;
            this.curWinHeight = height;
            this.canvas.width = this.curWinWidth;
            this.canvas.height = this.curWinHeight;
            if (this.connection.isConnected) {
                this.minimap.calculateBounds();
            }
            this.staticNoise = null;
            this.uiOverlay.resize(this.curWinWidth, this.curWinHeight);
        }
        this.canvas.width = this.canvas.width;
        this.uiOverlay.update();
        var csize = Math.min(this.curWinWidth, this.curWinHeight);
        this.iconScale = csize / 768;
        if (this.iconScale > 1) {
            this.iconScale = 1;
        }
        this.minimap.draw(this.ctx, this.canvas.width, this.canvas.height);
        var i, len;
        for (i = 0, len = this.targets.length; i < len; ++i) {
            this.targets[i].draw();
        }
        for (i = 0; i < this.num_players; ++i) {
            if (i != this.localPlayerIdx) {
                this.players[i].draw();
            }
        }
        for (i = 0; i < this.num_vehicles; ++i) {
            this.vehicles[i].draw();
        }
        for (i = 0, len = this.chainlinks.length; i < len; ++i) {
            this.chainlinks[i].draw();
        }
        if (bs.orderAnimation) {
            bs.orderAnimation.draw();
        }
        if (this.localPlayerIdx != -1) {
            this.players[this.localPlayerIdx].draw();
        }
    };
}