var TEMPLATES = {};
$(function(){
	$('script[type="text/x-handlebars-template"]').each(function(a,b){
		TEMPLATES[$(b).attr('id')] = Handlebars.compile($(b).html());
	});
});