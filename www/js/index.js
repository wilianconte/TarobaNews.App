//---------------------------------------------------------------------------

function SetLinkHome() {
  $('.link-home').on('touchend', function () {

    var homeId = $(this).data('home');

    SetHome(homeId, true);

  });
}

//---------------------------------------------------------------------------

function SetHome(homeId, showLoad) {

  //Atribui home padrão
  if (homeId == null)
    homeId = 1; //Cascavel

  //Recupera a home salva
  var localHomeId = localStorage.getItem('homeId');

  //Caso não tenha uma home atribue a home padrão
  if (localHomeId == null)
    localStorage.setItem('homeId', homeId);

  //Salva a ultima home
  if (localHomeId != homeId)
    localStorage.setItem('homeId', homeId);

  if (showLoad || showLoad == null) {
    OpenLoad();
    $('#pg-home').show();
  }

  $('.link-home').removeClass('active');
  $('.link-home[data-home=' + homeId + ']').addClass('active');

  var jqxhr = $.get(baseUrl + "/home/get/" + homeId).done(function (data, status) {

    var content = $('.feeds-highlights');
    
    content.empty();

    //Highlights
    $(data.ListHighlights).each(function (index, element) {

      var model = $('.feed-model');
      var model_img = $('.feed-model-highlight');

      var type = 'category';

      var hat = element.Categoria
      var hatUrl = element.CategoryUrl

      if (element.BlogUrl != null) {
        type = 'blog';
        hat = element.Blog;
        hatUrl = element.BlogUrl;
      }

      var feed = element.DestaqueId != 0 ?
        model_img.clone().removeClass("hidden feed-model-highlight") :
        model.clone().removeClass("hidden feed-model")

      //Caso seja do típo video
      if(element.DestaqueId == 2)
        feed.find(".fild-icon-video").show();

      feed.find(".fild-img").attr("src", element.Img);
      feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-titulo").text(element.Titulo);
      feed.find(".fild-hat").attr('data-type', type);
      feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
      feed.find(".fild-hat").attr('data-url', hatUrl);
      feed.find(".fild-hat").text(hat).addClass("sublinhado-" + element.EditorialUrl);
      feed.find(".fild-published").text(element.Published);

      content.append(feed);
    });

    //-----------------------------------------------------------------------

    var content = $('.feeds-noticia');
    content.empty();

    //Notícia
    $(data.ListNewsNoticias).each(function (index, element) {


      var model = $('.feed-model-img');
      var feed = model.clone();

      feed.removeClass("hidden feed-model-img")
      feed.find(".fild-img").attr("src", element.Img);
      feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-titulo").text(element.Titulo);
      feed.find(".fild-hat").attr('data-type', 'category');
      feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
      feed.find(".fild-hat").attr('data-url', element.CategoryUrl);
      feed.find(".fild-hat").text(element.Categoria).addClass("sublinhado-" + element.EditorialUrl);
      feed.find(".fild-published").text(element.Published);

      content.append(feed);
    });

    //-----------------------------------------------------------------------

    var content = $('.feeds-esporte');
    content.empty();

    //Esportes
    $(data.ListNewsEsportes).each(function (index, element) {

      var model = $('.feed-model-img');
      var feed = model.clone();

      feed.removeClass("hidden feed-model-img")
      feed.find(".fild-img").attr("src", element.Img);
      feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-titulo").text(element.Titulo);
      feed.find(".fild-hat").attr('data-type', 'category');
      feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
      feed.find(".fild-hat").attr('data-url', element.CategoryUrl);
      feed.find(".fild-hat").text(element.Categoria).addClass("sublinhado-" + element.EditorialUrl);

      feed.find(".fild-published").text(element.Published);

      content.append(feed);
    });

    //-----------------------------------------------------------------------

    var content = $('.feeds-entretenimento');
    content.empty();

    //Esportes
    $(data.ListNewsEntretenimento).each(function (index, element) {

      var model = $('.feed-model-img');
      var feed = model.clone();

      feed.removeClass("hidden feed-model-img")

      feed.find(".fild-img").attr("src", element.Img);
      feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-titulo").text(element.Titulo);
      feed.find(".fild-hat").attr('data-type', 'category');
      feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
      feed.find(".fild-hat").attr('data-url', element.CategoryUrl);
      feed.find(".fild-hat").text(element.Categoria).addClass("sublinhado-" + element.EditorialUrl);
      feed.find(".fild-published").text(element.Published);

      content.append(feed);
    });

    //Carrega o módulo de blogs
    LoadBlogs(homeId);

    //Seta o evento de carregar listas
    SetOpenList();

  })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })
    .always(function () {
      CloseLoad();
    });
}

