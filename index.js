
const fs = require('fs');
const { type } = require('os');
const path = require('path');
const url = require('url');
const axios = require('axios');

class imgDownloader {

    constructor(saveFolderPath){
        this.saveFolderPath = path.normalize(saveFolderPath);
        this.fileExtensions = {
            jpg : ".jpg",
            png : ".png"
        }
    }

    //TODO REFACTOR THE SHIT OUT OF IT

    async download(url, fileName){
        
        let isDownloaded = false;

        //check if parameters are ok
        if(typeof url === "undefined" && typeof url !== "string")
            throw  new TypeError('url parameter expected a string. Received '+ typeof url);
        if(typeof fileName === "undefined" && typeof fileName !== "string")
            throw new TypeError('fileName parameter expected a string. Received '+ typeof fileName);
        

        //get the path porion of the url
        let urlInstance = new URL(url);
        let urlPath = urlInstance.pathname;

        //get the fileType from the urlPath
        let fileType = path.extname(urlPath);

        if(this.checkFileType(fileType)){

            this.createFolder(this.saveFolderPath);

            //assemble the save folder + the file name
            let fullPath = path.join(this.saveFolderPath, fileName);
            let parsedFullPath = path.parse(fullPath);

            //if image fileName is already taken add + Date
            if(fs.existsSync(fullPath)){
                
                parsedFullPath.name = parsedFullPath.name + '-' + new Date(Date.now()).toISOString() //TODO fix this date shit
                parsedFullPath.base = parsedFullPath.name + parsedFullPath.ext;

                fullPath = path.format(parsedFullPath);
            }

            //download the image from the url
            //@TODO add error handling

            let buffer = fs.createWriteStream(fullPath);

            let response = await axios({
                method : 'GET',
                url : url,
                responseType : 'stream'
            });

            //save it at the right location
            response.data.pipe(buffer)
            buffer.on('finish', () =>{
                isDownloaded = true;
            });
            
        }else{
            throw new Error('This file type is not supported' + fileType);
        }
        
        return isDownloaded
    }

    checkFileType(fileType){

        let isSupported = true;

        for(let [key, value] of Object.entries(this.fileExtensions)){
            if(fileType === value)
                isSupported = true;
                break;
        }

        return isSupported;
    }
    
    createFolder(saveFolderPath){
        
        //returns the path if it was created sucessfully or undefined if it already existed 
        // Error handling is left the the fs module
        return fs.mkdirSync(saveFolderPath, {recursive : true});
    }


}

module.exports = imgDownloader;