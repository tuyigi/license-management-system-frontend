import { getOverlappingDaysInIntervals } from "date-fns/fp";
import React, { useState, useEffect } from "react";

import {BackendService} from "../utils/web_config";
import Chart from "react-apexcharts";
const axios = require("axios");


/////////////////////////////////////////// admin dashboard /////////////////////////////////////////////

export function useGeneralStats() {
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
                    } else {
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
                    } else {
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
                    } else {
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
    const [licenseRequestStatusStats, setData] = useState({status: "loading" });
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (licenseRequestStatusStats.data == null) {
            getLicenseRequestStatusStats(accountData.token,accountData.user.organization_id.id);
        }
    }, [licenseRequestStatusStats]);

    const getLicenseRequestStatusStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().LICENSE_REQUEST_TYPE_STATS+`/${id}`;
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
                    } else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [licenseRequestStatusStats, getLicenseRequestStatusStats];
}


// get approved license type stats

export function useApprovedLicenseTypeStats() {
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
                    } else {
                        setData({ data: { labels:[],series:[]}, status: "error" });
                    }
                } else {
                    setData({ data: { labels:[],series:[]}, status: "error" });
                }
            });
    };
    return [approvedLicenseRequestStats, getApprovedLicenseTypeStats];
}

