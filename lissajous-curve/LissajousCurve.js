const PI = 3.141592654
var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    radius = diameter/2 - margin,
    g1 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"),
    g2 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var scale = d3.scaleLinear()
    .domain([-5, 5])
    .range([-(diameter/2 - margin), diameter/2 - margin])
    .interpolate(d3.interpolateNumber);

var plots = [];
var time = 0;
var ASLine = d3.line()
    .x(function(d) {return d.x})
    .y(function(d) {return d.y})
    .curve(d3.curveBasis);

var lineAxis = d3.line()
    .x(function(d) { return d.x })
    .y(function(d) { return d.y });

var start = [0, 1];
var speed = [0.017, 0.020];

var input1 = d3.select("#speed1")
    .attr("value", speed[0]*1000);
var input2 = d3.select("#speed2")
    .attr("value", speed[1]*1000);

function resetPlots() {
    plots = [];
    time = 0;
    console.log(input1.property("value"));
    console.log(input2.property("value"));
    speed[0] = input1.property("value")/1000;
    speed[1] = input2.property("value")/1000;
    requestAnimationFrame(animate);
}

var x = (speed[0] > 0) ? parseInt(speed[0]*1000) : - parseInt(speed[0]*1000);
var y = (speed[1] > 0) ? parseInt(speed[1]*1000) : - parseInt(speed[1]*1000);
function reduce(x, y) {
    if ( x % y === 0 ) {
        return y;
    } else {
        return reduce(y, x % y);
    }
}
var step = 3.1415926 * 2000 / (x > y ? reduce(x, y) : reduce(y, x));
var xLine = [
        {
            x: -radius,
            y: 0
        },
        {
            x: radius,
            y: 0
        }
    ];
var yLine = [
        {
            x: 0,
            y: -radius
        },
        {
            x: 0,
            y: radius
        }
    ];
var theLine = g1.append("path")
    .attr("class", "curve")
    .attr("d", ASLine(plots));

var point1 = g2.append("circle")
    .attr("class", "point1")
    .attr("r", 3)
    .attr("transform", "translate(" + Math.sin(start[0])*radius + "," + Math.cos(start[0])*radius + ")");

var point2 = g2.append("circle")
    .attr("class", "point2")
    .attr("r", 3)
    .attr("transform", "translate(" + Math.sin(start[1])*radius + "," + Math.cos(start[1])*radius + ")");

var travelPoint = g2.append("circle")
    .attr("class", "travel-point")
    .attr("r", 3)
    .attr("transform", "translate(" + Math.sin(start[1])*radius + "," + Math.cos(start[0])*radius + ")");

g2.append("circle")
    .attr("class", "travel-path")
    .attr("r", radius)
//Add the x Axis
var xLine = g2.append("path")
    .attr("class", "axis-line")
    .attr("d", lineAxis(xLine));
//Add the Y Axis
var yLine = g2.append("path")
    .attr("class", "axis-line")
    .attr("d", lineAxis(yLine));

function isClose(points){
    if (points.length < 2) {
        return false;
    }
    var dx = points[0].x - points[points.length - 1 ].x;
    var dy = points[0].y - points[points.length - 1 ].y;
    if ((dx * dx + dy * dy) < 2) {
        return true;
    }
    return false;
}
function animate(){
    plots.push({
        x: Math.sin(start[1] + speed[1] * time) * radius,
        y: Math.cos(start[0] + speed[0] * time ) * radius
    });
    theLine
        .attr("d", ASLine(plots));
    point1
        .attr("transform", "translate(" + Math.sin(start[0] + speed[0] * time) * radius + "," + Math.cos(start[0] + speed[0] * time ) * radius + ")");
    point2
        .attr("transform", "translate(" + Math.sin(start[1] + speed[1] * time) * radius + "," + Math.cos(start[1] + speed[1] * time ) * radius + ")");
    travelPoint
        .attr("transform", "translate(" + Math.sin(start[1] + speed[1] * time) * radius + "," + Math.cos(start[0] + speed[0] * time ) * radius + ")");
    xLine
        .attr("transform", "translate(" + 0 + "," + Math.cos(start[0] + speed[0] * time ) * radius + ")");
    yLine
        .attr("transform", "translate(" + Math.sin(start[1] + speed[1] * time) * radius + "," + 0 + ")");
    time ++;
    if (time < step) {
        requestAnimationFrame(animate);//继续调用animate函数
    }
}
requestAnimationFrame(animate);
