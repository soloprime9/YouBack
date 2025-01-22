const express = require('express');
const app = express();
const axios = require('axios');
const youtubeApiKey = 'AIzaSyAB_shZHJgX0iTavG4raZyUPZiy-EQRVvA';
const cors = require("cors");

app.use(express.json());

app.use(cors ({
    origin: "http://localhost:3000"
}))

app.get("/", (req, res)=>{
    res.send("Hello Wrodl Bro")
})

// app.get('/download-thumbnail', async (req, res) => {
//     try {
//       const videoId = req.query.videoId;
//       const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
//       const response = await axios.get(url);
      
//       // Check if response.data.items is not empty
//       if (response.data.items && response.data.items.length > 0) {
//         const thumbnailUrl = response.data.items[0].snippet.thumbnails.default.url;
//         const thumbnailResponse = await axios.get(thumbnailUrl, { responseType: 'stream' });
//         const filename = thumbnailUrl.split('/').pop();
//         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//         res.setHeader('Content-Type', thumbnailResponse.headers['content-type']);
//         thumbnailResponse.data.pipe(res);
//       } else {
//         res.status(404).json({ message: 'Video not found' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error downloading thumbnail' });
//     }
//   });

// app.listen(4000, () => {
//   console.log('Server listening on port 4000');
// });








// app.get('/download-thumbnail', async (req, res) => {
//     try {
//       const videoUrl = req.query.videoUrl;
//       const videoId = getVideoIdFromUrl(videoUrl);
//       const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
//       const response = await axios.get(url);
//       const thumbnailUrl = response.data.items[0].snippet.thumbnails.default.url;
//       res.json({ thumbnailUrl });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error downloading thumbnail' });
//     }
//   });
  
//   function getVideoIdFromUrl(url) {
//     const urlParts = url.split('/');
//     const videoId = urlParts[urlParts.length - 1];
//     if (videoId.includes('?')) {
//       return videoId.split('?')[0];
//     }
//     return videoId;
//   }
  
// app.listen(4000, () => {
//   console.log('Server listening on port 4000');
// });



app.get('/download-thumbnail', async (req, res) => {
    try {
      const videoUrl = req.query.videoUrl;
      if (!videoUrl) {
        return res.status(400).json({ message: 'Video URL is required' });
      }
      const videoId = getVideoIdFromUrl(videoUrl);
      if (!videoId) {
        return res.status(400).json({ message: 'Invalid video URL' });
      }
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
      const response = await axios.get(url);
      if (response.data.items.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
      const thumbnails = response.data.items[0].snippet.thumbnails;
      const thumbnailUrls = {
        default: thumbnails.default.url,
        medium: thumbnails.medium.url,
        high: thumbnails.high.url,
        standard: thumbnails.standard ? thumbnails.standard.url : null,
        maxres: thumbnails.maxres ? thumbnails.maxres.url : null,
      };
      res.json({ thumbnailUrls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error downloading thumbnail' });
    }
  });
  
  app.get('/download-thumbnail/image', async (req, res) => {
    try {
      const thumbnailUrl = req.query.thumbnailUrl;
      if (!thumbnailUrl) {
        return res.status(400).json({ message: 'Thumbnail URL is required' });
      }
      const response = await axios.get(thumbnailUrl, { responseType: 'stream' });
      res.setHeader('Content-Disposition', 'attachment; filename="thumbnail.jpg"');
      res.setHeader('Content-Type', response.headers['content-type']);
      response.data.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error downloading thumbnail' });
    }
  });
  
  function getVideoIdFromUrl(url) {
    if (!url) {
      return null;
    }
    const urlParts = url.split('/');
    const videoId = urlParts[urlParts.length - 1];
    if (videoId.includes('?')) {
      return videoId.split('?')[0];
    }
    return videoId;
  }
app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
