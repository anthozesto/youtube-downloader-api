// api/download.js
const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  const url = req.query.url;
  if (!url || !ytdl.validateURL(url)) {
    res.status(400).send('URL YouTube invalide');
    return;
  }
  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, { format: 'mp4' }).pipe(res);
};
