import { AccountBalance, AccountBalanceWallet, AcUnit, Atm, CompareArrows, ConfirmationNumber, Contactless, CreditCard, Dvr, Group, Person, RotateLeft, TrendingDown } from "@material-ui/icons";
import React, { useEffect } from "react";

class BackendService {
  constructor() {
    var data = {};
    const data1 = localStorage.getItem("LMIS");
    if (data1 != null) {
      data = JSON.parse(data1);
    }
    this.accountData = data;

    this.ORIGIN = process.env.REACT_APP_ORIGIN;
    this.BASE_URL = getMsUrl('ad');
    this.LOGIN = this.BASE_URL + "/api/v1/auth/login";
    this.GET_ALL_USERS = this.BASE_URL + "/api/v1/users";
    this.GET_USERS_BY_ORGANIZATION_ID =
      this.BASE_URL + "/api/v1/user/organization/";
      this.GET_USERS_BY_TYPE =
      this.BASE_URL + "/api/v1/user/type/";
    this.CREATE_USER = this.BASE_URL + "/api/v1/user/register";
    this.UPDATE_USER = this.BASE_URL + "/api/v1/user/";

  }

  getHeaders = (token) => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
        Authorization: "Bearer " + token,
        "DeviceType":"OTHER"
      },
    };
  };

  getMsHeaders = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": this.ORIGIN,
        Authorization: "Basic online::"+process.env.REACT_APP_TOKEN,
        "DeviceType":"OTHER"
      },
    };
  };

  getBankCodes= () => {
    return [
      {
         "code": "00000","name":"BNR KIGALI"
      },
      {
          "code": "00010","name":"I AND M BANK"
      },
      {
          "code": "00020","name":"AB BANK"
      },
      {
          "code": "00025","name":"Commercial Bank of Africa Rwanda Plc"
      },
      {
          "code": "00040","name":"BK KIGALI"
      },
      {
          "code": "00070","name":"FINABANK KIGALI"
      },
      {
          "code": "00090","name":"UMWALIMU SACCO"
      },
      {
          "code": "00100","name":"ECOBANK KIGALI"
      },
      {
          "code": "00115","name":"ACCESS BANK KIGALI"
      },
      {
          "code": "00130","name":"CGBK CENTRALE"
      },
      {
          "code": "00145","name":"UOB KIGALI"
      },
      {
          "code": "00160","name":"KCB KIGALI"
      },
      {
          "code": "00175","name":"ZIGAMA CREDIT SAVING SCHEME"
      },
      {
          "code": "00192","name":"EQUITY BANK"
      },
      {
          "code": "00208","name":"BANK OF AFRICA RWANDA"
      },
      {
          "code": "00224","name":"UNGUKA"
      },
      {
          "code": "00400","name":"BPR KIGALI"
      }
  ];
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

function p(){
  return window.location.protocol==='https:'
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

const getMsUrl=(ms)=>{
  switch(ms){
    case 'ad':
      return p()?process.env.REACT_APP_ADMIN_URL_SECURE:process.env.REACT_APP_ADMIN_URL
    case 'fin':
      return p()?process.env.REACT_APP_FINANCE_URL_SECURE:process.env.REACT_APP_FINANCE_URL
    case 'tr':
      return p()?process.env.REACT_APP_TRANSPORT_URL_SECURE:process.env.REACT_APP_TRANSPORT_URL
    case 're':
      return p()?process.env.REACT_APP_REPORTING_URL_SECURE:process.env.REACT_APP_REPORTING_URL
    case 'wz':
      return p()?process.env.WIZANALYTICS_BASEURL:process.env.WIZANALYTICS_BASEURL
    default:
      return "Unknown url"

  }
}


export {
  BackendService,
  Validator,
  Permissions,
  hasPermission,
  getMsUrl
};
