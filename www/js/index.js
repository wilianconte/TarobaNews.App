var baseUrl = "http://api.tarobanews.com";
var menuItem;
var push = {};
var page = 0;
var mypah = [];
var news = {};
var isInitial = true;
var isPush = false;

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

        if (!data.additionalData.foreground) {

          LoadNewsPage(data.additionalData.url);
          mypah.push({ page: 'news', url: data.additionalData.url });
          history.pushState(null, null, '/news/' + data.additionalData.url)

        }
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

var fcm2 = {
  initialize: function () {

    //FCMPlugin.getToken( successCallback(token), errorCallback(err) );
    //Keep in mind the function will return null if the token has not been established yet.
    FCMPlugin.getToken(function (token) {
      //alert(token);
    });

    //FCMPlugin.onTokenRefresh( onTokenRefreshCallback(token) );
    //Note that this callback will be fired everytime a new token is generated, including the first time.
    FCMPlugin.onTokenRefresh(function (token) {
      //alert(token);
    });

    //FCMPlugin.subscribeToTopic( topic, successCallback(msg), errorCallback(err) );
    //All devices are subscribed automatically to 'all' and 'ios' or 'android' topic respectively.
    //Must match the following regular expression: "[a-zA-Z0-9-_.~%]{1,900}".
    FCMPlugin.subscribeToTopic('news');

    //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
    //Here you define your application behaviour based on the notification data.

    FCMPlugin.onNotification(function (data) {

      isPush = true;

      if (data.wasTapped) {
        LoadNewsPage(data.url);
        mypah.push({ page: 'news', url: data.url });
        history.pushState(null, null, '/news/' + data.url)
      }
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

function OpenLoad(callback) {

  //set scroll to top
  window.scrollTo(0, 0);

  //open load modal
  $('.box-load').fadeIn(500, function () {
    HideAll(callback);
  });
}

//---------------------------------------------------------------------------

function HideAll(callback) {

  if (!isInitial) {
    $('.page').hide();
    $('.barra-estado').hide();
    $('.barra-titulo-editorial').hide();
    $('.fild-lupa').hide();
    $('.fild-share').hide();
    $('.bloco-galeria').hide();
    $('.bloco-single-img').hide();
    $('.bloco-single-video').empty();
    $('.bloco-single-video').hide();
  }
  else {
    isInitial = false;
  }

  callback();
}

async function CloseLoad(callback) {

  callback();

  setTimeout(function () {
    $('.box-load').fadeOut(1000, function () {
    });
  }, 1000);
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

  $(".fild-lupa").on("click", function (e) {
    e.preventDefault();
    $(".box-pesquisa").show();
    $(".fild-search").focus();
  });

  $(".botao-fechar").on("click", function (e) {
    e.preventDefault();
    $(".box-pesquisa").hide();
  });

  $(".trigger-search").on('click', function (e) {

    e.preventDefault();

    var query = $(".fild-search").val();

    $(".fild-search").val('');

    $(".box-pesquisa").hide();

    LoadSearchPage(query);

    mypah.push({ page: 'search', query: query });

    history.pushState(null, null, '/busca?q=' + query);

  });
}

//---------------------------------------------------------------------------  

function SetOpenList() {

  $('body').on('click', '.link-blogs', function (e) {

    e.preventDefault();

    closeMe();

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

    closeMe();

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

  $('.link-go-home').on('touchend', function (e) {

    e.preventDefault();

    var length = history.length;
    history.go(-length);

    history.replaceState(null, null, '/')
    mypah = [{ page: 'home' }];

    OpenLoad(function () {

      CloseLoad(function () {

        $('.fild-lupa').show();
        $('.barra-estado').show();
        $('#pg-home').show();

      });
    });
  });

  $('.link-home').on('touchend', function () {
    var homeId = $(this).data('home');
    SetHome(homeId);
  });
}

//---------------------------------------------------------------------------

function SetHome(homeId) {

  OpenLoad(function () {

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

          if (!isPush) {
            $('.fild-lupa').show();
            $('.barra-estado').show();
            $('#pg-home').show();
          }
          else {
            isPush = false;
          }

        });
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
      feed.find(".fild-blog-titulo").text(element.Titulo);

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

  OpenLoad(function () {

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
          $('.fild-lupa').show();
          $('.barra-titulo-editorial').show();
          $('#pg-blogs').show();
        });
      });

  });
}

//---------------------------------------------------------------------------

function SetLoadMore() {

  $('body').on('click', '#btn-veja-mais', function (e) {

    e.preventDefault();

    page = page + 1;

    var last = mypah[mypah.length - 1];

    var type = last.type;
    var editorial = last.editorial;
    var url = last.url;

    LoadListPage(type, editorial, url);

  });
}

//---------------------------------------------------------------------------

function LoadListPage(type, editorial, url) {

  OpenLoad(function () {
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

        var content = $('.feed-pg-list');

        content.empty();

        var model = $('.feed-model');
        var model_img = $('.feed-model-img');

        $(".fild-page-title").text(data.Titulo);

        if (data.News.length < 21)
          $('#btn-veja-mais').hide();
        else
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
          $('.fild-lupa').show();
          $('.barra-titulo-editorial').show();
          $('#pg-list').show();
        });
      });
  });
}

