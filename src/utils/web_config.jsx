import React from "react";

class BackendService {
  constructor() {
    var data = {};
    const data1 = localStorage.getItem("LMIS");
    if (data1 != null) {
      data = JSON.parse(data1);
    }
    this.accountData = data;
    this.ORIGIN = process.env.REACT_APP_ORIGIN;
    this.BASE_URL = process.env.REACT_APP_BASE_URL;
    this.LOGIN = this.BASE_URL + "/api/v1/auth/sign-in";
    this.GENERAL_STATS = this.BASE_URL + "/api/v1/reports/generalStats";
    this.GET_ORGANIZARION_TYPE_STATS = this.BASE_URL + "/api/v1/reports/organizationTypeStats";
    this.LICENSES = this.BASE_URL + "/api/v1/license";
    this.ORGANIZATIONS = this.BASE_URL + "/api/v1/organization";
    this.ROLES = this.BASE_URL + "/api/v1/role";
    this.PRIVILEGE = this.BASE_URL + "/api/v1/privilege";
    this.LICENSE_REQUEST_TYPE_STATS = this.BASE_URL + "/api/v1/reports/licenseRequestStatusStats";
    this.GET_ROLE_PRIVILEGE = this.BASE_URL + "/api/v1/role/privileges/";
    this.USERS = this.BASE_URL + "/api/v1/user";
    this.ORGANIZATION_LICENSE_REQUEST = this.BASE_URL + "/api/v1/licenseRequest/organization/"
    this.LICENSE_REQUEST = this.BASE_URL + "/api/v1/licenseRequest"
    this.REVIEW_LICENSE_REQUEST = this.BASE_URL + "/api/v1/licenseRequest/reportView/"
    this.DECISION_LICENSE_REQUEST = this.BASE_URL + "/api/v1/licenseRequest/decision/";
  }

  getHeaders = (token) => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
        Authorization: "Bearer " + this.accountData.access_token,
      },
    };
  };
}




class Validator {
  validEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validUsername(u) {
    const re = /^[a-z\d]{5,20}$/i;

    return re.test(String(u).toLowerCase());
  }

  validUrl(u) {
    const re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;

    return re.test(String(u).toLowerCase());
  }

  difference(a1, a2) {
    //console.log(a1.length, a2.length);
    return a1.filter(({ role_privilege_id: id1 }) =>
      a2.some(({ role_privilege_id: id2 }) => id2 != id1)
    );
  }

  tooShort(s) {
    return s.length < 3;
  }

  formatNumber(number) {
    const SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
    const sign = number < 0 ? '-1' : '';
    const absNumber = Math.abs(number);
    const tier = Math.log10(absNumber) / 3 | 0;
    // if zero, we don't need a prefix
    if(tier == 0) return `${absNumber}`;
    // get postfix and determine scale
    const postfix = SI_POSTFIXES[tier];
    const scale = Math.pow(10, tier * 3);
    // scale the number
    const scaled = absNumber / scale;
    const floored = Math.floor(scaled * 10) / 10;
    // format number and add postfix as suffix
    let str = floored.toFixed(1);
    // remove '.0' case
    str = (/\.0$/.test(str)) ? str.substr(0, str.length - 2) : str;
    return `${sign}${str}${postfix}`;
}

  groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  sum(items, prop) {
    return items.reduce(function (a, b) {
      return parseInt(a) + parseInt(b[prop]);
    }, 0);
  }

  parsePagination=(link)=>{
  
    var out={}
    
    if(link===undefined){
      return null
    }
    link.split(",").map((l)=>{
      var l=l.trim()
    
      var parts=l.split(";")
      var url=parts[0]
      var rel=parts[1]
     
      //get url params
      var params=new URLSearchParams(url)
      var n=params.get("page")
      var x=rel.split("=")[1]
    
    //replace all ' from x
    x=x.replace(/'/g,"")
    //retsrieve number from n
    var num=n.replace(/[^0-9]/g,"")
    
      if(x=="next"){
      out["next"]=num;
      }
      
      if(x=="last"){
        out["last"]=num
      }
     
    })
     return out;
    }
}
const hasPermission = (perm) => {
  var data = new BackendService().accountData;
  if (data.permissions == null) {
    return false;
  } else if (perm == "GRANTED") {
    return true;
  } else {
    var perms = data.permissions;
    return perms.filter((obj) => obj.name == perm).length != 0;
  }
};

function Permissions(props) {
  const { permissions } = props;

  //compare if permission match here
  var match = hasPermission(permissions);

  return <>{match ? props.children : <></>}</>;
}



export {
  BackendService,
  Validator,
  Permissions,
  hasPermission
};
