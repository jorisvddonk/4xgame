define('starmap', ["simproperties", "star", "namegen"], function(SIMPROPS, Star, Phonetics){
	//STARMAP constructor function. This is returned in this module...
	var Starmap = function() {
		var retMap = null;
		//Clear phonetics cache before generating
		Phonetics.clearNameCache();

		///STARMAP GENERATION ALGORITHM
		var generateStarmap = function() {
			retMap = {"stars": [], "links": [], "utils": {}};

			var reject_count = 0;
			while (retMap.stars.length < SIMPROPS.NSTARS && reject_count < SIMPROPS.MAX_NUMBER_OF_STAR_REJECTS) {
				var newStar = Star();
				//Check if star is close to another star so that we should reject it
				var dists = getClosestStars(newStar);
				if (dists.length > 0 && dists[0].dist < SIMPROPS.MIN_DISTANCE_BETWEEN_STARS) {
					reject_count = reject_count + 1
					continue; //reject it!
				}
				//Finally, add the star
				retMap.stars.push(newStar);				
			}

			//Generate links between stars. Find nearest closest stars and link them
			for (var i = 0; i < retMap.stars.length; i++) {
				var cstar = retMap.stars[i];
				var dists = getClosestStars(cstar);
				for (var ii = 0; ii < SIMPROPS.MIN_LINKS_BETWEEN_STARS; ii++) {
					retMap.links.push({"star1": cstar, "star2": dists[ii].star});
				}
			}

			//Remove duplicate links
			retMap.links = _.uniq(retMap.links, function(d){
				if (d.star1.id <= d.star2.id) {
					return d.star1.id + "|" + d.star2.id;
				} else {
					return d.star2.id + "|" + d.star1.id;
				}
			});

			var checkStarmap = function(star, allstars, numi, callback) {
				var new_numi = numi + 1;
				allstars.push(star);
				var linkeds = getLinkedStars(star);
				for (ci in linkeds) {
					var cstar = linkeds[ci];
					if (!_.contains(allstars, cstar)) {
						checkStarmap(cstar, allstars, new_numi);
					}
				}
				if (numi == 0) {
					callback(allstars);
				}
			}

			//TODO: Verify that all stars can be reached (e.g. no isolated stars exist)
			// doesn't work, I'm an idiot: //console.log("Proper starmap: " + (_.uniq(_.flatten(_.map(retMap.stars, function(star){return retMap.utils.getLinkedStars(star)}))).length == retMap.stars.length));
			checkStarmap(retMap.stars[0], [], 0, function(allstars){
				if (allstars.length == retMap.stars.length) {
					console.log("Proper map!");
				} else {
					console.log("Map contains unreachable stars! Regenerating...");
					generateStarmap(); //Herp; do it again!
				}
			});
		}

		var findPathways = function(srcstar, deststar) {
			//TODO var recursive_find = function(star, )
		}

		//UTILITY FUNCTIONS
		var getClosestStars = function(cstar) {
			var dists = _.map(_.without(retMap.stars, cstar), function(star) {
	  			return {"star": star, "dist": Math.pow(cstar.x-star.x,2) + Math.pow(cstar.y-star.y,2)}
			})
			dists = _.sortBy(dists, function(ditem) {
	  			return ditem["dist"];
	 		});
	 		return dists;
		}

		var getLinks = function(cstar) {
			return _.filter(retMap.links, function(link) {
				return (link.star1.id == cstar.id || link.star2.id == cstar.id);
			});
		}

		var getLinkedStars = function(cstar) {
			return _.map(getLinks(cstar), function(link) {
				if (link.star1.id == cstar.id) {
					return link.star2;
				}
				if (link.star2.id == cstar.id) {
					return link.star1;
				}
			});
		}

		//GENERATE THE ACTUAL STARMAP
		generateStarmap();

		//ADD utility functions to the starmap
		retMap["utils"]["getClosestStars"] = getClosestStars;
		retMap["utils"]["getLinks"] = getLinks;
		retMap["utils"]["getLinkedStars"] = getLinkedStars;

		retMap["stars"][0].faction=0;
		return retMap;
	}

	//Return the constructor function
	return Starmap;
});