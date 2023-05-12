
// function poolKeywords(dict){
//     // arrayafy dict
//     var arr = [...dict];

//     // pool keywords
//     var keyphrases = arr.map(e => e[1])

//     // lower case keyphrase and split into words
//     var keywords = keyphrases.map(e => e.toLowerCase().split(" "))

//     // flatten array
//     keywords = keywords.flat()

//     // remove punctuation
//     keywords = keywords.map(e => e.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim())
    
//     // remove empty strings
//     keywords = keywords.filter(element => !(element.trim() === ""));

//     // keep unique keywords
//     var uniqueKeywords = [...new Set(keywords)]

//     // filter out stop words
//     const filteredWords = uniqueKeywords.filter(word => !stopWords.includes(word));

//     // return
//     return filteredWords
// }


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
  
  