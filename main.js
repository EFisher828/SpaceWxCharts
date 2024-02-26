fetch('https://services.swpc.noaa.gov/json/goes/secondary/xrays-7-day.json')
    .then(response => response.json())
    .then(data => {
      const filteredData = data.filter(entry => entry.energy === '0.1-0.8nm');

      const timestamps = filteredData.map(entry => new Date(entry.time_tag).getTime());
      const fluxValues = filteredData.map(entry => entry.flux);

      const minFlux = Math.min(...fluxValues);
      const maxFlux = Math.max(...fluxValues);

      console.log(minFlux)

      Highcharts.stockChart('xrayChart', {
        chart: {
          type: 'spline',
          backgroundColor: '#212121',
          borderRadius: 8,
          plotBorderWidth: 0
        },
        rangeSelector: {
          enabled: false,
          selected: 1
        },
        title: {
          text: 'GOES X-Ray Flux',
          style: {
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'datetime',
          labels: {
            format: '{value:%H:%M}',
            style: {
              color: '#FFFFFF' // Make x-axis labels white
            },
          },
          style: {
            color: '#FFFFFF' // Make x-axis labels white
          },
          lineColor: '#FFFFFF'
        },
        yAxis: {
          type: 'logarithmic',
          offset: 20,
          title: {
            text: 'Flux',
            style: {
              color: '#FFFFFF' // Make y-axis title white
            }
          },
          tickColor: '#FFFFFF',
          tickPositions: [-8, -7, -6, -5, -4, -3],
          labels: {
            style: {
                color: '#FFFFFF' // Make y-axis labels white
              },
            formatter: function() {
              const value = Math.pow(10, this.value);
              if (this.pos === -8) {
                return 'A';
              } else if (this.pos === -7) {
                return 'B';
              } else if (this.pos === -6) {
                return 'C';
              } else if (this.pos === -5) {
                return 'M';
              } else if (this.pos === -4) {
                return 'X';
              } else if (this.pos > -4) {
                return '';
              } else {
                return value.toExponential();
              }
            }
          },
          gridLineColor: '#FFFFFF'
        },
        tooltip: {
          formatter: function () {
            const flux = this.y;
            let unit;
            if (flux >= 1e-8 && flux < 1e-7) {
              unit = 'A';
            } else if (flux >= 1e-7 && flux < 1e-6) {
              unit = 'B';
            } else if (flux >= 1e-6 && flux < 1e-5) {
              unit = 'C';
            } else if (flux >= 1e-5 && flux < 1e-4) {
              unit = 'M';
            } else if (flux >= 1e-4) {
              unit = 'X';
            }
            return unit + formatExponential(flux, 2);
          }
        },
        plotOptions: {
          spline: {
            lineWidth: 5 // Make the line wider
          }
        },
        legend: {
          itemStyle: {
            color: '#FFFFFF' // Make legend text white
          }
        },
        series: [{
          name: 'Flux',
          data: fluxValues.map((value, index) => [timestamps[index], value]),
          color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
              [0, '#ff0000'], // Start color (red)
              [0.5, '#ffff00'], // Middle color (yellow)
              [1, '#00ff00'] // End color (green)
            ]
          }
        }],
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                  symbolFill: '#121212',
                  symbolStroke: 'white',
                  theme: {
                      fill: '#121212',
                      stroke: 'white',
                      states: {
                          hover: {
                              fill: '#474747',
                              stroke: 'white'
                          },
                          select: {
                              fill: '#474747',
                              stroke: 'white'
                          }
                      }
                  }
                }
            }
        }
      });
    });

function formatExponential(number, decimalPlaces) {
    // Convert the number to a string
    let numString = number.toExponential().toString();

    // Split the string into coefficient and exponent parts
    let parts = numString.split('e');
    let coefficient = parseFloat(parts[0]);
    let exponent = parseInt(parts[1]);

    // Format the coefficient with the specified decimal places
    let formattedCoefficient = coefficient.toFixed(decimalPlaces);

    // Combine the formatted coefficient and exponent with 'e'
    return formattedCoefficient
}
