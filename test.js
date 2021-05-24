const imgDownloader = require('./index');

let kekw = new imgDownloader('assets/images');

kekw.download('https://i.pinimg.com/originals/92/17/a8/9217a86945b10b32d03b1ae913d4af14.jpg', 'image1.jpg')
.then((response) =>{
    if(response){
        console.log("image is downloaded ma dude");
    }
})
.catch((e) =>{
    console.log(e)
})