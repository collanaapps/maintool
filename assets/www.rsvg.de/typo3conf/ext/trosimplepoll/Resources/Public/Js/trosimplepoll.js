$(document).ready(function() {
    if(!$('#simplepoll-result').length) return;

    const data = Object.values($('#simplepoll-result').data('result'));

    const ctx = $('#simplepoll-result')[0].getContext('2d'),
        chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.map(function(dataset) {
                    return dataset.title;
                }),
                datasets: [
                    {
                        label: 'Stimmen',
                        backgroundColor: '#389a99',
                        borderColor: '#389a99',
                        data: data.map(function(dataset) {
                            return dataset.counter;
                        })
                    }
                ]
            },
            options: {
                maintainAspectRatio: true,
                legend: {
                    display: false,
                    position: 'top',
                    reverse: false
                },
                title: {
                    position: 'top',
                    display: false,
                    text: '',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontStyle: 'bold'
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                drawBorder: true,
                                drawTicks: true,
                                drawOnChartArea: false
                            },
                            ticks: {
                                beginAtZero: true,
                                padding: 20
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                drawBorder: true,
                                drawTicks: true,
                                drawOnChartArea: false
                            },
                            ticks: {
                                beginAtZero: true,
                                padding: 20
                            }
                        }
                    ]
                }
            }
        });
});