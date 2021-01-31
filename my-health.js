function fromShortFormat(d) {
  let date = d.split("-");

  let monthNames = ["Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"];

  return monthNames.indexOf(date[1]) + 1 + '/' + date[0] + '/' + date[2];
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
}

/* Generate SVG Element */
var width = 1000;
var height = 600;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + 120)
  .attr("height", height + 70)
  .append("g")
  .attr("transform",
    "translate(60, 10)");


d3.csv("./data/health-data50.1.csv",
  function (d) {
    return {
      date: new Date(fromShortFormat(d["Start"].slice(0, d["Start"].indexOf(' ')))),
      activeCal: d["Active Calories (kcal)"],
      restingCal: d["Resting Calories (kcal)"],
      totalCal: +d["Active Calories (kcal)"] + +d["Resting Calories (kcal)"]
    }
  },

  function (data) {
    console.log(data);

    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y1 = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => { return d.totalCal; })])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y1));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y1(d.activeCal) })
      )

    // svg.append("path")
    //   .datum(data)
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(function (d) { return x(d.date) })
    //     .y(function (d) { return y1(d.restingCal) })
    //   )

    // svg.append("path")
    //   .datum(data)
    //   .attr("fill", "none")
    //   .attr("stroke", "orange")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(function (d) { return x(d.date) })
    //     .y(function (d) { return y1(d.totalCal) })
    //   )

    svg.append("text")
      .attr("class", "axisLabel")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .text("Date");

    svg.append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 - 100)
      .attr("y", -45)
      .text("Total Calories Burned (Active, kcal)");
  }
);

d3.csv('./data/sleep-analysis.csv',
  function (d) {
    return {
      date: new Date(fromShortFormat(d["In bed Finish"].slice(0, d["In bed start"].indexOf(' ')))).addDays(1),
      value: d["Minutes in bed"]
    }
  },

  function (data) {

    console.log(data)
    var x = d3.scaleTime()
      .domain(d3.extent(data, (d) => { return d.date }))
      .range([0, width])

    var y2 = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => { return d.value })])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(y2));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y2(+d.value) })
      )
  }
)
