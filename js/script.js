var version = 1;

function kakizomeee() {
	year = new timeBlock("year", 10, 0,100, 600,30, "#f66", false);
	month = new timeBlock("month", 31, 0,150, 600,30, "#f66");
	date = new timeBlock("day", 24, 0,200, 600,30, "#f66");
	hour = new timeBlock("hour", 24, 0,250, 600,30, "#f66");
	minute = new timeBlock("minute", 60, 0,300, 600,30, "#f66");
	second = new timeBlock("second", 60, 0,350, 600,30, "#f66");
	
	updateNow();
}

function updateNow() {
	var now = new Date();
	var years = now.getYear();
	if(years<1900) { years += 1900; }
	var months = now.getMonth() + 1;
	var dates = now.getDate();
	var days = now.getDay();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();

	year.update(years);
	month.update(months);
	date.update(dates);
	hour.update(hours);
	minute.update(minutes);
	second.update(seconds);
}

function timeBlock(name, length, x, y, width, height, color, showBlock, delay, undefined) {
	this.name = name;
	this.count = length;
	this.x = x;
	this.y = y;
	this.width = (width > 600) ? width : 600;
	this.height = height;
	this.widthL = 100;
	this.widthR = this.width - this.widthL;
	this.thickness = this.widthR / length;
	this.color = color;
	this.colorOff = "#ccc";
	this.showBlock = (showBlock == undefined) ? true : showBlock;
	this.delay = (delay == undefined) ? 250 : delay;
	this.margin = 10;

	this.ready = function() {
		var self = this;
		this.svg = d3.select("svg").append("g").attr("class", this.name);
		this.svg.append("text").attr("class", "label")
			.attr("x", this.widthL - this.margin).attr("y", this.y + this.height/1.8).attr("text-anchor", "end");
		this.svg.append("g").attr("class", "blocks").attr("width", this.widthR);

		if(!this.showBlock) { return; }
		var blocks = new Array(this.count);
		this.svg.select("g.blocks").selectAll("rect").data(blocks).enter()
			.append("rect").attr("class", "block")
			.attr("x", function(d, i) { return self.widthL + i*self.thickness - 1; })
			.attr("y", this.y)
			.attr("width", this.thickness - 2)
			.attr("height", this.height)
			.attr("fill", this.colorOff);
	}

	this.update = function(newValue) {
		var self = this;
		var oldValue = this.svg.select("g." + this.name + " text.label").text();
		if(oldValue != newValue) {
			this.svg.select("g." + this.name + " text.label")
				.transition().duration(this.delay).style("opacity", 0)
				.transition().duration(this.delay).style("opacity", 1).text(newValue);
		}

		var value = newValue * 1;
		var blocks = new Array(this.count);
		for(var i=0; i<this.count; i++) {
			blocks[i] = (i < value) ? 1 : 0;
		}
		this.svg.selectAll("g." + this.name + " rect.block")
			.transition().duration(this.delay).attr("fill", function(d, i){ return (blocks[i]) ? self.color : self.colorOff; });
	}

	this.ready();

}
