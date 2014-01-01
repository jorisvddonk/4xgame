(function($) {
  $.fn.outerHTML = function() {
    return $(this).clone().wrap('<div></div>').parent().html();
  }
})(jQuery);

function showModal(inobject) {
	if (inobject.modaltype !== undefined) {
		if (inobject.modaltype === "iframe") {
			inobject.footer = $('<a href="#" class="btn" data-dismiss="modal">Close</a>');
			inobject.body = $('<div style="position: absolute;left: 3px;right: 3px;top: 3px;bottom: 3px;padding: 10px;"><div style="position: relative; left: 0px; right: 0px; top: 0px; bottom: 0px; height: auto; width: auto;"><iframe src="' 
				+ inobject.url + '" style="width:100%; height:100%; border:0px;"></iframe></div></div>');
		}
	}

	var header = $(inobject.header);
	var body = $(inobject.body);
	var footer = $(inobject.footer);
	
	var modal = $('<div class="modal hide fade" id="mainModal" style="width: 98%; padding-left: 0px; margin-left: 0px; left: 1%; top: 1%; bottom: 1%; height: auto; margin-top: 0px; margin-bottom: 0px;">\n'+
		'<div class="modal-header">\n'+
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n'+
			'<div id="mainModal_header">\n'+
				header.outerHTML() + '\n'+
			'</div>\n'+
		'</div>\n'+
		'<div class="modal-body" id="mainModal_body" style="max-height: 100%; height: auto; width: auto; bottom: 58px; top: 46px; position: absolute; left: 0%; right: 0%;">\n'+
			body.outerHTML() + '\n'+
		'</div>\n'+
		'<div class="modal-footer" id="mainModal_footer" style="bottom: 0%; position: absolute; width: auto; left: 0%; right: 0%;">\n'+
			footer.outerHTML() + '\n'+
		'</div>\n'+
	'</div>');
	
	$("body").append(modal);
	modal.on('hidden',function(){
		modal.remove();
	});
	modal.modal();
}