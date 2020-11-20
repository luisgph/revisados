class Environment {

  getEnviromentsConfig(){
    let env = {
      uri_api : '',
      clientId : '59cd7a41-d9c5-4f94-9bc6-2bb5da87410a',
      production: true,
    }; 

    let test = window.location.origin;
    if(test.includes("dev")){
      env.uri_api = 'https://app-apisar-v1-dev-crd-hd.azurewebsites.net/api/';
      return env;
    }

    if(test.includes("uat")){
      env.uri_api = 'https://app-apisar-v1-uat-crd-hd.azurewebsites.net/api/';
      return env;
    }

    if(test.includes("tng")){
      env.uri_api = 'https://app-apisar-v1-tng-crd-hd.azurewebsites.net/api/';
      return env;
    }

    if(test.includes("pro")){
      env.uri_api = 'https://app-apisar-v1-pro-crd-hd.azurewebsites.net/api/';
      return env;
    }

    return env;
  }
}

export const environment = new Environment().getEnviromentsConfig(); 