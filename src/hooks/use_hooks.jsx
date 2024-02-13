import { useState, useEffect } from "react";

import {
  AdminService,
  TransportService,
  ReportingService,
  FinanceService,
} from "../../../utils/web_config";
const axios = require("axios");

////////////////////////////////////////////////////////////////////////////
function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (organizations.length == 0) {
      getOrganizations(accountData.token);
    }
  }, [organizations]);

  const getOrganizations = (token) => {
    const orgsInstance = axios.create(new AdminService().getHeaders(token));

    orgsInstance
      .get(new AdminService().GET_ALL_ORGANIZATIONS +
      "?page=0&size=500")
      .then(function (response) {
        const d = response.data;
        setOrganizations(d.data);
      })
      .catch(function (error) { });
  };

  return organizations;
}

////////////////////////////////////////////////////////////////////////////
function useOperators() {
  const [operators, setOperators] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (operators.data == null) {
      getOperators(accountData.token);
    }
  }, [operators]);

  const getOperators = (token) => {
    const orgsInstance = axios.create(new AdminService().getHeaders(token));

    orgsInstance
      .get(
        new AdminService().GET_ORGANIZATION_BY_TYPE +
        "OPERATOR" +
        "?page=0&size=500"
      )
      .then(function (response) {
        const d = response.data;

        setOperators({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setOperators({ data: [], status: "empty" });
          } else {
            setOperators({ data: [], status: "error" });
          }
        } else {
          setOperators({ data: [], status: "error" });
        }
      });
  };

  return operators;
}

////////////////////////////////////////////////////////////////////////

function useRoles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (roles.length == 0) {
      getRoles(accountData.token);
    }
  }, [roles]);

  const getRoles = (token) => {
    const rolesInstance = axios.create(new AdminService().getHeaders(token));

    rolesInstance
      .get(new AdminService().GET_ALL_ROLES + "?page=0&size=100000")
      .then(function (response) {
        const d = response.data;
        setRoles(d.data);
      })
      .catch(function (error) { });
  };

  return roles;
}
////////////////////////////////////////////////////////////////////
function useOrgRoles(props) {
  const [accountData, setAccountData] = useState({ status: "loading" });

  const [roles, setRoles] = useState({});
  const { org_id } = props;

  useEffect(() => {
    var accountData = new AdminService().accountData;
    setAccountData(accountData);
    if (roles.data == null) {
      getRoles(accountData.token);
    }
  }, [roles]);

  const getRoles = (token) => {
    const rolesInstance = axios.create(new AdminService().getHeaders(token));

    rolesInstance
      .get(new AdminService().GET_ROLES_BY_ORGANIZATION + org_id)
      .then(function (response) {
        const d = response.data;

        setRoles({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setRoles({ data: [], status: "empty" });
          } else {
            setRoles({ data: [], status: "error" });
          }
        } else {
          setRoles({ data: [], status: "error" });
        }
      });
  };

  return roles;
}
///////////////////////////////////////////////////////////////////////////

function useItemTypes() {
  const [itemTypes, setItemTypes] = useState({ status: "loading" });

  useEffect(() => {
    if (itemTypes.data == null) {
      var accountData = new AdminService().accountData;

      getItemTypes(accountData.token);
    }
  }, [itemTypes]);

  const getItemTypes = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new ReportingService().GET_ITEM_TYPES)
      .then(function (response) {
        const d = response.data;

        if (d?.length == 0) {
          setItemTypes({ data: [], status: "empty" });
        } else {
          setItemTypes({ data: d, status: "success" });
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setItemTypes({ data: [], status: "empty" });
          } else {
            setItemTypes({ data: [], status: "error" });
          }
        } else {
          setItemTypes({ data: [], status: "error" });
        }
      });

    ////
  };

  return itemTypes;
}

///////////////////////////////////////////////////////////////////////////

function useItems() {
  const [items, setItems] = useState({ status: "loading" });

  useEffect(() => {
    if (items.data == null) {
      var accountData = new AdminService().accountData;

      getItems(accountData.token);
    }
  }, [items]);

  const getItems = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new ReportingService().GET_ITEMS)
      .then(function (response) {
        const d = response.data;

        setItems({ data: d, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setItems({ data: [], status: "empty" });
          } else {
            setItems({ data: [], status: "error" });
          }
        } else {
          setItems({ data: [], status: "error" });
        }
      });

    ////
  };

  return items;
}

