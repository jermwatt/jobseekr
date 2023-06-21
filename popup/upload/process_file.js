
function getUniqueWords(text) {
    function cleanText(text) {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
      const webAddressRegex = /\b(?:https?:\/\/|www\.)\S+\b/g;
      const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{2,4}\b/g;
      const cleanText = text.replace(emailRegex, '').replace(webAddressRegex, '').replace(dateRegex, '').replace('.','');      
      const lowerText = cleanText.toLowerCase().match(/\b\w+\b/g);
      return lowerText;
    }
  
    // Remove dates in the format DD/MM/YYYY or DD-MM-YYYY
    text = cleanText(text);
  
    // Remove punctuation from text
    let uniqueWords = [...new Set(text)];
  
    // Remove number elements from the word list
    uniqueWords = uniqueWords.filter(word => isNaN(word));
    return uniqueWords
  }