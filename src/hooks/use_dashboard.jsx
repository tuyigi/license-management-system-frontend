import { getOverlappingDaysInIntervals } from "date-fns/fp";
import React, { useState, useEffect } from "react";
import axios from 'axios';

import {BackendService} from "../utils/web_config";
import Chart from "react-apexcharts";
import {useHistory} from "react-router-dom";
import {format} from "date-fns/esm";
import {da} from "date-fns/locale";
import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {useSnackbar} from "notistack";
//const axios = require("axios");




/////////////////////////////////////////// admin dashboard /////////////////////////////////////////////

export function useGeneralStats() {
    const history = useHistory();
    const [generalStatsData, setData] = useState({ status: "loading" });

    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (generalStatsData.data == null) {
            getGeneralStats(accountData.token);
        }
    }, []);

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
    }, []);

    const getOrganizationTypeStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().GET_ORGANIZARION_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const series =  response.data.data.map(item => item.total);
                const labels = response.data.data.map(item => item.organization_type);
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
    }, []);

    const getLicenseRequestStatusStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().LICENSE_REQUEST_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                const series =  response.data.data.map(item => (parseInt(item.total)));
                const labels = response.data.data.map(item => item.approval_status);
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
                    if (error?.response?.status === 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status === 401){
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
       /* if (licenseRequestStatusStats.data == null) {
            getLicenseRequestStatusStats(accountData.token,accountData.user.organization_id.id);
        }*/
    }, [licenseRequestStatusStats]);

    const getLicenseRequestStatusStats = (token,id) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().ALL_METRICS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                const series =  response.data.data.map(item => (parseInt(item.total)*100)/total);
                const labels = response.data.data.map(item => item.name);

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
                    if (error?.response?.status === 404) {
                        setData({ data: { labels:[],series:[]}, status: "empty" });
                    } else if(error?.response?.status === 401){
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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (accountData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            getCertificateStats(accountData.token, accountData.user.department.id);
        }
    }, []);

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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (accountData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            if (contractStats.data == null) {
                getContractStats(accountData.token, id);
            }
        }
    }, []);

    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };

    const getContractStats = (token,id) => {

        const paramId = parseInt(id, 10);
        if (isNaN(paramId) || paramId <= 0) {
            return;
        }
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().REPORT}/totalContractDepartment/${paramId}`;
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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (accountData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            if (systemStats.data == null) {
                getSystemStats(accountData.token, id);
            }
        }
    }, []);

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
/*    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (paymentStatusStats.data == null) {
            getPaymentStatusStats(accountData.token,accountData.user.department.id);
        }
    }, []);*/

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        var accData = new BackendService().accountData;
        if (accData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            if (paymentStatusStats.data == null) {
                getPaymentStatusStats(accData.token, id);
            }
        }
    }, []);


    const getPaymentStatusStats = (token,id) => {
        if (!token || !id) {
            return;
        }

        const numericId = parseInt(id, 10);
        if (isNaN(numericId) || numericId <= 0) {
            return;
        }
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().REPORT}/contractPeriodPayments/${numericId}`;
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
    }, []);

    const getApprovedLicenseTypeStats = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().APPROVED_LICENSE_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                // const data = response.data.data;
                const total = response.data.data.reduce((total, item) => parseInt(item.total) + total, 0)
                const series =  response.data.data.map(item => (parseInt(item.total)));
                const labels = response.data.data.map(item => item.l_name);

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
    const [vendorPaymentDeparmentsStats, setData] = useState({status: "loading"});
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        var accountData = new BackendService().accountData;
        if (accountData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            if (vendorPaymentDeparmentsStats.data == null) {
                getVendorPaymentDeparmentsStats(accountData.token, id, accountData.user.id);
            }
        }
    }, []);

    const getVendorPaymentDeparmentsStats = (token, departmentId, userId) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().REPORT + '/metrics/certificate?user_id=' + userId;
        dInstance
            .get(url)
            .then(function (response) {
                const series = response.data.data.map(item => (parseInt(item.total)));
                const labels = response.data.data.map(item => item.month);
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
                        setData({data: {labels: [], series: []}, status: "empty"});
                    } else if (error?.response?.status == 401) {
                        history.push("/", {expired: true});
                    } else {
                        setData({data: {labels: [], series: []}, status: "error"});
                    }
                } else {
                    setData({data: {labels: [], series: []}, status: "error"});
                }
            });
    };
    return [vendorPaymentDeparmentsStats, getVendorPaymentDeparmentsStats];

}


    //get License Contracts