///////////////////////////////////////////////////////////////////////////

function useLocations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (locations.length == 0) {
      var accountData = new AdminService().accountData;

      getLocations(accountData.token);
    }
  }, [locations]);

  const getLocations = (token) => {
    const locInstance = axios.create(new AdminService().getHeaders(token));

    locInstance
      .get(new TransportService().GET_LOCATIONS_BY_LEVEL)
      .then(function (response) {
        const d = response.data;

        setLocations(d);
      })
      .catch(function (error) { });

    ////
  };

  return locations;
}

///////////////////////////////////////////////////////////////////////////

function useCommissionTypes() {
  const [commissionTypes, setCommissionTypes] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (commissionTypes.data == null) {
      getCommissionTypes(accountData.token);
    }
  }, [commissionTypes]);

  const getCommissionTypes = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new FinanceService().GET_COMMISSION_TYPES)
      .then(function (response) {
        const d = response.data;

        setCommissionTypes({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setCommissionTypes({ data: [], status: "empty" });
          } else {
            setCommissionTypes({ data: [], status: "error" });
          }
        } else {
          setCommissionTypes({ data: [], status: "error" });
        }
      });

    ////
  };

  return commissionTypes;
}

///////////////////////////////////////////////////////////////////////////

function useTransactionTypes() {
  const [transactionTypes, setTransactionTypes] = useState({
    status: "loading",
  });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (transactionTypes.data == null) {
      getItemTypes(accountData.token);
    }
  }, [transactionTypes]);

  const getItemTypes = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new FinanceService().GET_TRANSACTION_TYPES)
      .then(function (response) {
        const d = response.data;

        setTransactionTypes({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setTransactionTypes({ data: [], status: "empty" });
          } else {
            setTransactionTypes({ data: [], status: "error" });
          }
        } else {
          setTransactionTypes({ data: [], status: "error" });
        }
      });

    ////
  };

  return transactionTypes;
}


///////////////////////////////////////////////////////////////////////////

function useAgents() {
  const [agents, setAgents] = useState({
    status: "loading",
  });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (agents.data == null) {
      getItemTypes(accountData.token);
    }
  }, [agents]);

  const getItemTypes = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new FinanceService().GET_ALL_AGENTS_FOR_SERVICE_FEE)
      .then(function (response) {
        const d = response.data;

        setAgents({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setAgents({ data: [], status: "empty" });
          } else {
            setAgents({ data: [], status: "error" });
          }
        } else {
          setAgents({ data: [], status: "error" });
        }
      });

    ////
  };

  return agents;
}

///////////////////////////////////////////////////////////////////////////

function useInternalAccounts() {
  const [accounts, setAccounts] = useState({
    status: "loading",
  });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (accounts.data == null) {
      getInternalAccounts(accountData.token);
    }
  }, [accounts]);

  const getInternalAccounts = (token) => {
    const internalInstance = axios.create(new AdminService().getHeaders(token));

    internalInstance
      .get(
        new FinanceService().GET_ALL_ACCOUNTS +
        "?account_type_name=INTERNAL&per_page=500"
      )
      .then(function (response) {
        const d = response.data;
        setAccounts({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setAccounts({ data: [], status: "empty" });
          } else {
            setAccounts({ data: [], status: "error" });
          }
        } else {
          setAccounts({ data: [], status: "error" });
        }
      });

    ////
  };

  return accounts;
}

///////////////////////////////////////////////////////////////////////////

function useAccountTypes() {
  const [types, setTypes] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (types.data == null) {
      getTypes(accountData.token);
    }
  }, [types]);

  const getTypes = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new FinanceService().GET_ACCOUNT_TYPES)
      .then(function (response) {
        const d = response.data;
        setTypes({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setTypes({ data: [], status: "empty" });
          } else {
            setTypes({ data: [], status: "error" });
          }
        } else {
          setTypes({ data: [], status: "error" });
        }
      });

    ////
  };

  return types;
}
/////////////////////////////////////////////////////////////////////////////////////

