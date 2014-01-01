var starmap = {};
var circlesGroup = null;
var playercirclesGroup = null;
var circles;
var phonetics;


var colors = [
	{
		"stroke": "rgba(240, 220, 100, 255)",
		"fill": "rgba(240, 220, 100, 125)"
	}
]

var _redraw;
var sampleSVG;

require(["namegen", "star", "simproperties", "starmap"], function(Phonetics, Star, SIMPROPS, Starmap) {
	phonetics = Phonetics;
	
	//var sampleSVG = null;
	var redraw;

	_redraw = function(){
		//Generate starmap
		starmap = Starmap();

		//Setup SVG
		sampleSVG = d3.select("#content svg")
		    .attr("width", SIMPROPS.IMGSIZE)
		    .attr("height", SIMPROPS.IMGSIZE)
		    .attr("style", "border: 1px solid #000;");    
		playercirclesGroup = sampleSVG.select("#pcirclesG").attr("class", "MAP-STARHIGHLIGHTS");
		linesGroup = sampleSVG.select("#linesG").attr("class", "MAP-STARLINES");
		circlesGroup = sampleSVG.select("#circlesG").attr("class", "MAP-STARS");


		//Setup scales
		var scale = d3.scale.linear()
			.domain([0,100])
			.range([0,SIMPROPS.IMGSIZE]);
		var radscale = d3.scale.linear()
			.domain([0,7])
			.range([1,10]);

		//Redraw function!
		redraw = function() {
			circles = circlesGroup.selectAll("circle.star")
			    .data(starmap["stars"], function(d) { return d["id"]});

			circles.enter()
				.append("circle")
		    		.style("stroke", "black")
		    		.attr("cx", function(d,i){return scale(d["x"])})
		    		.attr("cy", function(d,i){return scale(d["y"])})
		    		.attr("class", function(d,i){return "star starClass-" + d["starclass"]})
				.transition().duration(1000)
		    		.attr("r", function(d,i){return radscale(d["radius"])})

			circles.transition().duration(1000)
		    	.attr("r", function(d,i){return radscale(d["radius"])})
		    	.attr("cx", function(d,i){return scale(d["x"])})
		    	.attr("cy", function(d,i){return scale(d["y"])});
			    
			circles.exit().transition().duration(1000).attr("r", 0).remove();

			circles.on("mouseover", function(d){
				$("#starcontent").html(TEMPLATES["star-template"](d));
			});
			//circles.on("mouseout", function(){$("#starcontent").html("")});

			var playercircles = playercirclesGroup.selectAll("circle.star.starhighlight")
				.data(_.filter(starmap["stars"], function(star){return star.faction == 0}), function(d) { return d["id"]})

			playercircles.enter()
				.append("circle")
					.attr("class", "starhighlight")
					.attr("r", "20")
					.attr("cx", function(d,i){return scale(d["x"])})
					.attr("cy", function(d,i){return scale(d["y"])})
					.style("fill", colors[0]["fill"])
					.style("stroke", colors[0]["stroke"])
					.style("stroke-width", "5")
			playercircles.exit().transition().duration(1000).attr("r", 0).remove(); //this somehow doesnt work :|


			lines = linesGroup.selectAll("line")
				.data(starmap["links"], function(d) { return d["star1"]["id"] + "," + d["star2"]["id"]});

			lines.enter()
				.append("line")
					.attr("x1", function(d,i){return scale(d["star1"]["x"])})
					.attr("y1", function(d,i){return scale(d["star1"]["y"])})
					.attr("x2", function(d,i){return scale(d["star2"]["x"])})
					.attr("y2", function(d,i){return scale(d["star2"]["y"])})
					.style("stroke", "rgb(0,0,0,0)").style("stroke-width", "0")
				.transition().duration(1000).style("stroke", "rgb(0,0,0,100)").style("stroke-width", "2");

			lines.exit()
				.transition().duration(1000).style("stroke", "rgb(0,0,0,0)").style("stroke-width", "0")
				.remove();
		}

		//Redraw on DOM ready!
		redraw();
	}

	$(function(){   
			_redraw();	    
	});
});