const {Cc,Ci,Cu} = require("chrome");

// Get Developers Tools

const {gDevTools} = Cu.import("resource:///modules/devtools/gDevTools.jsm", {}); 

let Toolbox;
try {
	// This file doesn't exists in FF23.0a2 or it's path is incorrect.
	Toolbox = Cu.import("resource:///modules/devtools/Toolbox.jsm", null);
} catch (e) {
	// dump("\n\n\n ERROR in importing Toolbox.jsm file!!!");
}
let TargetFactory;
let tools;
try {
	tools = Cu.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools;
	TargetFactory = tools.TargetFactory;
} catch (e) { }

// FileUtils for handling files
Cu.import("resource://gre/modules/FileUtils.jsm");

/* Depending on the version of Firefox, promise module can have different path */
try { Cu.import("resource://gre/modules/commonjs/promise/core.js"); } catch(e) { }
try { Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js"); } catch(e) { }

var data = require("self").data;
const observer = require('observer-service');
var tabs = require("sdk/tabs");
const {URL} = require("url");

var observerService = null;


let reportUI = {
		init: function(iframeWindow, aToolbox) {
			this.toolbox = aToolbox;
			this.panelWin = iframeWindow;

			
			this.content = this.toolbox.target.tab.linkedBrowser.contentWindow;
			this._window = this.toolbox.target.tab.ownerDocument.defaultView;
			// dump("\n\n\n this.content = "+ this.content);
			// dump("\n this._window = "+ this._window);
			// let parentDoc = iframeWindow.document.defaultView.parent.document;
			// this.test();
			
			this._window.addEventListener("unload", this.destroy, false);
			
			// Download complete security report button clicked
			reportUI.panelWin.document.documentElement.addEventListener("downloadReport", function(event) {
				dump("\n Listner invoked for 'downloadReport' CustomEvent \n");				
			}, true);
			
			
			// Process change in the active tab
			reportUI.panelWin.document.documentElement.addEventListener("addon-message", function(event) {
				 dump("\n addon-message listner \n");
			}, true);	
			
		},
		
		destroy: function() {
			// dump("\n\n\ Destroy funciton invoked!!\n\n");
			this._window = null;
			this.content = null;
			return Promise.resolve(null);
		},

}; // end of reportUI function

		
 

exports.registerSecurityReportTool = function registerSecurityReportTool() {
	let securityToolDefinition = {
			id: "security-report-tool",
			label: "Security Report",
			icon: data.url("images/sec_report_icon.png"),
			url: data.url("securityReport.xhtml"),
			tooltip: "Security Report Tool",
			isTargetSupported: function(target) {
				return !target.isRemote;
			},
			build: function(iframeWindow, toolbox) {
				reportUI.init(iframeWindow, toolbox);
				return Promise.resolve(iframeWindow.reportUI);
			}
	};

	gDevTools.registerTool(securityToolDefinition); // register ToolBox
} // end of registerSecurityReportTool() function


// UnRegister Security Report Tool from ToolBox
exports.securityReportToolUnregister = function securityReportToolUnregister() {
	gDevTools.unregisterTool("security-report-tool");
	// dump("\n Security Report Tool is unregistered from ToolBox");	
} // end of securityReportToolUnregister() function


