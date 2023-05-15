function cleanupDict(dict) {
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
  
function combineValueArrays(map) {
    const combinedArray = [];
  
    const keys = Array.from(map.keys());
    const numKeys = keys.length;
  
    for (let i = 0; i < numKeys - 1; i++) {
      const key = keys[i];
      const valueArray = map.get(key);
      combinedArray.push(...valueArray);
    }
  
    return combinedArray;
  }
  