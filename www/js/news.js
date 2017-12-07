
//---------------------------------------------------------------------------

function LoadNews() {

      var url = getParameter('url');

      var www = baseUrl + '/news/getnewsbyurl/' + url;

      console.log(www);
      
      var jqxhr = $.get(www)
      .done(function(data, status) {
          
          $(".fild-titulo").text(data.Titulo); 

          if(data.DestaqueId == 2)
          {
              $('.bloco-single-img').hide();
              $('.bloco-single-video').show();
              $('.fild-video').attr("src",data.VideoUrl);
          }
          else if(data.DestaqueId == 3)
          {
            $('.bloco-single-img').hide();
            $('.bloco-galeria').show();
            $('.fild-img-gallery').attr("src",data.Img);

            for (let img of data.GalleryImg)
              $('.slider-inner ul').append('<li><a class="ns-img" href="' + img + '"></a></li>');
          }
          else if(data.DestaqueId != 0)
          {
              $('.bloco-single-video').hide();
              $('.bloco-single-img').show();
              $(".fild-img").attr("src",data.Img);
          }
          
          $(".fild-published").text(data.Published);       
          $(".fild-conteudo").html(data.Conteudo);

          //Redes sociais
          $(".fild-facebook").attr('href','https://www.facebook.com/dialog/share?app_id=499593447048894&display=popup&picture=https://tarobanews.com/Assets/img/banner/social.jpg&href=https://tarobanews.com' + data.UrlFull+  '.html&redirect_uri=https://tarobanews.com' + data.UrlFull+  '.html&caption=tarobanews.com');
          $(".fild-twitter").attr('href','https://twitter.com/intent/tweet?text=' + data.ChamadaEncode + ' https://tarobanews.com' + data.UrlFull +  '.html');
          $(".fild-google-plus").attr('href','https://plus.google.com/share?url=https://tarobanews.com' + data.UrlFull +  '.html');
          $(".fild-whatsapp").attr('href','whatsapp://send?text=' + data.ChamadaEncode + '%20' +  'https://tarobanews.com' + data.UrlFull +  '.html');
          
          //Ajute de iframes
          $(".fild-conteudo").find('iframe').width('100%');
          $(".fild-conteudo").find('iframe').height('auto');

          //Fix url iframe
          $(".fild-conteudo").find('iframe').each(function() {
            var str =  $(this).attr('src');
            if (str.match("^//")) 
              $(this).attr('src', 'https:' + str)
          });

          //Fix style img
          $(".fild-conteudo").find('img').each(function() {
              $(this).removeAttr('style');
          });
          
      })
      .fail(function(e) {
        console.log(e);
        //alert("Não foi possível carregar os dados!");
      })
      .always(function() {
        CloseLoad();
      });
}

//---------------------------------------------------------------------------

//APP
var app = {  
  
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady : function ()
  {
    SetSearch();

    SetOpenList();

    LoadNews();

    CloseLoad();

    //Load
    menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
      type: 'cover'
    });		
  }
};