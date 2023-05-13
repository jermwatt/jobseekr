function poolKeywords(dict) {
    const processedDict = new Map();
  
    dict.forEach((value, key) => {
      const processedValue = value
        .toLowerCase() // Lowercase the value
        .split(' ') // Split into words
        .map((word) => word.replace(/[\(\)\[\]{}!?.,]/g, '').trim()) // Remove specific symbols
        .filter((word) => word !== '') // Remove empty strings
        .filter((word) => !stopWords.includes(word)); // Filter out stop words
      processedDict.set(key, processedValue);
    });
  
    return processedDict;
  }
  
  