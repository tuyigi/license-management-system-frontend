const organizationStats = (data)=>{
    var config =
        {
            series: [{
                data:data?.data?.series == null ? [] : data?.data?.series
            }],
            options: {
                colors: ['#ebcf8a'],
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories:data?.data?.labels == null ? [] : data?.data?.labels,
                }
            },
        };

    return config;
}

const licenseRequestStats = (data)=>{

    var config = {

        series: data?.data?.series == null ? [] : data?.data?.series,
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: data?.data?.labels == null ? [] : data?.data?.labels,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },


    };


    return config;
}

export { organizationStats, licenseRequestStats }