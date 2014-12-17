// ==UserScript==
// @name         Christmas Profile - Non-Steam Version
// @version      1.3.1
// @description  Client Side Christmas Themed Profile
// @author       Js41637
// @include      /^https?://steamcommunity.com/(id|profile)/
// @downloadURL https://github.com/Js41637/Userscripts/raw/master/Steam-Holiday-Profile/Christmas%20Profile%20-%20Non-Steam%20Version.user.js
// @grant        none
// ==/UserScript==

// Original code from reddit user The_MAZZTer, taken from;
// http://www.reddit.com/r/Steam/comments/2pfyyj/theme_any_profile_with_the_holiday_profile_from/

/*
 * Manual Version
 * After the christmas profiles expire, this should still work if they remove files
 */
(function() {
  /*
   * CSS Stylesheet and Classes
   */

  // Add the Holiday Themed CSS via <style>
  $J("head").append("<style>.holidayprofile .profile_header_bg{background:url(http://i.imgur.com/f9X1kgd.png) center top no-repeat;height:280px;z-index:2;max-width:1057px}.holidayprofile .profile_header_bg_texture{background:0 0}.holidayprofile_header_overlay{position:absolute;z-index:2;top:0;right:0;bottom:0;left:0;background:url('http://i.imgur.com/mCRlCEj.png') center top no-repeat;pointer-events:none}.holidayprofile .profile_header_content .btn_profile_action,.holidayprofile .profile_header_content .persona_name,.holidayprofile .profile_header_content .whiteLink{z-index:2;position:relative}.holidayprofile .profile_header_content .favorite_badge>div{z-index:2}.holidayprofile .profile_header_content .persona_name{z-index:3}.holidayprofile .profile_header_content .actual_persona_name{color:#e4ca63}.holidayprofile .profile_content{margin-top:-48px;padding-top:6px;overflow:visible}.holidayprofile .profile_rightcol{padding-top:52px}.holidayprofile .profile_customization:not(.none_selected){background:url('http://i.imgur.com/mt4EhuY.png') center -6px repeat-y;overflow:visible;margin-top:50px;margin-bottom:100px}.holidayprofile .profile_customization:not(.none_selected)::before{content:'';background:url('http://i.imgur.com/R04mrdr.png') center top no-repeat;width:664px;height:85px;position:absolute;z-index:0;left:-15px;top:-10px;display:block}.holidayprofile .profile_customization:not(.none_selected)::after{content:'';background:url('http://i.imgur.com/50sctcI.png') center bottom no-repeat;width:664px;height:85px;position:absolute;left:-15px;display:block}.holidayprofile .profile_customization:not(.none_selected) .profile_customization_header{position:relative;text-shadow:1px 1px 2px #000;margin-bottom:40px;color:#e4ca63}.holidayprofile_animation{position:absolute;background-repeat:no-repeat;z-index:10}</style>");
  // Activate the CSS on the page
  $J(".profile_page").addClass("holidayprofile");

  // Find Avatar and Online Status elements
  var iAvatar = $J(".playerAvatar.profile_header_size");
  var iOnlineStatus = $J(".profile_in_game.persona");
  // If the user is online, swap out the 'online' class for the 'golden' class
  // Only swap to the golden class when the user is 'online' and not 'offline' or 'in-game'
  // Manually adds and removes required classes, switchClass function doesn't seem to work or be supported
  if(iAvatar.hasClass("online")) {
    iAvatar.addClass("golden");
    iAvatar.removeClass("online");
  }
  if(iOnlineStatus.hasClass("online")) {
    iOnlineStatus.addClass("golden");
    iOnlineStatus.removeClass("online");
  }

  // Manually add the Holiday Profile Overlay thingy with the crystals.
  $J(".profile_header_bg_texture").append('<div class="holidayprofile_header_overlay"></div>');

  /*
   * Javascript for image animations
   */
  var g_rgAnimationDefaults = {
    height: 130,
    width: 130,
    fps: 30
  };

  var g_rgAnimations = [
    {
      image: 'http://i.imgur.com/2Oi88Ub.png',
      cols: 9,
      frames: 69
    },
    {
      image: 'http://i.imgur.com/q0eKMjl.png',
      cols: 5,
      frames: 25
    },
    {
      image: 'http://i.imgur.com/m8oUitA.png',
      cols: 9,
      frames: 78
    },
    {
      image: 'http://i.imgur.com/pfzX2C7.png',
      cols: 8,
      frames: 60
    },
    {
      image: 'http://i.imgur.com/22dqCa6.png',
      cols: 5,
      frames: 25
    },
    {
      image: 'http://i.imgur.com/omTQxEE.png',
      cols: 8,
      frames: 54
    },
    {
      image: 'http://i.imgur.com/5i2OvoX.png',
      cols: 8,
      frames: 62
    },
    {
      image: 'http://i.imgur.com/rmRYkt8.png',
      cols: 8,
      frames: 57
    },
    {
      image: 'http://i.imgur.com/f43GX1y.png',
      cols: 9,
      frames: 72
    },
    {
      image: 'http://i.imgur.com/ItiA4y6.png',
      cols: 9,
      frames: 79
    },
    {
      image: 'http://i.imgur.com/kiJlFYb.png',
      cols: 9,
      frames: 68
    },
    {
      image: 'http://i.imgur.com/MpLMSUY.png',
      cols: 8,
      frames: 59
    },
    {
      image: 'http://i.imgur.com/0wgiss6.png',
      cols: 7,
      frames: 46
    },
    {
      image: 'http://i.imgur.com/Zu8apZk.png',
      cols: 7,
      frames: 45
    }
  ];

  ANIMATION_TICK_RATE = 11;

  CAnimation = function( rgAnimation, $Parent, x, y )
  {
    this.m_rgAnimation = $J.extend( {}, g_rgAnimationDefaults, rgAnimation );
    this.m_x = x;
    this.m_y = y;

    this.m_$Element = $J('<div/>', {'class': 'holidayprofile_animation'});
    this.m_$Element.css( 'height', this.m_rgAnimation.height + 'px' );
    this.m_$Element.css( 'width', this.m_rgAnimation.width + 'px' );
    this.m_$Element.css( 'background', 'url( \'' + this.m_rgAnimation.image + '\') no-repeat');
    this.m_$Element.appendTo( $Parent );
    this.m_$Element.offset( {left: x, top: y } );
    this.m_$Element.show();

    this.m_frame = 0;
    this.m_start = 0;
    this.m_rate = 1000 / this.m_rgAnimation.fps;

    this.m_interval = 0;
  };

  CAnimation.sm_cAnimationsRunning = 0;

  CAnimation.prototype.Start = function() {
    this.m_start = $J.now();
    this.m_interval = window.setInterval( $J.proxy( this.Tick, this ), ANIMATION_TICK_RATE );
    CAnimation.sm_cAnimationsRunning++;
  };

  CAnimation.prototype.Tick = function () {
    var sElapsed = $J.now() - this.m_start;
    var iCurFrame = Math.floor( sElapsed / this.m_rate );
    if ( iCurFrame != this.m_frame )
    {
      this.m_frame = iCurFrame;
      if ( this.m_frame <= this.m_rgAnimation.frames )
      {
        var nBackgroundX = ( this.m_frame % this.m_rgAnimation.cols ) * this.m_rgAnimation.width;
        var nBackgroundY = Math.floor( this.m_frame / this.m_rgAnimation.cols ) * this.m_rgAnimation.height;
        this.m_$Element.css( 'background-position', '-' + nBackgroundX + 'px -' + nBackgroundY + 'px' );
      }
      else
      {
        this.Destroy();
      }
    }
  };

  CAnimation.prototype.Destroy = function () {
    if ( this.m_interval )
      window.clearInterval( this.m_interval );
    this.m_$Element.remove();
    CAnimation.sm_cAnimationsRunning--;
  };

  function StartAnimation()
  {
    var $Showcases = $J('.profile_customization:not(.none_selected)');
    if ( !$Showcases.length )
      return;

    AnimationForShowcase( $J( $Showcases[0] ) );

    $Showcases.click( function() {
      AnimationForShowcase( $J(this) );
    });

    window.setInterval( function() {
      if ( CAnimation.sm_cAnimationsRunning == 0 && Math.random() < 0.25 )
      {
        var nScrollY = window.scrollY;
        var nWindowHeight = $J(window).height();
        var $VisibleShowcases = $Showcases.filter( function() {
          var $Showcase = $J(this);
          var nShowcaseTop = $Showcase.offset().top;
          return nShowcaseTop >= nScrollY + 100 && nShowcaseTop < ( nScrollY + nWindowHeight );
        });
        if ( $VisibleShowcases.length )
        {
          var nShowcase = Math.floor( Math.random() * $VisibleShowcases.length );
          AnimationForShowcase( $J($VisibleShowcases[nShowcase]) );
        }
      }
    }, 1500 );
  }

  function AnimationForShowcase( $Showcase )
  {
    var nAnimation = Math.floor( Math.random() * g_rgAnimations.length );
    var pos = $Showcase.offset();
    var xpad = 100;
    var x = Math.floor( Math.random() * ( $Showcase.width() - 2 * xpad ) ) + ( xpad / 2 );
    var Animation = new CAnimation( g_rgAnimations[nAnimation], $Showcase, pos.left + x, pos.top - 120 );
    Animation.Start();
  }

  // Start the animations
  StartAnimation();
})();