//---------------------------------------------------------------------------

function LoadBlogs(homeId) {
  var jqxhr = $.get(baseUrl + "/blog/getall/" + homeId).done(function (data, status) {

    var content = $('.feeds-blogs');
    var model = $('.feed-model-blog');

    var first = true;

    //Blogs
    $(data).each(function (index, element) {
      var feed = model.clone();

      feed.removeClass("hidden feed-model-blog");

      if (first) {
        feed.addClass('active')
        first = false;
      }

      feed.find(".fild-img").attr("src", element.Img).addClass('center-block');
      feed.find(".fild-blog").data('type','blog');
      feed.find(".fild-blog").data('url',element.Url);      
      feed.find(".fild-titulo").text(element.Titulo);
      feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.NoticiaUrl);
      feed.find(".fild-news-titulo").text(element.NoticiaTitulo);

      content.append(feed);
    });


  })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })

  $('#itemslider').carousel({ interval: 3000 });

  $('.carousel-showmanymoveone .item').each(function () {

    var itemToClone = $(this);

    for (var i = 1; i < 6; i++) {
      itemToClone = itemToClone.next();

      if (!itemToClone.length) {
        itemToClone = $(this).siblings(':first');
      }

      itemToClone.children(':first-child').clone()
        .addClass("cloneditem-" + (i))
        .appendTo($(this));
    }
  });
}

//---------------------------------------------------------------------------

//APP
var app = {

    initialize: function () {
    
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener("online", this.onDeviceOnline, false);
      document.addEventListener("offline", this.onDeviceOffline, false);
      document.addEventListener("pause", this.onPause, false);
      document.addEventListener("resume", this.onResume, false);
  },
  onDeviceReady : function ()
  {
      SetTapEffect();
    
      SetLinkHome();
  
      SetSearch();
  
      SetOpenList();
  
      SetHome(null, false);
  
      CloseLoad();
  
      //Load
      menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
        type: 'cover'
      });

      if(device.platform != 'browser')
        fcm.initialize();
          
  },
  onDeviceOnline: function () {
    //alert('On!');
  },
  onDeviceOffline: function () {
    //alert('Off!');
  },
  onPause : function(){
    //alert('pause!');
  },
  onResume : function(){
    //alert('resume!');
  }
};

//FMC
var push = {};
var fcm = {

  initialize: function () {

    //alert('init');

    push = PushNotification.init({
      "android": {
        "icon": "tarobanews",
        "iconColor": "#297acc",
        "senderID" :  "392380799521",
        "sound" : true,
        "vibrate" : true,
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
        fcm.Sub('news-ios')

      }
    });

    push.on('notification', function (data) {

      navigator.notification.alert(
        data.message,         // message
        null,                 // callback
        data.title,           // title
        'Ok'                  // buttonName
      );

    });

    push.on('error', function (e) {
      //alert('push error:' + e.message);
    });
  },
  Sub : function (topic)
  {
    push.subscribe(topic, function () { 
      //alert(topic  + ' sucesso!')
    },
    function (e) {
      //alert('subscribe error:' + e);
    });

  },
  UnSub : function (topic)
  {
    push.unsubscribe(topic, () => {
      //alert(topic  + ' sucesso!')      
    }, (e) => {
      //alert('unsubscribe error:' + e);
    });
  }
}