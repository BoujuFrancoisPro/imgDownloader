# imgDownloader5

## Installation 

```npm install imgdownloader```
 
## Usage

```js
const imgDownloader = require('./index');

let client = new imgDownloader('images');

client.download('https://ih1.redbubble.net/image.304946829.8458/flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg', 'image1')
.then((response) =>{
    /*
        download and save was a success 
        response = path to the image
    */
});

function getImage2() {
  client.download('https://www.vhv.rs/dpng/d/440-4407000_shrek-dankmemes-aesthetic-perfection-cringe-shrek-dank-meme.png', 'image2');
}

function getImage3(){
    client.download('https://i.pinimg.com/originals/5e/ff/30/5eff305327dd634da3110514c7cb1187.jpg', 'image3');
}

Promise.all([getImage2(), getImage3()])
.then((response) => {
    // ...
});
```
**Note** : There is no need to add the the file extension it will automatically be pick up from the url

## API

### imgDownloader(saveFolderPath)

#### saveFolderPath

Type: `string`

The foler in which you would like to save your future images

### Instance

#### .download(url, fileName)

Downloads and save a file to the given path.

**If the fileName is already taken the current date will be added to avoid overlapping.**

Returns a promise that resolves once the downlad and save is finished 

##### url

Type: `string`

The url from which you with to get the image

##### fileName

Type: `string`

The fileName that will be used to save the image. There is no need to give it a file extension.