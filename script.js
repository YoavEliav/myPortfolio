/**
 * Portfolio Interactive Script
 * Author: Yoav Eliav
 * Description: Handles IDE interactions, file switching, typing animations, 
 * and dynamic content rendering for both code and terminal areas.
 */

// =========================================
//  1. Configuration & Data
// =========================================
const typingSpeed = 20;  // Milliseconds per character
let isTyping = false;    // Flag to prevent multiple typing animations

// --- NEW: Local Terminal Configuration ---
const terminalConfig = {
    local: {
        // Change the text here easily:
        bigTitle: "HELLO", 
        subTitle: "Thanks for exploring the site :)",
        iconClass: "fa-solid fa-check" // FontAwesome icon class
    }
};

// --- File Contents ---
const fileContents = {
    "about": `# Hello! I'm Yoav Eliav.
# I am a passionate Software Developer.

class Developer:
    def __init__(self):
        self.name = "Yoav Eliav"
        self.role = "Full Stack Developer"
        self.location = "Israel"
        self.description = "Loves writing clean code."

    def say_hello(self):
        print("Welcome to my portfolio!")

if __name__ == "__main__":
    yoav = Developer()
    yoav.say_hello()`,

    "skills": `{
  "languages": [
    "Python",
    "JavaScript",
    "C++"
  ],
  "frameworks": {
    "web": ["React", "Flask"],
    "data": ["Pandas", "NumPy"]
  }
}`,

    "projects": `# My Recent Projects

def get_projects():
    return [
        "Portfolio Website (You are here)",
        "AI Chatbot Agent",
        "E-commerce Platform"
    ]`,

    "contact": `CONTACT DETAILS
===============

Email: yoav@example.com
LinkedIn: linkedin.com/in/yoav
GitHub: github.com/yoav`
};

// =========================================
//  2. Helper Functions
// =========================================

/**
 * Removes whitespace from the start of the string to ensure line 1 is truly line 1.
 */
function cleanText(text) {
    if (!text) return "";
    return text.replace(/^\s+/, '');
}

/**
 * Generates dynamic line numbers based on text lines.
 */
function updateLineNumbers(text) {
    const lineNumbersCol = document.getElementById('line-numbers-col');
    if (!lineNumbersCol) return;

    if (!text) {
        lineNumbersCol.innerHTML = '1<br>';
        return;
    }

    const linesCount = text.split('\n').length;
    let linesHTML = '';
    for (let i = 1; i <= linesCount; i++) {
        linesHTML += `${i}<br>`;
    }
    
    lineNumbersCol.innerHTML = linesHTML;
}

/**
 * Updates the tab bar to match the current file.
 */
function updateTab(fileId) {
    const tabElement = document.getElementById('current-tab');
    let fileName = '';
    let iconClass = '';

    switch(fileId) {
        case 'about': fileName = 'about_me.py'; iconClass = 'fa-brands fa-python'; break;
        case 'skills': fileName = 'skills.json'; iconClass = 'fa-brands fa-js'; break;
        case 'projects': fileName = 'projects.py'; iconClass = 'fa-brands fa-python'; break;
        case 'contact': fileName = 'contact.txt'; iconClass = 'fa-solid fa-hashtag'; break;
    }
    tabElement.innerHTML = `<i class="${iconClass}"></i> ${fileName}`;
}

// =========================================
//  3. Core Logic: Content Rendering
// =========================================

/**
 * Injects the Local Terminal content based on the config object.
 * This keeps the HTML clean and allows easy text updates from JS.
 */
function initLocalTerminal() {
    const localContainer = document.getElementById('term-content-local');
    if (!localContainer) return;

    // Template Literal to inject HTML with config values
    const contentHTML = `
        <div class="local-message">
            <div class="success-icon"><i class="${terminalConfig.local.iconClass}"></i></div>
            <div class="hello-text">${terminalConfig.local.bigTitle}</div>
            <div class="system-msg">${terminalConfig.local.subTitle}</div>
        </div>
    `;

    localContainer.innerHTML = contentHTML;
}

function switchFile(fileId) {
    if (isTyping) return;

    // UI Updates
    document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.file-content').forEach(content => content.style.display = 'none');

    // Set Active
    const activeItem = document.querySelector(`.file-item[data-file="${fileId}"]`);
    if (activeItem) activeItem.classList.add('active');

    const activeContent = document.getElementById(`content-${fileId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        const codeBlock = activeContent.querySelector('code');
        
        if (codeBlock.textContent.trim() === "") {
             codeBlock.textContent = cleanText(fileContents[fileId]);
             Prism.highlightElement(codeBlock);
        }
        updateLineNumbers(cleanText(fileContents[fileId]));
    }

    updateTab(fileId);
}

function typeCode(elementId, text) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const codeBlock = container.querySelector('code');
    codeBlock.textContent = ""; 
    codeBlock.classList.add('typing'); 
    isTyping = true;
    updateLineNumbers(""); 

    let i = 0;
    function type() {
        if (i < text.length) {
            codeBlock.textContent += text.charAt(i);
            i++;
            if (text.charAt(i-1) === '\n' || i === 1) {
                updateLineNumbers(codeBlock.textContent);
            }
            setTimeout(type, typingSpeed);
        } else {
            isTyping = false;
            codeBlock.classList.remove('typing'); 
            Prism.highlightElement(codeBlock);
            updateLineNumbers(codeBlock.textContent);
        }
    }
    type();
}

function switchTerminalTab(target) {
    document.querySelectorAll('.term-tab').forEach(tab => {
        tab.classList.remove('active');
        if(tab.getAttribute('data-target') === target) tab.classList.add('active');
    });

    document.querySelectorAll('.term-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    const activeContent = document.getElementById(`term-content-${target}`);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
}

// =========================================
//  4. Initialization
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Local Terminal Text
    initLocalTerminal();

    // 2. Event Listeners
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            switchFile(item.getAttribute('data-file'));
        });
    });

    const termTabs = document.querySelectorAll('.term-tab');
    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTerminalTab(tab.getAttribute('data-target'));
        });
    });

    // 3. Start Intro Animation
    const aboutText = cleanText(fileContents['about']);
    typeCode('content-about', aboutText);

    // 4. Resizer Logic
    const resizer = document.getElementById('drag-handle');
    const terminalPanel = document.getElementById('terminal-panel');

    if (resizer && terminalPanel) {
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'row-resize';
            resizer.classList.add('dragging');
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const newHeight = window.innerHeight - e.clientY;
            terminalPanel.style.height = `${newHeight}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = 'default';
            resizer.classList.remove('dragging');
        });

        // Touch Support
        resizer.addEventListener('touchstart', (e) => { isResizing = true; resizer.classList.add('dragging'); e.preventDefault(); }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!isResizing) return;
            const touch = e.touches[0];
            const newHeight = window.innerHeight - touch.clientY;
            terminalPanel.style.height = `${newHeight}px`;
        }, { passive: false });
        document.addEventListener('touchend', () => { isResizing = false; resizer.classList.remove('dragging'); });
    }
});