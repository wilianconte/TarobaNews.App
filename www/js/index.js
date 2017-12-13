var baseUrl = "http://api.tarobanews.com";
var menuItem;
var push = {};
var page = 0;
var mypah = [];
var news = {};

//FMC
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

  //set scroll to top
  window.scrollTo(0, 0);

  //open load modal
  $('.box-load').show();

  //hide all pages
  $('.page').hide();
  $('.barra-estado').hide();
  $('.barra-titulo-editorial').hide();
  $('.botao-veja-mais-rodape').hide();
  $('.fild-img-gallery').hide();
  $('.fild-lupa').hide();
  $('.fild-share').hide();
}

//---------------------------------------------------------------------------

function CloseLoad(callback) {

  if (callback)
    callback();

  setTimeout(function () {
    $('.box-load').fadeOut("slow", function () {

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

  console.log('SetOpenList');

  $('body').on('click', '.link-blogs', function (e) {

    e.preventDefault();

    LoadBlogsPage();

    mypah.push({ page: 'blogs' });

    history.pushState(null, null, '/blog');

  });

  $('body').on('click', '.fild-blog', function (e) {

    e.preventDefault();

    var url = $(this).data('url');

    LoadListPage('blog', null, url);

    mypah.push({ page: 'list', type: 'blog', url: url });

    history.pushState(null, null, '/blog/' + url)

  });

  $('body').on('click', '.link-menu, .fild-hat', function (e) {

    e.preventDefault();

    var type = $(this).data('type');
    var editorial = $(this).data('editorial');
    var url = $(this).data('url');

    LoadListPage(type, editorial, url);

    mypah.push({ page: 'list', type: type, editorial: editorial, url: url });

    if (url == null)
      url = '';

    history.pushState(null, null, '/' + editorial + '/' + url)

  });

  $('body').on('click', '.fild-news-url', function (e) {

    e.preventDefault();

    var url = $(this).data('url');

    LoadNewsPage(url);

    mypah.push({ page: 'news', url: url });

    history.pushState(null, null, '/news/' + url)

  });
}

//---------------------------------------------------------------------------

function SetLinkHome() {
  $('.link-home').on('touchend', function () {

    var homeId = $(this).data('home');

    SetHome(homeId, true);

  });
}

//---------------------------------------------------------------------------

function SetHome(homeId, showLoad) {

  //Recupera a home salva
  var localHomeId = localStorage.getItem('homeId');

  //Atribui home padrão
  if (homeId == null && localHomeId != null)
    homeId = localHomeId; //

  //Atribui home padrão
  if (homeId == null)
    homeId = 1; //Cascavel

  //Caso não tenha uma home atribue a home padrão
  if (localHomeId == null)
    localStorage.setItem('homeId', homeId);

  //Salva a ultima home
  if (localHomeId != homeId)
    localStorage.setItem('homeId', homeId);

  if (showLoad || showLoad == null) {
    OpenLoad();
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
      if (element.DestaqueId == 2)
        feed.find(".fild-icon-video").show();

      feed.find(".fild-img").attr("src", element.Img);

      //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-url").attr('data-url', element.Url);

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

      //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-url").attr('data-url', element.Url);

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

      //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-url").attr('data-url', element.Url);

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

      //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-url").attr('data-url', element.Url);

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

  })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })
    .always(function () {
      CloseLoad(function () {
        $('.barra-estado').show();
        $('#pg-home').show();
      });
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
      feed.find(".fild-blog").data('url', element.Url);
      feed.find(".fild-titulo").text(element.Titulo);

      //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
      feed.find(".fild-news-url").attr('data-url', element.Url);

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

function LoadBlogsPage() {

  OpenLoad();

  $(".fild-page-title").text('Blogs');

  var content = $('#pg-blogs');

  var jqxhr = $.get(baseUrl + "/blog/getall")
    .done(function (data, status) {

      var model = $('.feed-model-blogs');

      $(data).each(function (index, element) {

        var feed = model.clone();

        feed.removeClass("hidden feed-model-blogs")

        feed.find(".fild-img").attr("src", element.Img);
        feed.find(".fild-blog").attr('data-url', element.Url);
        feed.find(".fild-titulo").text(element.Titulo);

        //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
        feed.find(".fild-news-url").attr('data-url', element.Url);

        feed.find(".fild-news-titulo").text(element.NoticiaTitulo);

        content.append(feed);

      });

    })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })
    .always(function () {
      CloseLoad(function () {
        $('.barra-titulo-editorial').show();
        $('#pg-blogs').show();
      });
    });
}

//---------------------------------------------------------------------------

function SetLoadMore() {

  $('body').on('click', '#btn-veja-mais', function () {

    OpenLoad();

    page = page + 1;

    var type = getParameter('type');
    var editorial = getParameter('editorial');
    var url = getParameter('url');

    LoadListPage(type, editorial, url);

  });
}

//---------------------------------------------------------------------------

function LoadListPage(type, editorial, url) {

  OpenLoad();

  var www = '';

  if (type == "blog")
    www = baseUrl + '/blog/getnewsbyblog/' + url;
  else if (type == "editorial")
    www = baseUrl + '/news/getnewsbyeditorial/' + editorial;
  else if (type == 'category')
    www = baseUrl + '/news/getnewsbycategory/' + editorial + '/' + url;

  www = www + '/?&p=' + page;

  var jqxhr = $.get(www)
    .done(function (data, status) {

      var content = $('#pg-list');

      content.empty();

      var model = $('.feed-model');
      var model_img = $('.feed-model-img');

      $(".fild-page-title").text(data.Titulo);

      if (data.News.length >= 21)
        $('#btn-veja-mais').show();

      for (let element of data.News) {

        var feed = model.clone().removeClass("hidden feed-model-img");

        //Fix image empy
        if (element.DestaqueId != 0 && element.Img != 'http://cdn.tarobanews.com/uploads/noticias/')
          feed = model_img.clone().removeClass("hidden feed-model");

        var type = 'category';
        var hat = element.Categoria
        var hatUrl = element.CategoryUrl

        if (element.BlogUrl != null) {
          type = 'blog';
          hat = element.Blog;
          hatUrl = element.BlogUrl;
        }

        feed.find(".fild-img").attr("src", element.Img);

        //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
        feed.find(".fild-news-url").attr('data-url', element.Url);

        feed.find(".fild-news-titulo").text(element.Titulo);

        feed.find(".fild-hat").attr('data-type', type);
        feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
        feed.find(".fild-hat").attr('data-url', hatUrl);
        feed.find(".fild-hat").text(element.Categoria).addClass("sublinhado-" + editorial);

        feed.find(".fild-published").text(element.Published);

        content.append(feed);

      }
    })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })
    .always(function () {
      CloseLoad(function () {
        $('.barra-titulo-editorial').show();
        $('#pg-list').show();
      });
    });
}

