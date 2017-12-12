//Base Url
var baseUrl = "http://api.tarobanews.com";
var menuItem;

//FMC
var push = {};
var fcm = {

  initialize: function () {

    push = PushNotification.init({
      "android": {
        "icon": "tarobanews",
        "iconColor": "#297acc",
        "senderID": "392380799521",
        "sound": true,
        "vibrate": true,
        "forceShow": true
      },
      "ios": {
        "sound": true,
        "alert": true,
        "badge": true
      },
      "windows": {}
    });

    push.on('registration', function (data) {

      var oldRegId = localStorage.getItem('registrationId');

      if (oldRegId !== data.registrationId) {

        // Save new registration ID
        localStorage.setItem('registrationId', data.registrationId);

        // Subscribe
        fcm.Sub('news')

      }
    });

    push.on('notification', function (data) {

      if (data.additionalData)
        if (!data.additionalData.foreground)
          window.location = 'news.html?url=' + data.additionalData.url;
    });

    push.on('error', function (e) {
      //alert('push error:' + e.message);
    });
  },
  Sub: function (topic) {
    push.subscribe(topic, function () {
      //alert(topic + ' sucesso!')
    },
      function (e) {
        //alert('subscribe error:' + e);
      });
  },
  UnSub: function (topic) {
    push.unsubscribe(topic, () => {
      //alert(topic + ' sucesso!')
    }, (e) => {
      //alert('unsubscribe error:' + e);
    });
  }
}
//---------------------------------------------------------------------------

function getParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

//---------------------------------------------------------------------------

function OpenLoad() {

    window.scrollTo(0, 0);

    $('.box-load').show();

    //Oculta todas as páginas 
    //$('.page').hide();

}

//---------------------------------------------------------------------------

function CloseLoad() {

    setTimeout(function () {
        $('.box-load').fadeOut("slow", function () {
            // Animation complete.
        });
    }, 2000);
}

//---------------------------------------------------------------------------

function SetTapEffect() {
    $('a.tap').on('touchstart', function (e) {
        $(this).addClass('tapped');
    });

    $('a.tap').on('touchend', function (e) {
        $(this).removeClass('tapped');
    });
}

//---------------------------------------------------------------------------

function SetSearch() {

    $(".lupa").on("click", function (e) {
        e.preventDefault();
        $(".box-pesquisa").show();
        $(".fild-search").focus();
    });

    $(".botao-fechar").on("click", function (e) {
        e.preventDefault();
        $(".box-pesquisa").hide();
    });

    $(".trigger-search").on('click', function (e) {

        window.location = 'search.html?q=' + $(".fild-search").val();

    });
}

//---------------------------------------------------------------------------  

function SetOpenList() {

    $('body').on('click', '.link-menu, .fild-hat, .fild-blog', function (e) {

        e.preventDefault();

        var type = $(this).data('type');
        var editorial = $(this).data('editorial');
        var url = $(this).data('url');

        var www = 'list.html?type=' + type;

        if (editorial != null)
            www += '&editorial=' + editorial;

        if (url != null)
            www += '&url=' + url;

        window.location = www;

    });

    $('body').on('click', '.link-blogs', function (e) {

        e.preventDefault();

        window.location = 'blogs.html';

    });

}

 //---------------------------------------------------------------------------   

