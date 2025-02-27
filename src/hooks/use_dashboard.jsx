import { getOverlappingDaysInIntervals } from "date-fns/fp";
import React, { useState, useEffect } from "react";

import {BackendService} from "../utils/web_config";
import Chart from "react-apexcharts";
import {useHistory} from "react-router-dom";
const axios = require("axios");




/////////////////////////////////////////// admin dashboard /////////////////////////////////////////////

export function useGeneralStats() {
    const history = useHistory();
    const [generalStatsData, setData] = useState({ status: "loading" });

    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (generalStatsData.data == null) {
            getGeneralStats(accountData.token);
        }
    }, [generalStatsData]);

    const getGeneralStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().GENERAL_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: {}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }else {
                        setData({ data: {}, status: "error" });
                    }
                } else {
                    setData({ data: {}, status: "error" });
                }
            });
    };
    return [generalStatsData, getGeneralStats];
}

export function useOrganizationTypeStats() {
    const history = useHistory();
    const [organizationTypeStats, setData] = useState({status: "loading" });
    useEffect(() => {

        var accountData = new BackendService().accountData;
        if (organizationTypeStats.data == null) {
            getOrganizationTypeStats(accountData.token);
        }
    }, [organizationTypeStats]);

    const getOrganizationTypeStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().GET_ORGANIZARION_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const series =  response.data.data.map(item => item.total);
                const labels = response.data.data.map(item => item.organization_type);
                console.log(series,labels);

                const data = {
                    labels,
                    series
                };
                console.log(data)
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }
                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [organizationTypeStats, getOrganizationTypeStats];
}

export function useLicenseRequestStatusStats() {
    const history = useHistory();
    const [licenseRequestStatusStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (licenseRequestStatusStats.data == null) {
            getLicenseRequestStatusStats(accountData.token);
        }
    }, [licenseRequestStatusStats]);

    const getLicenseRequestStatusStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().LICENSE_REQUEST_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                console.log('total',total);
                const series =  response.data.data.map(item => (parseInt(item.total)*100)/total);
                const labels = response.data.data.map(item => item.request_status);
                console.log(series,labels);

                const data = {
                    labels,
                    series
                };
                console.log(data)
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }
                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [licenseRequestStatusStats, getLicenseRequestStatusStats];
}

// get organization license requests stats


export function useOrganizationLicenseRequestStatusStats() {
    const history = useHistory();
    const [licenseRequestStatusStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (licenseRequestStatusStats.data == null) {
            getLicenseRequestStatusStats(accountData.token,accountData.user.organization_id.id);
        }
    }, [licenseRequestStatusStats]);

    const getLicenseRequestStatusStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().ALL_METRICS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                console.log('total',total);
                const series =  response.data.data.map(item => (parseInt(item.total)*100)/total);
                const labels = response.data.data.map(item => item.name);
                console.log(series,labels);

                const data = {
                    labels,
                    series
                };
                console.log(data)
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }
                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [licenseRequestStatusStats, getLicenseRequestStatusStats];
}


// get total certificate / department
export function useTotalCertificateDepartmentStats() {
    const history = useHistory();
    const [certificateStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (certificateStats.data == null) {
            getCertificateStats(accountData.token,accountData.user.department.id);
        }
    }, [certificateStats]);

    const getCertificateStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().REPORT}/certificatesDepartment/${id}`;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }

                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [certificateStats, getCertificateStats];
}

// get total contracts / department

export function useTotalContractDepartmentStats() {
    const history = useHistory();
    const [contractStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (contractStats.data == null) {
            getContractStats(accountData.token,accountData.user.department.id);
        }
    }, [contractStats]);

    const getContractStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().REPORT}/totalContractDepartment/${id}`;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }

                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [contractStats, getContractStats];
}


// get tools / system stats

export function useSystemToolStats() {
    const history = useHistory();
    const [systemStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (systemStats.data == null) {
            getSystemStats(accountData.token,accountData.user.department.id);
        }
    }, [systemStats]);

    const getSystemStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().SYSTME_TOOLS;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                setData({
                    data:{total: data.length},
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { total: 0}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }

                    else {
                        setData({ data: { total: 0}, status: "error" });
                    }
                } else {
                    setData({ data: { total: 0}, status: "error" });
                }
            });
    };
    return [systemStats, getSystemStats];
}


// get payment status summary of all payment period of contracts in department

export function usePaymentStatusContractDepartmentStats() {
    const history = useHistory();
    const [paymentStatusStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (paymentStatusStats.data == null) {
            getPaymentStatusStats(accountData.token,accountData.user.department.id);
        }
    }, [paymentStatusStats]);

    const getPaymentStatusStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().REPORT}/contractPeriodPayments/${id}`;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }

                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [paymentStatusStats, getPaymentStatusStats];
}



// get approved license type stats

export function useApprovedLicenseTypeStats() {
    const history = useHistory();
    const [approvedLicenseRequestStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (approvedLicenseRequestStats.data == null) {
            getApprovedLicenseTypeStats(accountData.token);
        }
    }, [approvedLicenseRequestStats]);

    const getApprovedLicenseTypeStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().APPROVED_LICENSE_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                console.log('total',total);
                const series =  response.data.data.map(item => (parseInt(item.total)));
                const labels = response.data.data.map(item => item.l_name);
                console.log(series,labels);

                const data = {
                    labels,
                    series
                };
                console.log(data)
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }
                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [approvedLicenseRequestStats, getApprovedLicenseTypeStats];
}



// get approved license type stats

export function useVendorPaymentDeparmentsStats() {
    const history = useHistory();
    const [vendorPaymentDeparmentsStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (vendorPaymentDeparmentsStats.data == null) {
            getVendorPaymentDeparmentsStats(accountData.token,accountData.user.department.id, accountData.user.id);
        }
    }, [vendorPaymentDeparmentsStats]);

    const getVendorPaymentDeparmentsStats = (token,departmentId,userId) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().REPORT + '/metrics/certificate?user_id=' + userId;
        dInstance
            .get(url)
            .then(function (response) {
                const series =  response.data.data.map(item => (parseInt(item.total)));
                const labels = response.data.data.map(item => item.month);
                console.log(series,labels);
                const data = {
                    labels,
                    series
                };
                setData({
                    data,
                    status: "success",
                });
            })
            .catch(function (error) {
                if (error.response) {
                    if (error?.response?.status == 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    }
                    else if(error?.response?.status == 401){
                        history.push("/", { expired: true });
                    }

                    else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [vendorPaymentDeparmentsStats, getVendorPaymentDeparmentsStats];
}

