// api/download.js
// api/download.js
const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL manquante' });
    }
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'URL YouTube invalide' });
    }
    
    // Récupérer les infos de la vidéo
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').substring(0, 50);
    
    // Configurer les headers
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');
    
    // Télécharger en qualité moyenne (pour éviter timeout)
    ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioandvideo'
    }).pipe(res);
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Erreur lors du téléchargement',
      details: error.message 
    });
  }
};

