chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.command === "onReplace") {
        // replace all occurrences of "machine" with "alien" in the body text
        function replaceText() {
            const regex = /machine/gi;
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
        
            node.textContent = node.textContent.replace(regex, "alien");
            }
        }
        replaceText();
  
      } else if (request.command === "offReplace") {

        // replace all occurrences of "machine" with "alien" in the body text
        function replaceText() {
            const regex = /alien/gi;
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
        
            node.textContent = node.textContent.replace(regex, "machine");
            }
        }
        replaceText();
        console.log('alien --> machine')
        }
      }
);
