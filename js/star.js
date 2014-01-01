var _last_id = 0;
define('star', ["namegen"], function(Phonetics){
	
	var _gennedNames = [];
	var GENPROPS = {
		"starclasses": ["O", "B", "A", "F", "G", "K", "M"] //Morgan-keenan spectral classification: http://en.wikipedia.org/wiki/Stellar_classification#Spectral_types
	}

	var Star = function(options) {
		var default_options = {
			"name": genName(),
			"x": Math.random()*100,
			"y": Math.random()*100,
			"radius": 1+Math.random()*3,
			"id": genID(),
			"starclass": genStarClass(),
			"faction": -1
		};
		var options = jQuery.extend({}, default_options, options);
		
		return {
			"name": options.name,
			"x": options.x,
			"y": options.y,
			"radius": options.radius,
			"id": options.id,
			"starclass": options.starclass,
			"faction": options.faction,
			"_constructor_options": options
		};

		/* Private methods */ 
		function genID() { //Used during constructor
			_last_id += 1;
			return _last_id;
		}

		function genName() { //Used during constructor
			return Phonetics.UGenerate("Svfvsv");
		}

		function genStarClass() { //Used during constructor
			return GENPROPS["starclasses"][_.random(0,GENPROPS["starclasses"].length-1)];
		}
	}

	return Star;
});