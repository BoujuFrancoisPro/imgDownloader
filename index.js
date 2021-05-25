
const fs = require('fs');
const path = require('path');
const url = require('url');
const axios = require('axios');



class imgDownloader {

    constructor(saveFolderPath) {
        this.saveFolderPath = path.normalize(saveFolderPath);
    }

    async download(url, fileName) {

        //check if parameters are ok
        if (typeof url === "undefined" && typeof url !== "string")
            throw new TypeError('url parameter expected a string. Received ' + typeof url);
        if (typeof fileName === "undefined" && typeof fileName !== "string")
            throw new TypeError('fileName parameter expected a string. Received ' + typeof fileName);
        
        //regex to check if the fileneame string is empty or has an unwanted extension
        let regex = /^[0-9a-zA-Z]+/;

        //if a file extension is found, only keep the name
        if(!fileName.match(regex))
            throw new Error('fileName should have no extension and not be empty');
        else
            //this will only take into account the name not the extension
            fileName = fileName.match(regex)[0];

        this.createFolder(this.saveFolderPath);

        // assemble the pull path with all the components folder fileName and the extension from the url
        let fullPath = path.resolve(this.saveFolderPath, fileName + this.getUrlFileType(url));
        //check if the full path is already taken if so the function will add the date to the filename
        fullPath = this.fileExists(fullPath);
        
    

        // try to download the image from the url
        let response;
        try {

            response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream'
            });

        } catch (e) {
            throw new Error('Could not retrieve image. Error code ' + e.response.status + ' ' + e.response.statusText);
        }

        // create a write stream pointing on the file
        let buffer = fs.createWriteStream(fullPath);

        //pipe the response data into it
        response.data.pipe(buffer)
        
        // return a promise that is either resolved when the save is completed 
        // or rejected when their is an error.
        return new Promise((resolve, reject) => {
            buffer.on('error', (err) =>{
                reject(err);
            });
            buffer.on('finish', () =>{
                resolve(fullPath);
            });
        });

    }

    createFolder(saveFolderPath) {

        //returns the path if it was created sucessfully or undefined if it already existed 
        // Error handling is left the the fs module
        return fs.mkdirSync(saveFolderPath, { recursive: true });
    }

    //checks if the file at fullPath already exists, if it does change the fileName of the current file
    //by adding the date
    fileExists(fullPath) {

        let parsedFullPath = path.parse(fullPath);

        if (fs.existsSync(fullPath)) {

            let date = new Date(Date.now());
            var today = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '-' + date.getSeconds();

            parsedFullPath.name = parsedFullPath.name + '-' + today; 
            parsedFullPath.base = parsedFullPath.name + parsedFullPath.ext;

            fullPath = path.format(parsedFullPath);
        }

        return fullPath;
    }

    //parse the url parameter and extract the filetype
    getUrlFileType(url){

        //get the path porion of the url
        let urlInstance = new URL(url);
        let urlPath = urlInstance.pathname;

        //get the fileType from the urlPath
       return path.extname(urlPath);
    }
}

module.exports = imgDownloader;