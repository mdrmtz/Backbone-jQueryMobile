window.HomeView = Backbone.View.extend({

    template: _.template($('#home').html()),
    events: {
		"change #nowPlaying"  :   "nowPlayingHandler",
		"change #comingSoon"  :   "cominSoonHandler",
		"change #az"          :   "azHandler"
    },
    render: function (eventName) {
        $(this.el).html(this.template());
		this.nowPlayingHandler();
        return this;
    },
    nowPlayingHandler: function(e) {
		this.getData(0);
    },
    cominSoonHandler: function (e) {
		this.getData(1);
    },
    azHandler: function (e) {
		this.getData(2);
    },
	getData: function (id_listtype) {
		var urlServer = 'http://api.kendomobilebook.com/',
		//Request movies with ajax
			request = jQuery.ajax({
				type: "GET",
				url: urlServer + '/api/Movies/GetMovieList', //url
				data: 'listtype=' + id_listtype, //Parameter 
				cache: false,
				dataType: 'json',
			success: function (data) {//Sucess Handler
			 if (data instanceof Array){
			 //Initialize list
			 $('#movie').empty();
			 if (data.length >0){
				 //Insert values
				 $.each(data, function (i, value) {
					 $('#movie').append('<a href="#"><li class="clearfix ui-li ui-li-static ui-btn-up-c ui-corner-top">' +
										'<img src="' + value.Image + '" class="thumbnail">' +
										'<h2>' +	value.Name + '</h2><p class="desc">' +
															  	value.Genre + ',' +
															  	value.Length + ' mins ' +
															  	'<span class="rating">' + value.Rating+'</span><br/>'+
																value.LeadStars +
									    '</p></li></a>');
				  });}
			 }else{
				  switch (data.respuesta){
				  case 600://At fail response .
					//Redirect to index
					document.location = '../index.html';
				  break;
			  }
			}
		  },
		  error: function(data)
		  {
			 //In a error we shoa a message
			$('#msjError').popup( "open" );
		  }//end error
		 });//end ajax
	}
    
});

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"actionHome"
    },

    initialize:function () {
        this.firstPage = true;
    },

    actionHome:function () {
        this.changePage(new HomeView());
    },
    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }
});

$(document).ready(function () {
    app = new AppRouter();
    Backbone.history.start();
});

