function underlineText() {
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
        const regex = /machine/gi;
        // const wordsRegex = new RegExp("\\b(" + regex.source + ")\\b", "gi");

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

  
// // remove underlines from the text
// function removeUnderlines() {
//     const underlineElements = document.getElementsByClassName("red-match");
//     while (underlineElements.length) {
//     const element = underlineElements[0];
//     const parent = element.parentNode;
//     const textNode = document.createTextNode(element.textContent.replace(/\n|\r/g, "").trim());
//     parent.replaceChild(textNode, element);
//     }
// }

        

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === 'onReplace') {
      underlineText();
      console.log('Underlining enabled.');
      sendResponse({message: 'Underlining enabled.'});
    } else if (request.command === 'offReplace') {
      removeUnderlines();
      console.log('Underlining disabled.')
      sendResponse({message: 'Underlining disabled.'});
    }
  });