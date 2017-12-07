page = 0;

//---------------------------------------------------------------------------

function SetLoadMore() {
  $('body').on('click', '#btn-veja-mais', function () {
    OpenLoad();

    page = page + 1;

    var type = getParameter('type');
    var editorial = getParameter('editorial');
    var url = getParameter('url');

    LoadOpenList(type, editorial, url);

  });
}

//---------------------------------------------------------------------------

function LoadOpenList(type, editorial, url) {

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
        if(element.DestaqueId != 0 && element.Img != 'http://cdn.tarobanews.com/uploads/noticias/')
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
        feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
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
      CloseLoad();
    });
}

//---------------------------------------------------------------------------

function LoadList() {
  var type = getParameter('type');
  var editorial = getParameter('editorial');
  var url = getParameter('url');

  LoadOpenList(type, editorial, url);
}

//---------------------------------------------------------------------------

//APP
var app = {
  initialize: function () {

    SetSearch();

    SetOpenList();

    SetLoadMore();

    LoadList();

    CloseLoad();

    //Load
    menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
      type: 'cover'
    });

  }
};