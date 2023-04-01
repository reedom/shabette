import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  version: '0.1.0',
  manifest_version: 3,
  name: "Shabette",
  description: "A Text-to-Speech service",
  permissions: [
    "tabs",
    "activeTab",
    "contextMenus",
    "storage",
    "offscreen"
  ],
  host_permissions: [
    "https://*.amazonaws.com/",
    "https://*.googleapis.com/",
    "https://*.google.com/",
    "https://*.gstatic.com/"
  ],
  // options_page: "options.html",
  background: { "service_worker": "src/background/index.ts" },
  action: {
    "default_popup": "src/ui/pages/Popup/index.html",
    "default_icon": "img/icon-34.png"
  },
  icons: {
    "128": "img/icon-128.png"
  },
  content_scripts: [
    {
      "matches": ["http://*/*", "https://*/*", "<all_urls>"],
      "js": ["src/content/index.js"],
    }
  ],
  web_accessible_resources: [
    {
      "resources": ["img/icon-128.png", "img/icon-34.png"],
      "matches": []
    }
  ]
});
