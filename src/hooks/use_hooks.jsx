import { useState, useEffect } from "react";
import {BackendService} from "../utils/web_config";
import axios from 'axios';

//const axios = require("axios");

////////////////////////////////////////////////////////////////////////
function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
    var accountData = new BackendService().accountData;
    if (organizations.length == 0) {
      getOrganizations(accountData.token);
    }
  }, [organizations]);

  const getOrganizations = (token) => {
    const orgsInstance = axios.create(new BackendService().getHeaders(token));

    orgsInstance
      .get(new BackendService().ORGANIZATIONS)
      .then(function (response) {
        const d = response.data;
        setOrganizations(d.data);
      })
      .catch(function (error) { });
  };

  return organizations;
}

////////////////////////////////////////////////////////////////////////
function useRoles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (roles.length == 0) {
      getRoles(accountData.token);
    }
  }, [roles]);

  const getRoles = (token) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));

    rolesInstance
      .get(new BackendService().ROLES )
      .then(function (response) {
        const d = response.data;
        setRoles(d.data);
      })
      .catch(function (error) { });
  };

  return roles;
}


function useLicenses(category = null) {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (licenses.length == 0) {
      getLicenses(accountData.token);
    }
  }, [licenses]);

  const getLicenses = (token) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));

    rolesInstance
        .get(new BackendService().LICENSES)
        .then(function (response) {
          if(category==null){
            const d = response.data;
            setLicenses(d.data);
          }else{
            const d = response.data.data.filter((l)=>l.license_category === category);
            setLicenses(d);
          }

        })
        .catch(function (error) { });
  };

  return licenses;
}

function useOrganizationLicenseRequest() {
  const [organizationLicenseRequestStats, setOrganizationLicenseRequestStats] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (organizationLicenseRequestStats.length == 0) {
      getOrganizationLicenseRequest(accountData.token,accountData.user.organization_id.id);
    }
  }, [organizationLicenseRequestStats]);

  const getOrganizationLicenseRequest = (token,id) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));

    rolesInstance
        .get(new BackendService().LICENSE_REQUEST_TYPE_STATS + `/${id}`)
        .then(function (response) {
          const d = response.data;
          setOrganizationLicenseRequestStats(d.data);
        })
        .catch(function (error) { });
  };
  return organizationLicenseRequestStats;
}



// global license request status

function useGlobalOrganizationLicenseRequest() {
  const [organizationLicenseRequestStats, setOrganizationLicenseRequestStats] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (organizationLicenseRequestStats.length == 0) {
      getOrganizationLicenseRequest(accountData.token);
    }
  }, [organizationLicenseRequestStats]);

  const getOrganizationLicenseRequest = (token) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));

    rolesInstance
        .get(new BackendService().LICENSE_REQUEST_TYPE_STATS )
        .then(function (response) {
          const d = response.data;
          setOrganizationLicenseRequestStats(d.data);
        })
        .catch(function (error) { });
  };
  return organizationLicenseRequestStats;
}




function useOrganizationMyLicense() {
  const [organizationLicenseRequestStats, setOrganizationLicenseRequestStats] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (organizationLicenseRequestStats.length == 0) {
      getOrganizationLicenseRequest(accountData.token,accountData.user.organization_id.id);
    }
  }, [organizationLicenseRequestStats]);

  const getOrganizationLicenseRequest = (token,id) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));

    rolesInstance
        .get(new BackendService().ORGANIZATION_LICENSE_REQUEST + `${id}`)
        .then(function (response) {
          const d = response.data.data.filter((d)=>d.request_status=='APPROVED');
          setOrganizationLicenseRequestStats(d);
        })
        .catch(function (error) { });
  };
  return organizationLicenseRequestStats;
}



function useVendorLicense() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (vendors.length === 0) {
      getVendors(accountData.token);
    }
  }, [vendors]);

  const getVendors = (token) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));
    rolesInstance
        .get(new BackendService().VENDOR)
        .then(function (response) {
          const d = response.data.data;
          setVendors(d);
        })
        .catch(function (error) { });
  };
  return vendors;
}
function useEnabledVendors() {
  const [vendorsEnabled, setVendorsEnabled] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (vendorsEnabled.length === 0) {
      getVendors(accountData.token);
    }
  }, [vendorsEnabled]);

  const getVendors = (token) => {
    const rolesInstance = axios.create(new BackendService().getHeaders(token));
    rolesInstance
        .get(new BackendService().VENDOR)
        .then(function (response) {
          const d = response.data.data;
          const dEnabled = d.filter((vendor) => vendor.status === 'ENABLED') || [];
          console.log('vendors ****', dEnabled);

          setVendorsEnabled(dEnabled);
        })
        .catch(function (error) { });
  };
  return vendorsEnabled;
}



function useSystemTools() {
  const [systemTools, setSystemTools] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (systemTools.length === 0) {
      getSystemTools(accountData.token);
    }
  }, [systemTools]);

  const getSystemTools = (token) => {
    const systemToolsInstance = axios.create(new BackendService().getHeaders(token));
    systemToolsInstance
        .get(new BackendService().SYSTME_TOOLS)
        .then(function (response) {
          const d = response.data.data;
          setSystemTools(d);
        })
        .catch(function (error) { });
  };
  return systemTools;
}


function useMetric() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;
    if (metrics.length === 0) {
      getMetrics(accountData.token);
    }
  }, [metrics]);

  const getMetrics = (token) => {
    const systemToolsInstance = axios.create(new BackendService().getHeaders(token));
    systemToolsInstance
        .get(new BackendService().METRICS)
        .then(function (response) {
          const d = response.data.data;
          setMetrics(d);
        })
        .catch(function (error) { });
  };
  return metrics;
}


function useContracts() {
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    const accountData = new BackendService().accountData;
    if (contracts.length === 0) {
      getContracts(accountData.token);
    }
  }, [contracts]);
  const getContracts = (token) => {
    const contractsInstance = axios.create(new BackendService().getHeaders(token));
    contractsInstance
        .get(new BackendService().CONTRACT)
        .then(function (response) {
          setContracts(response.data.data);
        })
        .catch(function (error) { });
  };
  return contracts;
}




function useFunctions() {
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (functions.length === 0) {
      getFunctions(accountData.token);
    }
  }, [functions]);

  const getFunctions = (token) => {
    const functionsInstance = axios.create(new BackendService().getHeaders(token));
    functionsInstance
        .get(new BackendService().FUNCTION)
        .then(function (response) {
          const d = response.data.data;
          setFunctions(d);
        })
        .catch(function (error) { });
  };
  return functions;
}

function useDepartments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    var accountData = new BackendService().accountData;

    if (departments.length === 0) {
      getDepartments(accountData.token);
    }
  }, [departments]);

  const getDepartments = (token) => {
    const departmentInstance = axios.create(new BackendService().getHeaders(token));
    departmentInstance
        .get(new BackendService().DEPARTMENT)
        .then(function (response) {
          const d = response.data.data;
          setDepartments(d);
        })
        .catch(function (error) { });
  };
  return departments;
}




export {
  useOrganizations,
  useRoles,
  useLicenses,
  useOrganizationLicenseRequest,
  useOrganizationMyLicense,
  useGlobalOrganizationLicenseRequest,
  useVendorLicense,
  useSystemTools,
  useContracts,
  useFunctions,
  useDepartments,
  useMetric,
    useEnabledVendors,
};