function useCommissions() {
  const [commissions, setCommissions] = useState({ status: "loading" });

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (commissions.data == null) {
      getCommissions(accountData.token);
    }
  }, [commissions]);

  const getCommissions = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    typesInstance
      .get(new FinanceService().GET_ALL_COMMISSIONS)
      .then(function (response) {
        const d = response.data;
        if (d?.data?.length == 0) {
          setCommissions({ data: [], status: "empty" });
        } else {
          setCommissions({ data: d.data, status: "success" });
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setCommissions({ data: [], status: "empty" });
          } else {
            setCommissions({ data: [], status: "error" });
          }
        } else {
          setCommissions({ data: [], status: "error" });
        }
      });

    ////
  };

  return commissions;
}

/////////////////////////////////////////////////////////////////////////////////////

function useOrganizationCommissions(props) {
  const [commissions, setCommissions] = useState({
    status: "loading",
  });

  const id = props?.id;

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (commissions.data == null) {
      getCommissions(accountData.token);
    }
  }, [commissions]);

  const getCommissions = (token) => {
    const typesInstance = axios.create(new AdminService().getHeaders(token));

    const url =
      id == null
        ? new AdminService().GET_ORGANIZATION_COMMISSIONS
        : new AdminService().GET_ORGANIZATION_COMMISSION_BY_ORGANIZATION_ID +
        id;
    typesInstance
      .get(url)
      .then(function (response) {
        const d = response.data;
        setCommissions({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setCommissions({ data: [], status: "empty" });
          } else {
            setCommissions({ data: [], status: "error" });
          }
        } else {
          setCommissions({ data: [], status: "error" });
        }
      });

    ////
  };

  return commissions;
}

/////////////////////////////////////////////////////////////////////////////////////

function useLicenses(props) {
  const [licenses, setLicenses] = useState({ status: "loading" });

  const id = props?.id;

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (licenses.data == null) {
      getLicenses(accountData.token);
    }
  }, [licenses]);

  const getLicenses = (token) => {
    const licInstance = axios.create(new AdminService().getHeaders(token));

    const url =
      id == null
        ? new AdminService().GET_ALL_LICENSES
        : new AdminService().GET_LICENSE_BY_ORGANIZATION_ID + id;

    licInstance
      .get(url)
      .then(function (response) {
        const d = response.data;
        setLicenses({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setLicenses({ data: [], status: "empty" });
          } else {
            setLicenses({ data: [], status: "error" });
          }
        } else {
          setLicenses({ data: [], status: "error" });
        }
      });

    ////
  };

  return licenses;
}


/////////////////////////////////////////////////////////////////////////////////////

function useGetOrganization(props) {
  const [organization, setOrganization] = useState({ status: "loading" });

  const id = props?.id;

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (organization.data == null) {
      getOrganization(accountData.token);
    }
  }, [organization]);

  const getOrganization = (token) => {
    const licInstance = axios.create(new AdminService().getHeaders(token));

    const url = new AdminService().GET_ORGANIZATION_BY_ID + id;

    licInstance
      .get(url)
      .then(function (response) {
        const d = response.data;
        setOrganization({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setOrganization({ data: [], status: "empty" });
          } else {
            setOrganization({ data: [], status: "error" });
          }
        } else {
          setOrganization({ data: [], status: "error" });
        }
      });

    ////
  };

  return organization;
}

/////////////////////////////////////////////////////////////////////////////////////

function useOrgAgents(props) {
  const [agents, setAgents] = useState({ status: "loading" });

  const id = props?.id;

  useEffect(() => {
    var accountData = new AdminService().accountData;

    if (agents.data == null) {
      getAgents(accountData.token);
    }
  }, [agents]);

  const getAgents = (token) => {
    const agInstance = axios.create(new AdminService().getHeaders(token));

    const url =new AdminService().GET_AGENTS_WITHOUT_MANAGER+ id;

    agInstance
      .get(url)
      .then(function (response) {
        const d = response.data;
        setAgents({ data: d.data, status: "success" });
      })
      .catch(function (error) {
        if (error.response) {
          if (error?.response?.status == 404) {
            setAgents({ data: [], status: "empty" });
          } else {
            setAgents({ data: [], status: "error" });
          }
        } else {
          setAgents({ data: [], status: "error" });
        }
      });

    ////
  };

  return agents;
}

export {
  useOrganizations,
  useRoles,
  useOrgRoles,
  useItemTypes,
  useItems,
  useLocations,
  useCommissionTypes,
  useTransactionTypes,
  useInternalAccounts,
  useAccountTypes,
  useCommissions,
  useOrganizationCommissions,
  useLicenses,
  useOperators,
  useGetOrganization,useOrgAgents,
  useAgents
};
