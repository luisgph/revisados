
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
class Environment {

  getEnviromentsConfig(){
    let env = {
      uri_api : '',
      clientId : '59cd7a41-d9c5-4f94-9bc6-2bb5da87410a',
      production: false,
    };

    let test = window.location.origin;
    if(test.includes('localhost')){
      env.uri_api = 'https://app-apisar-v1-dev-crd-hd.azurewebsites.net/api/';
      //env.uri_api = 'http://localhost:60765/api/';
    }

    return env;
  }
}

export const environment = new Environment().getEnviromentsConfig();

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
