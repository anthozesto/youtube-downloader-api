// api/download.js
module.exports = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL YouTube manquante' });
    }
    
    try {
      const response = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          vQuality: '720',
          filenamePattern: 'basic',
          isAudioOnly: false
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'redirect' || data.status === 'stream') {
        // Redirection vers le fichier de téléchargement
        return res.redirect(data.url);
      } else {
        return res.status(400).json({ 
          error: 'Impossible de télécharger',
          message: data.text || 'Vidéo non disponible'
        });
      }
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erreur serveur',
        details: error.message 
      });
    }
  };
  