export function useLicenseContractsData() {
    const history = useHistory();
    const [licenseContractsStats, setData] = useState({ status: "loading" });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        const accountData = new BackendService().accountData;
        if (accountData.user.user_type !=='LICENSE_OWNER'){
            notify('error', 'Unauthorized', 401);
        }
        else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }

        if (!licenseContractsStats.data) {
            getLicenseContractsData(accountData.token, id);
        }
        }
    }, []);

    const getLicenseContractsData = (token, id, userId) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().CONTRACT}/tool/expiration/${id}`;

        dInstance.get(url)
            .then(response => {
                const rawData = response.data?.data?.toolsExpiration || [];
                const formatted = rawData.map(da => ({
                    ...da,
                    start_date: format(new Date(da.start_date), 'yyyy/MM/dd'),
                    end_date: format(new Date(da.end_date), 'yyyy/MM/dd'),
                    system_tool_name: da.system_tool_name,
                }));
                setData({
                    data: formatted,
                    status: formatted.length === 0 ? "empty" : "success"
                });
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 404) {
                        setData({ data: [], status: "empty" });
                    } else if (error.response.status === 401) {
                        history.push("/", { expired: true });
                    } else {
                        setData({ data: [], status: "error" });
                    }
                } else {
                    setData({ data: [], status: "error" });
                }
            });
    };

    return [licenseContractsStats, getLicenseContractsData];
}


// get Certificates


export function useCertificatesData() {
    const history = useHistory();
    const [certificates, setCertificates] = useState({ status: "loading", data: [] });
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const notify = (variant, msg, status) => {
            if (status == 401) {
                history.push("/", { expired: true });
            }
            enqueueSnackbar(msg, {
                variant: variant,
                action: (k) => (
                    <IconButton
                        onClick={() => {
                            closeSnackbar(k);
                        }}
                        size="small"
                    >
                        <Close fontSize="small" />
                    </IconButton>
                ),
            });
        };
        useEffect(() => {
            const accountData = new BackendService().accountData;
            if (accountData.user.user_type !== 'LICENSE_OWNER') {
                notify('error', 'Unauthorized', 401);
            } else {
                const id = accountData.user.department.id;
                if (!id) {
                    notify('error', ' ID is required', 400);
                    return;
                }

                if (!/^\d+$/.test(id)) {
                    notify('error', 'Invalid  ID ', 400);
                    return;
                }

                if (!accountData.access_token) {
                    notify('error', 'Authentication required', 401);
                    return;
                }
                getCertificatesData(accountData.token, id, accountData.user.id);
            }

    }, []);

    const getCertificatesData = (token, departmentId, userId) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().CERTIFICATES}/department/${departmentId}`;

        dInstance.get(url)
            .then(response => {
                const rawData = response.data?.data || [];
                const formatted = rawData.map(da => ({
                    ...da,
                    issue_date: format(new Date(da.issue_date), 'yyyy/MM/dd'),
                    expiry_date: format(new Date(da.expiry_date), 'yyyy/MM/dd'),
                }));

                setCertificates({
                    data: formatted,
                    status: formatted.length === 0 ? "empty" : "success",
                });
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 404) {
                        setCertificates({ data: [], status: "empty" });
                    } else if (error.response.status === 401) {
                        history.push("/", { expired: true });
                    } else {
                        setCertificates({ data: [], status: "error" });
                    }
                } else {
                    setCertificates({ data: [], status: "error" });
                }
            });
    };

    return [certificates, getCertificatesData];
}



// CONTRACT TOOLS Optimization

export function useContractToolsOptimizationData() {
    const history = useHistory();
    const [toolsOptimization, setToolsOptimization] = useState({ status: "loading", data: [] });

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", { expired: true });
        }
        enqueueSnackbar(msg, {
            variant: variant,
            action: (k) => (
                <IconButton
                    onClick={() => {
                        closeSnackbar(k);
                    }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            ),
        });
    };
    useEffect(() => {
        const accountData = new BackendService().accountData;
        if (accountData.user.user_type !== 'LICENSE_OWNER') {
            notify('error', 'Unauthorized', 401);
        } else {
            const id = accountData.user.department.id;
            if (!id) {
                notify('error', ' ID is required', 400);
                return;
            }

            if (!/^\d+$/.test(id)) {
                notify('error', 'Invalid  ID ', 400);
                return;
            }

            if (!accountData.access_token) {
                notify('error', 'Authentication required', 401);
                return;
            }
            getToolsOptimizationData(accountData.token, id, accountData.user.id);
        }

    }, []);

    const getToolsOptimizationData = (token, id, userId) => {

        const numericId = parseInt(id, 10);
        if (isNaN(numericId) || numericId <= 0) {
            return;
        }

        const toolsInstance = axios.create(new BackendService().getHeaders(token));
        const url = `${new BackendService().CONTRACT}/tool/metric/department/${id}`;

        toolsInstance.get(url)
            .then(response => {
                const rawData = response.data?.data || [];
                setToolsOptimization({
                    data: rawData,
                    status: rawData.length === 0 ? "empty" : "success",
                });

            })

            .catch(error => {
                if (error.response) {
                    if (error.response.status === 404) {
                        setToolsOptimization({ data: [], status: "empty" });
                    } else if (error.response.status === 401) {
                        history.push("/", { expired: true });
                    } else {
                        setToolsOptimization({ data: [], status: "error" });
                    }
                } else {
                    setToolsOptimization({ data: [], status: "error" });
                }
            });
    };

    return [toolsOptimization, getToolsOptimizationData];
}

