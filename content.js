function createRegexFromArray(words) {
    const regexString = '(' + words.join('|') + ')';
    return new RegExp(regexString, 'gi');
  }

function underlineText(regex) {
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
        // const regex = /machine/gi;
        const wordsRegex = new RegExp("(" + regex.source + ")", "gi");

        let span = null;
        let index = -1;
        while ((result = wordsRegex.exec(text)) !== null) {
            if (span === null) {
                span = document.createElement("span");
                span.className='red-match-parent'
            }

            const match = result[0];
            const matchIndex = result.index;

            // check if match overlaps with previous match
            if (matchIndex < index + match.length) {
                continue;
            }

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

const words_to_underline = ["machine", "refined"]
const regex = createRegexFromArray(words_to_underline);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === 'onReplace') {
      underlineText(regex);
      console.log('Underlining enabled.');
      sendResponse({message: 'Underlining enabled.'});
    } else if (request.command === 'offReplace') {
      removeUnderlines();
      console.log('Underlining disabled.')
      sendResponse({message: 'Underlining disabled.'});
    }
  });


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.words) {
        // do something with the words, e.g. display them on the page
        console.log('Received words:', message.words);
        sendResponse({ success: true });
    } else {
        sendResponse({ success: false, message: 'Words not found in message' });
    }
});
