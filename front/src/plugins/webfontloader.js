// src/plugins/webfontloader.js

export const loadFonts = () => {
    const WebFont = require('webfontloader');
  
    WebFont.load({
      google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
      },
    });
  };