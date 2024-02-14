import { useState, useEffect } from "react";
import {BackendService} from "../utils/web_config";
const axios = require("axios");

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


function useLicenses() {
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
          const d = response.data;
          setLicenses(d.data);
        })
        .catch(function (error) { });
  };

  return licenses;
}


export {
  useOrganizations,
  useRoles,
  useLicenses
};
