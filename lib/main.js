const {Cc,Ci,Cu} = require("chrome");

const xpcom = require("xpcom");

try { Cu.import("resource://gre/modules/Services.jsm"); } catch (e) { }
try { Cu.import("resource://gre/modules/XPCOMUtils.jsm"); } catch (e) { }
try { Cu.import("resource://gre/modules/NetUtil.jsm"); } catch (e) { }

// Include our custom Modules
const securityReportUI = require("securityReportUI");



// Register ToolBox Panel
securityReportUI.registerSecurityReportTool();


// --------------------------------------------------------------------
// Add-on Unload Routine
require("unload").when(function() { 
    // Unregister security report tool
    securityReportUI.securityReportToolUnregister();
});
// --------------------------------------------------------------------

