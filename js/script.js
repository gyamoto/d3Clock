function ready() {
	year = new timeBlock("year", 10, 0,100, 600,30, "#f66", false);
	month = new timeBlock("month", 31, 0,150, 600,30, "#f66");
	date = new timeBlock("day", 24, 0,200, 600,30, "#f66");
	hour = new timeBlock("hour", 24, 0,250, 600,30, "#f66");
	minute = new timeBlock("minute", 60, 0,300, 600,30, "#f66");
	second = new timeBlock("second", 60, 0,350, 600,30, "#f66");
	
	update();
}

function update() {
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
	date.update(dates, month);
	hour.update(hours, date);
	minute.update(minutes, hour);
	second.update(seconds, minute);
}

function timeBlock(name, length, x, y, width, height, color, showBlock, delay, undefined) {
	this.name = name;
	this.credit = name;
	this.count = length;
	this.x = x;
	this.y = y;
	this.width = (width > 600) ? width : 600;
	this.height = height;
	this.widthL = 100;
	this.widthR = this.width - this.widthL;
	this.value = 0;
	this.thickness = this.widthR / length;
	this.color = color;
	this.colorOff = "#ccc";
	this.showBlock = (showBlock == undefined) ? true : showBlock;
	this.delay = (delay == undefined) ? 250 : delay;
	this.margin = 10;
	this.marginCredit = 10;

	this.ready = function() {
		var self = this;
		this.svg = d3.select("svg").append("g").attr("class", this.name);
		this.svg.append("text").attr("class", "label")
			.attr("x", this.widthL - this.margin - this.marginCredit).attr("y", this.y + this.height/1.5).attr("text-anchor", "end");
		this.svg.append("text").attr("class", "label credit")
			.attr("x", this.widthL - this.margin).attr("y", this.y + this.height/1.8).attr("text-anchor", "middle")
			.attr("writing-mode", "tb").text(this.credit);
		this.svg.append("g").attr("class", "blocks").attr("width", this.widthR);
	};this.ready();

	this.update = function(newValue, carryBlock, undefined) {
		var self = this;
		var oldValue = this.svg.select("g." + this.name + " text.label").text();
		var svg = this.svg.select("g." + this.name);
		if(oldValue=="" ||  oldValue != newValue) {
			this.value = newValue;
			this.svg.select("g." + this.name + " text.label")
				.transition().duration(this.delay).ease("quad").style("opacity", 0)
				.transition().duration(this.delay).ease("circle").style("opacity", 1).text(newValue);
		}

		if(!this.showBlock) { return; }

		var value = newValue - 0;
		var blocks = new Array(value);
		for(var i=0; i<value; i++) { blocks[i] = i; }

		if(carryBlock == undefined) { carryBlock = {x:this.widthL, y:this.y, width:this.width, height:this.height}; }
		var remoyeXYWH = [carryBlock.widthL + carryBlock.value*carryBlock.thickness , carryBlock.y, carryBlock.width, carryBlock.height];
		this.svg.selectAll("g." + this.name + " rect.block")
			.data(blocks, function(d) { return d; })
			.exit().transition()
				.attr("x", remoyeXYWH[0] ).attr("y", remoyeXYWH[1]).attr("height", remoyeXYWH[3])
				.attr("width", 0)
				.remove();
		this.svg.selectAll("g." + this.name + " rect.block")
			.data(blocks, function(d) { return d; })
			.enter().append("rect").attr("class", "block")
				.attr("x", function(d, i) { return self.widthL + i*self.thickness - 1; })
				.attr("y", this.y)
				.attr("width", 0)
				.attr("height", this.height)
				.attr("fill", self.color)
				.attr("opacity", 0)
				.transition().duration(this.delay)
				.attr("opacity", 1).attr("width", this.thickness - 2);
	}

}