//---------------------------------------------------------------------------

function LoadNewsPage(url) {


  OpenLoad();

  var www = baseUrl + '/news/getnewsbyurl/' + url;

  var jqxhr = $.get(www)
    .done(function (data, status) {

      //Set data
      news.subject = 'Tarobá News - ' + data.Titulo;
      news.url = 'https://tarobanews.com' + data.UrlFull + '.html';

      $(".fild-titulo").text(data.Titulo);

      if (data.DestaqueId == 2) {
        $('.bloco-single-img').hide();
        $('.bloco-single-video').show();
        $('.fild-video').attr("src", data.VideoUrl);
      }
      else if (data.DestaqueId == 3) {
        $('.bloco-single-img').hide();
        $('.bloco-galeria').show();
        $('.fild-img-gallery').attr("src", data.Img);

        for (let img of data.GalleryImg)
          $('.slider-inner ul').append('<li><a class="ns-img" href="' + img + '"></a></li>');
      }
      else if (data.DestaqueId != 0) {
        $('.bloco-single-video').hide();
        $('.bloco-single-img').show();
        $(".fild-news-img").attr("src", data.Img);
      }

      $(".fild-published").text(data.Published);
      $(".fild-conteudo").html(data.Conteudo);

      //Redes sociais
      $(".fild-facebook").attr('href', 'https://www.facebook.com/dialog/share?app_id=499593447048894&display=popup&picture=https://tarobanews.com/Assets/img/banner/social.jpg&href=https://tarobanews.com' + data.UrlFull + '.html&redirect_uri=https://tarobanews.com' + data.UrlFull + '.html&caption=tarobanews.com');
      $(".fild-twitter").attr('href', 'https://twitter.com/intent/tweet?text=' + data.ChamadaEncode + ' https://tarobanews.com' + data.UrlFull + '.html');
      $(".fild-google-plus").attr('href', 'https://plus.google.com/share?url=https://tarobanews.com' + data.UrlFull + '.html');
      $(".fild-whatsapp").attr('href', 'whatsapp://send?text=' + data.ChamadaEncode + '%20' + 'https://tarobanews.com' + data.UrlFull + '.html');

      //Ajute de iframes
      $(".fild-conteudo").find('iframe').width('100%');
      $(".fild-conteudo").find('iframe').height('auto');

      //Fix url iframe
      $(".fild-conteudo").find('iframe').each(function () {
        var str = $(this).attr('src');
        if (str.match("^//"))
          $(this).attr('src', 'https:' + str)
      });

      //Fix style img
      $(".fild-conteudo").find('img').each(function () {
        $(this).removeAttr('style');
      });

    })
    .fail(function (e) {
      console.log({ action: 'LoadNewsPage', err: e });
    })
    .always(function () {
      CloseLoad(function () {
        $('.fild-share').show();
        $('#pg-news').show();
      });
    });
}

