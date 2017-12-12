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
}

//---------------------------------------------------------------------------

function LoadBlogsList() {

  var content = $('#pg-blogs');

  var jqxhr = $.get(baseUrl + "/blog/getall")
    .done(function (data, status) {

      var model = $('.feed-model-blogs');

      $(data).each(function (index, element) {

        var feed = model.clone();

        feed.removeClass("hidden feed-model-blogs")

        feed.find(".fild-img").attr("src", element.Img);
        feed.find(".fild-blog").attr('data-type', 'blog');
        feed.find(".fild-blog").attr('data-url', element.Url);
        feed.find(".fild-titulo").text(element.Titulo);
        feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.NoticiaUrl);
        feed.find(".fild-news-titulo").text(element.NoticiaTitulo);

        content.append(feed);

      });

    })
    .fail(function () {
      alert("Não foi possível carregar os dados!");
    })
    .always(function () {
      CloseLoad();
    });
}

//---------------------------------------------------------------------------

//APP
var app = {
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function () {

    if (device.platform != 'browser')
      fcm.initialize();

    SetSearch();

    SetOpenList();

    LoadBlogsList();

    CloseLoad();

    //Load
    menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
      type: 'cover'
    });

  }
};