import {useState} from "react";

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

const organizationLicenseRequestStats = (data)=>{

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


// license manager
const licenseRequestStatusChart = (data)=> {
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
};

const allocatedLicenseChart= (data)  => {
    var config = {

        series: [{
            data: data?.data?.series == null ? [] : data?.data?.series,
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            colors: [],
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories:data?.data?.labels == null ? [] : data?.data?.labels,
                labels: {
                    style: {
                        colors: [],
                        fontSize: '12px'
                    }
                }
            }
        },
    };
    return config;
}


export { organizationStats, licenseRequestStats, organizationLicenseRequestStats, licenseRequestStatusChart, allocatedLicenseChart }