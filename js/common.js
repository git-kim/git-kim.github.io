function docReady(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}

docReady(function() {
    const elements = document.querySelectorAll(".post");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("copy", function(e) {
           // if (event.target.closest('.highlight')) return;
            e.preventDefault();
        }, false);
        elements[i].addEventListener("cut", function(e) {
            e.preventDefault();
        }, false);
        elements[i].ondragstart = function () { return false; };
    };
    
    document.querySelectorAll(".highlight")
  .forEach(highlightDiv => createCopyButton(highlightDiv)); // adds copy buttons to code blocks
  
    const themeToggleSwitch = document.querySelector('.theme-switch');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
      if (currentTheme === 'dark') {
          themeToggleSwitch.classList.add("checked");
      }
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: Dark)').matches;
        if (prefersDark) {
            themeToggleSwitch.classList.add("checked");
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    themeToggleSwitch.addEventListener("click", () => switchTheme(themeToggleSwitch));
});

// https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8

function switchTheme(themeToggleSwitch) {
    themeToggleSwitch.classList.toggle('checked');
    if (themeToggleSwitch.classList.contains('checked')) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        console.log('light');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}





// ============================ https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/


function createCopyButton(highlightDiv) {
  const button = document.createElement("button");
  button.className = "copy-code-button";
  button.type = "button";
  button.innerText = "Copy";
  button.addEventListener("click", () => copyCodeToClipboard(button, highlightDiv));
  addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
  const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code").innerText;
  try {
    result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  }
  finally {
    codeWasCopied(button);
  }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
  const textArea = document.createElement("textArea");
  textArea.contentEditable = 'true'
  textArea.readOnly = 'false'
  textArea.className = "copyable-text-area";
  textArea.value = codeToCopy;
  highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
  const range = document.createRange()
  range.selectNodeContents(textArea)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
  textArea.setSelectionRange(0, 999999)
  textArea.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', textArea.value);
    e.clipboardData.setData('text/html', textArea.value);
    e.preventDefault();
  });
  document.execCommand("copy");
  highlightDiv.removeChild(textArea);
}

function codeWasCopied(button) {
  button.blur();
  button.innerText = "Copied!";
  setTimeout(function() {
    button.innerText = "Copy";
  }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
  highlightDiv.insertBefore(button, highlightDiv.firstChild);
  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

