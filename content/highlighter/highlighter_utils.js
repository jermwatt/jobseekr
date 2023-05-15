function createRegexFromArray(words) {
    const escapedWords = words.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regexString = '\\b(' + escapedWords.join('|') + ')\\b';
    return new RegExp(regexString, 'gi');
}

function underlineRedText(wordsRegex, targetElement) {
    if (!targetElement) {
        console.error('Target element not found.');
        return;
    }

    const treeWalker = document.createTreeWalker(
        targetElement,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    // list of nodes to be replaced
    const nodesToReplace = [];
    let node;
    while ((node = treeWalker.nextNode())) {
        // ignore text inside script and style tags
        if (
            node.parentNode.tagName === "SCRIPT" ||
            node.parentNode.tagName === "STYLE"
        ) {
            continue;
        }

        // ignore text inside image tags
        if (node.parentNode.tagName === "IMG") {
            continue;
        }

        // ignore text inside div tags that are not paragraphs
        if (node.parentNode.tagName === "DIV" && node.parentNode.tagName !== "P") {
            continue;
        }

        const text = node.textContent;
        let span = null;
        let index = -1;
        while ((result = wordsRegex.exec(text)) !== null) {
            if (span === null) {
                span = document.createElement("span");
                span.className='zoid-red-parent'
            }

            const match = result[0];
            const matchIndex = result.index;

            // add everything before the match as a text node
            if (matchIndex > index + 1) {
                const textNode = document.createTextNode(
                    text.substring(index + 1, matchIndex)
                );
                span.appendChild(textNode);
            }
            
            // wrap the match in a span
            const matchNode = document.createElement("span");
            matchNode.className = "zoid-red"; // add class name to the new span element
            matchNode.style.textDecoration = "underline";
            matchNode.style.color = "orangered"; // make the underline color red

            matchNode.appendChild(document.createTextNode(match));
            span.appendChild(matchNode);

            index = matchIndex + match.length - 1;

        }

        if (span !== null) {
            // add everything after the last match as a text node
            if (index < text.length - 1) {
                const textNode = document.createTextNode(text.substring(index + 1));
                span.appendChild(textNode);
            }

            // add the node to the list of nodes to be replaced
            nodesToReplace.push({ node, span });
        }
    }

    // replace all the nodes outside of the loop
    nodesToReplace.forEach(({ node, span }) => {
        node.parentNode.replaceChild(span, node);
    });
}


function underlineGreenText(wordsRegex, targetElement) {
    if (!targetElement) {
        console.error('Target element not found.');
        return;
    }

    const treeWalker = document.createTreeWalker(
        targetElement,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    // list of nodes to be replaced
    const nodesToReplace = [];
    let node;
    while ((node = treeWalker.nextNode())) {
        // ignore text inside script and style tags
        if (
            node.parentNode.tagName === "SCRIPT" ||
            node.parentNode.tagName === "STYLE"
        ) {
            continue;
        }

        // ignore text inside image tags
        if (node.parentNode.tagName === "IMG") {
            continue;
        }

        // ignore text inside div tags that are not paragraphs
        if (node.parentNode.tagName === "DIV" && node.parentNode.tagName !== "P") {
            continue;
        }

        const text = node.textContent;
        let span = null;
        let index = -1;
        while ((result = wordsRegex.exec(text)) !== null) {
            if (span === null) {
                span = document.createElement("span");
                span.className='zoid-green-parent'
            }

            const match = result[0];
            const matchIndex = result.index;

            // add everything before the match as a text node
            if (matchIndex > index + 1) {
                const textNode = document.createTextNode(
                    text.substring(index + 1, matchIndex)
                );
                span.appendChild(textNode);
            }
            
            // wrap the match in a span
            const matchNode = document.createElement("span");
            matchNode.className = "zoid-green"; // add class name to the new span element
            matchNode.style.textDecoration = "underline";
            matchNode.style.color = "forestgreen"; // make the underline color red

            matchNode.appendChild(document.createTextNode(match));
            span.appendChild(matchNode);

            index = matchIndex + match.length - 1;

        }

        if (span !== null) {
            // add everything after the last match as a text node
            if (index < text.length - 1) {
                const textNode = document.createTextNode(text.substring(index + 1));
                span.appendChild(textNode);
            }

            // add the node to the list of nodes to be replaced
            nodesToReplace.push({ node, span });
        }
    }

    // replace all the nodes outside of the loop
    nodesToReplace.forEach(({ node, span }) => {
        node.parentNode.replaceChild(span, node);
    });
}
             
function removeUnderlines() {
    const redParentElements = document.getElementsByClassName("zoid-red-parent");
    while (redParentElements.length) {
      const parent = redParentElements[0];
      const textNode = document.createTextNode(parent.textContent.replace(/\n|\r/g, "").trim());
      parent.parentNode.replaceChild(textNode, parent);
    }

    const greenParentElements = document.getElementsByClassName("zoid-red-parent");
    while (greenParentElements.length) {
      const parent = greenParentElements[0];
      const textNode = document.createTextNode(parent.textContent.replace(/\n|\r/g, "").trim());
      parent.parentNode.replaceChild(textNode, parent);
    }
  }

function computeWordComparison(pageWords, fileWords) {
    const commonElements = pageWords.filter(word => fileWords.includes(word));
    const uniqueElements = pageWords.filter(word => !fileWords.includes(word));
  
    return {
      commonElements,
      uniqueElements
    };
  }
  
// main switch for underlining / removing underlines
let red_words_to_underline = []
let redRegex = createRegexFromArray(red_words_to_underline);

let green_words_to_underline = []
let greenRegex = createRegexFromArray(green_words_to_underline);

function underlineSwitch(message, targetElement, sendResponse) {
    if (message.command === 'onReplace') 
    {   
        console.log('onReplace triggered')
        underlineRedText(redRegex, targetElement);
        underlineGreenText(greenRegex, targetElement);
        console.log('Underlining enabled.');
        sendResponse({message: 'Underlining enabled.'});
    } 
    else if (message.command === 'offReplace') 
    {   
        console.log('offReplace triggered')
        removeUnderlines();
        console.log('Underlining disabled.')
        sendResponse({message: 'Underlining disabled.'});
    } 
    else if (message.action === 'updateUnderlineWords') 
    {
        //// retrieve fileWords ////
        // receive words from message
        let fileWords = message.fileWords;

        // filter words
        fileWords = fileWords
        .filter((word) => word !== '') // Remove empty strings
        .filter((word) => !stopWords.includes(word)); // Filter out stop words

        // console.log('fileWords:', fileWords)

        //// load pageWords from storage ////
        let pageWords = [];
        chrome.storage.local.get('pageWords', function(result) {
            pageWords = result.pageWords;
          
        if (Array.isArray(pageWords)) {
        } else {
            console.log('No pageWords array found in local storage');
        }
          
        // compute word comparison
        let elements = computeWordComparison(pageWords, fileWords)

        // update words_to_underline with the new words
        red_words_to_underline.splice(0, red_words_to_underline.length, ...elements['uniqueElements']);
        green_words_to_underline.splice(0, red_words_to_underline.length, ...elements['commonElements']);

        // update regex with the new words
        redRegex = createRegexFromArray(red_words_to_underline);
        greenRegex = createRegexFromArray(green_words_to_underline);
        sendResponse({message: 'Underline words updated.'});
    });

    }
}