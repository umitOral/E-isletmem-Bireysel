
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import webpack from 'webpack'

const module={
    entry: ["@babel/polyfill","./public/js/appointments.js"],
    output: {
        path: path.resolve(__dirname+"/public", 'bundles'), 
        filename: 'appointments.js'
    },
    mode: 'development',
    
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
};


export default module