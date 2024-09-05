// SettingsService.js
const SettingsService = {
  get: async () => {
    // If settings are not defined, use the default settings from the provided JS file
    //  @ts-ignore
    const app = await fetch(`/settings/app.json`)
    const appJson = await app.json()
    const account = await fetch(`/settings/account.json`)
    const accountJson = await account.json()
    const style = await fetch("/settings/style.json")
    const styleJson = await style.json();
    //  @ts-ignore
    if (!window.__settings) {
      //  @ts-ignore
      window.__settings = {
        app: appJson,
        account: accountJson, 
        style: styleJson
      };   
    }
     //  @ts-ignore
     return window.__settings;
  },
};

export default SettingsService;
