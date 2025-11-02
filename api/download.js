// api/download.js
module.exports = async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL YouTube manquante' });
    }
    
    try {
      // Nouvelle API Cobalt v9
      const response = await fetch('https://api.cobalt.tools/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          videoQuality: '720'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Vérifier le statut de la réponse
      if (data.status === 'redirect' && data.url) {
        // Redirection vers le fichier
        return res.redirect(data.url);
      } else if (data.status === 'picker' && data.picker && data.picker.length > 0) {
        // Plusieurs qualités disponibles, prendre la première
        return res.redirect(data.picker[0].url);
      } else if (data.status === 'error') {
        return res.status(400).json({ 
          error: 'Erreur de téléchargement',
          message: data.error?.code || 'Vidéo non disponible'
        });
      } else {
        return res.status(400).json({ 
          error: 'Format de réponse inattendu',
          data: data
        });
      }
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erreur serveur',
        details: error.message 
      });
    }
  };
  

