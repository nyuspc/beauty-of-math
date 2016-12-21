
var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g1 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"),
    g2 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var scaleX = d3.scaleLinear()
    .domain([-5, 5])
    .range([-(diameter/2 - margin), diameter/2 - margin])
    .interpolate(d3.interpolateNumber);

var scaleY = d3.scaleLinear()
    .domain([-5, 5])
    .range([-(diameter/2 - margin), diameter/2 - margin])
    .interpolate(d3.interpolateNumber);

var xAxis = d3.axisBottom()
    .scale(scaleX);

var yAxis = d3.axisLeft()
    .scale(scaleY);

var varR = 0.500, speedScale = 200;
function plotISLine(point) {
    var varTheta = point/speedScale;
    return {
        'x': varR*Math.cos(varTheta) + varTheta*varR*Math.sin(varTheta),
        'y': varR*Math.sin(varTheta) - varTheta*varR*Math.cos(varTheta),
        'theta': varTheta
    };
}

var plots = [];
var ISLine = d3.line()
    .x(function(d) {return scaleX(d.x)})
    .y(function(d) {return scaleY(d.y)})
    .curve(d3.curveBasis);
var PLine = d3.line()
    .x(function(d) {return scaleX(d.x)})
    .y(function(d) {return scaleY(d.y)})
g1.append("path")
    .attr("class", "curve")
    .attr("d", ISLine(plots));

g2.append("circle")
    .attr("class", "center-point")
    .attr("r", 3)

g2.append("circle")
    .attr("class", "travel-point")
    .attr("r", 3)

//Add the x Axis
g2.append("g")
    .attr("class", "axis-line")
    .call(xAxis);

//Add the Y Axis
g2.append("g")
    .attr("class", "axis-line")
    .call(yAxis);

//Add the line between two point
var WireLine = g2.append("path")
    .attr("class", "axis-line red")
    .attr("d", PLine([]));

//add boundery
g2.append("circle")
    .attr("class", "axis-line")
    .attr("r", scaleX(5))

g2.append("circle")
    .attr("class", "axis-line red")
    .attr("r", scaleX(varR))

var time = 1;
var maxTime = Math.sqrt( 25 - varR*varR ) / varR * speedScale;
var lp = null;
function animate(){
    plots.push(plotISLine(time));
    lp = plots[plots.length -1];
    g1.select("path")
        .attr("d", ISLine(plots));
    g2.select(".center-point")
            .attr("transform", "translate(" + scaleX(varR*Math.cos(lp.theta)) + "," + scaleY(varR*Math.sin(lp.theta)) + ")");
    g2.select(".travel-point")
        .attr("transform", "translate(" + scaleX(lp.x) + "," + scaleY(lp.y) + ")");
    WireLine.attr("d", PLine([
        {x: varR*Math.cos(lp.theta), y: varR*Math.sin(lp.theta)},
        {x: lp.x, y: lp.y}
    ]));
    time ++;
    if(time < maxTime) {
        requestAnimationFrame(animate);//继续调用animate函数
    }
}
requestAnimationFrame(animate);
