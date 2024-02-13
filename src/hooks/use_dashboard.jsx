import { getOverlappingDaysInIntervals } from "date-fns/fp";
import { useState, useEffect } from "react";

import {
  AdminService,
  ReportingService,
  FinanceService,
  Validator,
} from "../../../utils/web_config";
const axios = require("axios");

/////////////////////////////////////////////////////////////////////////////////////

export function useChannelPerformance(props) {
  const [generalChanneldata, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (generalChanneldata.data == null) {
      getGeneraChannel(accountData.token);
    }
  }, [generalChanneldata]);

  const getGeneraChannel = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GENERAL_CHANNEL_PERFORMANCE;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;

        var group = new Validator().groupArrayOfObjects(d.data, "channel_type");

        var keys = Object.keys(group);
        var values = [];
        keys.map((k, i) => {
          var sum = new Validator().sum(group[k], "total_amount");
          values.push(sum);
        });

        setData({ data: { labels: keys, series: values }, status: "success" });
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

    ////
  };

  return [generalChanneldata, getGeneraChannel];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useRoutePerformance(props) {
  const [generalRoutedata, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (generalRoutedata.data == null) {
      getGeneralRoute(accountData.token);
    }
  }, [generalRoutedata]);

  const getGeneralRoute = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GENERAL_ROUTE_PERFORMANCE;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;


        var group = new Validator().groupArrayOfObjects(d.data, "route");

        var keys = Object.keys(group);
        var values = [];
        
        keys.map((k, i) => {
          
          var sum = new Validator().sum(group[k], "total_amount");
          values.push(sum);
          
        });

        setData({ data: { labels: keys, series: values }, status: "success" });
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

    ////
  };

  return [generalRoutedata, getGeneralRoute];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useOperatorPerformance(props) {
  const [generalOperatorData, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (generalOperatorData.data == null) {
      getGeneralOperator(accountData.token);
    }
  }, [generalOperatorData]);

  const getGeneralOperator = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GENERAL_OPERATOR_PERFORMANCE;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;

        var group = new Validator().groupArrayOfObjects(
          d.data,
          "organization_id"
        );

        var keys = Object.keys(group);
        var values = [];
        keys.map((k, i) => {
          var sum = new Validator().sum(group[k], "total_revenue");
          values.push(sum);
        });

        setData({
          data: { labels: keys, series: values },
          grp: group,
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

    ////
  };

  return [generalOperatorData, getGeneralOperator];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useAgentTransactions(props) {
  const [agentTransactionsData, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (agentTransactionsData.data == null) {
      getAgentTransactions(accountData.token);
    }
  }, [agentTransactionsData]);

  const getAgentTransactions = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GENERAL_AGENT_PERFORMANCE;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;

        var group = new Validator().groupArrayOfObjects(d.data, "date__date");
        var totalSum = d.data.length;

        var keys = Object.keys(group);
        var values = [];
        keys.map((k, i) => {
          var sum = group[k].length;
          values.push(sum);
        });

        var values2 = [];
        keys.map((k, i) => {
          var sum = new Validator().sum(group[k], "total_amount");
          values2.push(sum);
        });

        var totalSum2 = new Validator().sum(d.data,'total_amount')

        setData({
          data: { labels: keys, series: values, series2:values2, sum: totalSum,sum2:totalSum2 },
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

    ////
  };

  return [agentTransactionsData, getAgentTransactions];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useAgentPerformance(props) {
  const [agentPerformanceData, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (agentPerformanceData.data == null) {
      getAgentPerformance(accountData.token);
    }
  }, [agentPerformanceData]);

  const getAgentPerformance = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GENERAL_AGENT_PERFORMANCE;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;

        var group = new Validator().groupArrayOfObjects(d.data, "date__date");
        var totalSum = d.data.length;

        var keys = Object.keys(group);
        var values = [];
        keys.map((k, i) => {
          var sum = group[k].length;
          values.push(sum);
        });

        setData({
          data: { labels: keys, series: values, sum: totalSum },
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

    ////
  };

  return [agentPerformanceData, getAgentPerformance];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useInventory(props) {
  const [inventoryData, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (inventoryData.data == null) {
      getInventory(accountData.token);
    }
  }, [inventoryData]);

  const getInventory = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new ReportingService().GET_STOCK_BY_ORGANIZATION;

    dInstance
      .post(url, props)
      .then(function (response) {
        const d = response.data;

        setData({
          data: d.data,
          status: "success",
        });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setData({ data: [], status: "empty" });
          } else {
            setData({ data: [], status: "error" });
          }
        } else {
          setData({ data: [], status: "error" });
        }
      });

    ////
  };
  

  return [inventoryData, getInventory];
}

/////////////////////////////////////////////////////////////////////////////////////

export function useTransactions(props) {
  const [transactionsData, setData] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (transactionsData.data == null) {
      getTransactions(accountData.token);
    }
  }, [transactionsData]);

  const getTransactions = (token) => {
    const dInstance = axios.create(new AdminService().getHeaders(token));

    const url = new FinanceService().GET_ALL_TRANSACTIONS+ "?per_page=1000&start_date="+props.start_date+"&end_date="+props.end_date;

    dInstance
      .get(url)
      .then(function (response) {
        const d = response.data;

        var groups = new Validator().groupArrayOfObjects(
          d.data,
          "tx_type_name"
        );
        var keys = Object.keys(groups);

        var channelGroups = new Validator().groupArrayOfObjects(
          d.data,
          "channel_type"
        );
        var channelKeys = Object.keys(channelGroups);
        var channelValues = [];
        channelKeys.map((k, i) => {
          var sum = new Validator().sum(channelGroups[k], "amount");
          channelValues.push(sum);
        });

        setData({
          data: d.data,
          keys: keys,
          groups: groups,
          channelGroups:channelGroups,
          channelKeys:channelKeys,
          status: "success",
        });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setData({ data: [], status: "empty" });
          } else {
            setData({ data: [], status: "error" });
          }
        } else {
          setData({ data: [], status: "error" });
        }
      });

    ////
  };
  

  return [transactionsData, getTransactions];
}