//---------------------------------------------------------------------------

function Share() {

  // this is the complete list of currently supported params you can pass to the plugin (all optional)
  var options = {
    subject: news.subject, // fi. for email
    url: news.url,
    chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
  }

  var onSuccess = function (result) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }

  var onError = function (msg) {
    console.log("Sharing failed with message: " + msg);
  }

  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

//---------------------------------------------------------------------------

//APP
var app = {

  initialize: function () {

    console.log('initialize');

    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("online", this.onDeviceOnline, false);
    document.addEventListener("offline", this.onDeviceOffline, false);
    document.addEventListener("pause", this.onPause, false);
    document.addEventListener("resume", this.onResume, false);

    window.onload = function () {
      history.replaceState(null, null, '/')
      mypah.push({ page: 'home' });
    }

    window.onpopstate = function (event) {

      $('.grupo-footer').focus();

      //remove last iten
      mypah.pop();

      var last = mypah[mypah.length - 1];

      switch (last.page) {
        case 'home':
          {
            OpenLoad();
            CloseLoad(function () {
              $('.barra-estado').show();
              $('#pg-home').show();
            });
            break;
          }
        case 'blogs':
          {
            LoadBlogsPage();
            break;
          }
      }
    };
  },
  onDeviceReady: function () {

    console.log('onDeviceReady');

    if (device.platform != 'browser')
      fcm.initialize();

    SetTapEffect();

    SetLinkHome();

    SetSearch();

    SetOpenList();

    SetLoadMore();

    $(".fild-share").on("click", function (e) {

      e.preventDefault();

      Share();

    });


    SetHome(null, false);

    //Load
    menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
      type: 'cover'
    });

  },
  onDeviceOnline: function () {
    //alert('On!');
  },
  onDeviceOffline: function () {
    //alert('Off!');
  },
  onPause: function () {
    //alert('pause!');
  },
  onResume: function () {
    //alert('resume!');
  }
};