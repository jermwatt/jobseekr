
function createRegexFromArray(words) {
    const regexString = '(' + words.join('|') + ')';
    return new RegExp(regexString, 'gi');
  }

function underlineText(wordsRegex) {
    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

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
                span.className='red-match-parent'
            }

            const match = result[0];
            const matchIndex = result.index;

            // // check if match overlaps with previous match
            // if (matchIndex < index + match.length) {
            //     console.log('pre-match ' + match)
            //     console.log("pre-matchIndex: " + matchIndex);
            //     console.log("pre-index: " + (index + match.length));
            //     console.log('match overlaps with previous match')
            //     continue;
            // }

            // add everything before the match as a text node
            if (matchIndex > index + 1) {
                const textNode = document.createTextNode(
                    text.substring(index + 1, matchIndex)
                );
                span.appendChild(textNode);
            }
            

            // wrap the match in a span
            const matchNode = document.createElement("span");
            matchNode.className = "red-match"; // add class name to the new span element
            matchNode.style.textDecoration = "underline";
            matchNode.style.color = "red"; // make the underline color red
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
    const parentElements = document.getElementsByClassName("red-match-parent");
    while (parentElements.length) {
      const parent = parentElements[0];
      const textNode = document.createTextNode(parent.textContent.replace(/\n|\r/g, "").trim());
      parent.parentNode.replaceChild(textNode, parent);
    }
  }

  let words_to_underline = ['test', 'name', 'jeremy', 'machine', 'learning', 'engineer', 'published', 'textbook', 'university', 'press']
  let regex = createRegexFromArray(words_to_underline);
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'onReplace') 
    {
      underlineText(regex);
      console.log('Underlining enabled.');
      sendResponse({message: 'Underlining enabled.'});
    } 
    else if (message.command === 'offReplace') 
    {
      removeUnderlines();
      console.log('Underlining disabled.')
      sendResponse({message: 'Underlining disabled.'});
    } 
    else if (message.action === 'updateUnderlineWords') 
    {
      // update words_to_underline with the new words
      const newWords = message.filteredWords;
      words_to_underline.splice(0, words_to_underline.length, ...newWords);

      // update regex with the new words
      regex = createRegexFromArray(words_to_underline);
      console.log('Underline words updated:', words_to_underline);
      console.log('Regex updated:', regex);
      sendResponse({message: 'Underline words updated.'});
    }
  });
  