var news = {};

function LoadNews() {

      var url = getParameter('url');

      var www = baseUrl + '/news/getnewsbyurl/' + url;

      console.log(www);
      
      var jqxhr = $.get(www)
      .done(function(data, status) {

          //Set data
          news.subject = 'Tarobá News - ' + data.Titulo;
          news.url = 'https://tarobanews.com' + data.UrlFull +  '.html';
          
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

function Share (){
    
  // this is the complete list of currently supported params you can pass to the plugin (all optional)
  var options = {
    subject: news.subject, // fi. for email
    url: news.url,
    chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
  }
  
  var onSuccess = function(result) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }
  
  var onError = function(msg) {
    console.log("Sharing failed with message: " + msg);
  }
  
  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);    
}

//---------------------------------------------------------------------------

//APP
var app = {  
  
  initialize: function () {

    SetSearch();
    
    SetOpenList();

    LoadNews();

    CloseLoad();

    $(".fild-share").on("click", function (e) {
      
      e.preventDefault();

      Share();

    });
    

    //Load
    menuItem = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
      type: 'cover'
    });		

  }
};