
var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g1 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"),
    g2 = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var scaleR = d3.scaleLinear()
    .domain([-5, 5])
    .range([-(diameter/2 - margin), diameter/2 - margin])
    .interpolate(d3.interpolateNumber);

var scaleY = d3.scaleLinear()
    .domain([5, -5])
    .range([-(diameter/2 - margin), diameter/2 - margin])
    .interpolate(d3.interpolateNumber);

var xAxis = d3.axisBottom()
    .scale(scaleR);

var yAxis = d3.axisLeft()
    .scale(scaleY);

var varA = 0.500, varB = 1.000, speedScale = 200;
function plotASLine(point) {
    return {
        'r': varA + point*varB/speedScale,
        'theta': point/speedScale*3.1415927*2
    };
}

var plots = [];
var ASLine = d3.radialLine()
    .radius(function(d) {return scaleR(d.r)})
    .angle(function(d) {return d.theta})
    .curve(d3.curveBasis);

g1.append("path")
    .attr("class", "curve")
    .attr("d", ASLine(plots));

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
//add boundery
g2.append("circle")
    .attr("class", "axis-line")
    .attr("r", scaleR(5))

var time = 1;
var maxTime = ( 5 - varA ) / varB * speedScale;
var lp = null;
function animate(){
    plots.push(plotASLine(time));
    lp = plots[plots.length -1];
    g1.select("path")
        .attr("d", ASLine(plots));
    g2.select(".travel-point")
        .attr("transform", "translate(" + Math.sin(lp.theta)*scaleR(lp.r) + "," + -Math.cos(lp.theta)*scaleR(lp.r) + ")");
    time ++;
    if(time < maxTime) {
        requestAnimationFrame(animate);//继续调用animate函数
    }
}
requestAnimationFrame(animate);
