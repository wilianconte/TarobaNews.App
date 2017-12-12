function LoadSearch() {
    //Recupera campo de pesquisa
    var query = getParameter('q');

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
                feed.find(".fild-news-url").attr("href", 'news.html?url=' + element.Url);
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

        LoadSearch();

        CloseLoad();

        //Load
        menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
            type: 'cover'
        });

    }
};