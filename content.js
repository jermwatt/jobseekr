chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.command === "onReplace") {
        // // replace all occurrences of "machine" with "alien" in the body text
        // function replaceText() {
        //     const treeWalker = document.createTreeWalker(
        //     document.body,
        //     NodeFilter.SHOW_TEXT,
        //     null,
        //     false
        //     );
        
        //     let node;
        //     while ((node = treeWalker.nextNode())) {
        //         // ignore text inside script and style tags
        //         if (
        //             node.parentNode.tagName === "SCRIPT" ||
        //             node.parentNode.tagName === "STYLE"
        //         ) {
        //             continue;
        //         }
            
        //         // ignore text inside image tags
        //         if (node.parentNode.tagName === "IMG") {
        //             continue;
        //         }
            
        //         // ignore text inside div tags that are not paragraphs
        //         if (node.parentNode.tagName === "DIV" && node.parentNode.tagName !== "P") {
        //             continue;
        //         }
            
        //         // conduct adjustment on word 'machine'
        //         // const regex = /machine/gi;
        //         // // node.textContent = node.textContent.replace(regex, "alien");

        //         // const text = node.textContent;
        //         // const replacedText = text.replace(regex, match => `<span style="text-decoration: underline; display: inline;">${match}</span>`);
        //         // node.textContent = replacedText;
        //         // console.log(node.innerHTML)

        //         // node.textContent = node.textContent.replace(regex, '<span style="text-decoration: underline">$&</span>')
                
        //         const regex = /machine/gi;
        //         const text = node.textContent;
        //         const wordsRegex = new RegExp("\\b(" + regex.source + ")\\b", "gi");
        
        //         let span = null;
        //         let index = -1;
        //         while ((result = wordsRegex.exec(text)) !== null) {
        //             if (span === null) {
        //                 span = document.createElement("span");
        //             }
            
        //             const match = result[0];
        //             const matchIndex = result.index;
            
        //             // check if match overlaps with previous match
        //             if (matchIndex < index + match.length) {
        //                 continue;
        //             }
            
        //             // add everything before the match as a text node
        //             if (matchIndex > index + 1) {
        //                 const textNode = document.createTextNode(
        //                 text.substring(index + 1, matchIndex)
        //                 );
        //                 span.appendChild(textNode);
        //             }
            
        //             // wrap the match in a span
        //             const matchNode = document.createElement("span");
        //                 matchNode.style.textDecoration = "underline";
        //                 matchNode.style.color = "red"; // make the underline color red
        //                 matchNode.style.backgroundColor = "transparent"; // make the background color transparent
        //                 matchNode.style.borderBottom = "3px solid red"; // add a red underline

        //                 matchNode.appendChild(document.createTextNode(match));
        //                 span.appendChild(matchNode);
                
        //                 index = matchIndex + match.length - 1;

        //                 console.log('-- span --')
        //                 console.log(span)
        //         }
        
        //         if (span !== null) {
        //             // add everything after the last match as a text node
        //             if (index < text.length - 1) {
        //                 const textNode = document.createTextNode(text.substring(index + 1));
        //                 span.appendChild(textNode);
        //             }
        
        //             // replace the original text node with the span
        //             node.parentNode.replaceChild(span, node);
        //         }
        //     }
        // }

        // replaceText();


        function underlineText() {
            const regex = /machine/gi;
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
                const wordsRegex = new RegExp("\\b(" + regex.source + ")\\b", "gi");
        
                let span = null;
                let index = -1;
                while ((result = wordsRegex.exec(text)) !== null) {
                    if (span === null) {
                        span = document.createElement("span");
                        // span.style.textDecoration = "underline";
                        // span.style.color = "red"; // make the underline color red
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

       underlineText();
        console.log('machine --> alien')

      } else if (request.command === "offReplace") {

        // replace all occurrences of "machine" with "alien" in the body text
        function replaceText() {
            const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
            );
        
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
        
            // conduct adjustment on word 'alien'
            const regex = /alien/gi;
            node.textContent = node.textContent.replace(regex, "machine");
            }
        }
        replaceText();
        console.log('alien --> machine')
        }
      }
);