//---------------------------------------------------------------------------

function LoadNewsPage(url) {

  OpenLoad(function () {

    var www = baseUrl + '/news/getnewsbyurl/' + url;

    var jqxhr = $.get(www)
      .done(function (data, status) {

        //Set data
        news.subject = 'Tarobá News - ' + data.Titulo;
        news.url = 'https://tarobanews.com' + data.UrlFull + '.html';

        $(".fild-titulo").text(data.Titulo);

        if (data.DestaqueId == 2) {
          $('.bloco-single-video').html("<iframe class='fild-video' width='100%' src='" + data.VideoUrl + "' frameborder='0' gesture='media' allowfullscreen></iframe>");
          $('.bloco-single-video').show();
        }
        else if (data.DestaqueId == 3) {

          $('.fild-img-gallery').attr("src", data.Img);

          for (let img of data.GalleryImg)
            $('.slider-inner ul').append('<li><a class="ns-img" href="' + img + '"></a></li>');

          $('.bloco-galeria').show();
        }
        else if (data.DestaqueId != 0) {
          $('.bloco-single-img').show();
          $(".fild-news-img").attr("src", data.Img);
        }

        $(".fild-news-published").text(data.Published);
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

function LoadSearchPage(query) {

  OpenLoad(function () {
    $(".fild-page-title").text('Busca: ' + query);

    //Efetua a busa por dados na API
    var jqxhr = $.get(baseUrl + "/news/getnewsbysearch/" + query)
      .done(function (data, status) {

        //Recupera o container de pesquisa
        var content = $('.feeds-search');

        //Limpa container com os resultados da pesquisa
        content.empty();

        $(data.News).each(function (index, element) {

          var type = 'category';
          var hat = element.Categoria
          var hatUrl = element.CategoryUrl

          if (element.BlogUrl != null) {
            type = 'blog';
            hat = element.Blog;
            hatUrl = element.BlogUrl;
          }

          var model = $('.feed-model');
          var model_img = $('.feed-model-img');

          var feed = element.DestaqueId != 0 ?
            model_img.clone().removeClass("hidden feed-model-img") :
            model.clone().removeClass("hidden feed-model");

          feed.find(".fild-img").attr("src", element.Img);

          //feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
          feed.find(".fild-news-url").attr('data-url', element.Url);

          feed.find(".fild-news-titulo").text(element.Titulo);
          feed.find(".fild-hat").attr('data-type', type);
          feed.find(".fild-hat").attr('data-editorial', element.EditorialUrl);
          feed.find(".fild-hat").attr('data-url', hatUrl);
          feed.find(".fild-hat").text(hat).addClass("sublinhado-" + element.EditorialUrl);;
          feed.find(".fild-published").text(element.Published);

          content.append(feed);

        });

      })
      .fail(function () {
        alert("Não foi possível carregar os dados!");
      })
      .always(function () {
        CloseLoad(function () {
          $('.fild-lupa').show();
          $('.barra-titulo-editorial').show();
          $('#pg-search').show();
        });
      });
  });
}

//---------------------------------------------------------------------------

function closeMe() {
  var container = $('#mp-pusher');
  if (container.hasClass("mp-pushed")) {
    menuItem._resetMenu();
  }
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
            OpenLoad(function () {
              CloseLoad(function () {
                $('.fild-lupa').show();
                $('.barra-estado').show();
                $('#pg-home').show();
              });
            });
            break;
          }
        case 'blogs':
          {
            LoadBlogsPage();
            break;
          }
        case 'list':
          {
            LoadListPage(last.type, last.editorial, last.url);
            break
          }
        case 'search':
          {
            LoadSearchPage(last.query);
            break;
          }
      }
    };
  },
  onDeviceReady: function () {

    if (device.platform != 'browser') {
      fcm.initialize();
      fcm2.initialize();
    }

    SetTapEffect();

    SetLinkHome();

    SetSearch();

    SetOpenList();

    SetLoadMore();

    $(".fild-share").on("click", function (e) {

      e.preventDefault();

      Share();

    });

    SetHome(null);

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