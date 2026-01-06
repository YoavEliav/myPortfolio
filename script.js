// === Configuration ===
const typingSpeed = 20; 
let isTyping = false; 

// === Main Function to handle file switching ===
function switchFile(fileId) {
    if (isTyping) return; 

    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.file-content').forEach(content => {
        content.style.display = 'none';
    });

    const activeItem = document.querySelector(`.file-item[data-file="${fileId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    const activeContent = document.getElementById(`content-${fileId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }

    updateTab(fileId);
}

// === Function to switch Terminal Tabs (New!) ===
function switchTerminalTab(target) {
    // 1. Update Tabs Visuals
    document.querySelectorAll('.term-tab').forEach(tab => {
        tab.classList.remove('active');
        if(tab.getAttribute('data-target') === target) {
            tab.classList.add('active');
        }
    });

    // 2. Switch Content
    document.querySelectorAll('.term-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none'; // Ensure hidden
    });

    const activeContent = document.getElementById(`term-content-${target}`);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block'; // Show active
    }
}

// === Function to type code effect ===
function typeCode(elementId, text) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const codeBlock = container.querySelector('code');
    
    codeBlock.textContent = ""; 
    codeBlock.classList.add('typing'); 
    isTyping = true;

    let i = 0;
    
    function type() {
        if (i < text.length) {
            codeBlock.textContent += text.charAt(i);
            i++;
            // Scroll to end of line if needed while typing
            /* container.parentElement.scrollLeft = container.parentElement.scrollWidth; */
            setTimeout(type, typingSpeed);
        } else {
            isTyping = false;
            codeBlock.classList.remove('typing'); 
            Prism.highlightElement(codeBlock);
        }
    }
    
    type();
}

function updateTab(fileId) {
    const tabElement = document.getElementById('current-tab');
    let fileName = '';
    let iconClass = '';

    switch(fileId) {
        case 'about':
            fileName = 'about_me.py';
            iconClass = 'fa-brands fa-python';
            break;
        case 'skills':
            fileName = 'skills.json';
            iconClass = 'fa-brands fa-js';
            break;
        case 'projects':
            fileName = 'projects.py';
            iconClass = 'fa-brands fa-python';
            break;
        case 'contact':
            fileName = 'contact.txt';
            iconClass = 'fa-solid fa-hashtag';
            break;
    }
    tabElement.innerHTML = `<i class="${iconClass}"></i> ${fileName}`;
}

// === Initialize All Features ===
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. File Switching
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileId = item.getAttribute('data-file');
            switchFile(fileId);
        });
    });

    // 2. Terminal Tabs Switching (New!)
    const termTabs = document.querySelectorAll('.term-tab');
    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            switchTerminalTab(target);
        });
    });

    // 3. Typing Effect
    const aboutElement = document.getElementById('content-about');
    if (aboutElement) {
        const rawText = aboutElement.querySelector('code').textContent;
        typeCode('content-about', rawText);
    }

    // 4. Terminal Resizer (Mouse & Touch)
    const resizer = document.getElementById('drag-handle');
    const terminalPanel = document.getElementById('terminal-panel');

    if (resizer && terminalPanel) {
        let isResizing = false;

        // Desktop
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
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
                resizer.classList.remove('dragging');
            }
        });

        // Mobile
        resizer.addEventListener('touchstart', (e) => {
            isResizing = true;
            resizer.classList.add('dragging');
            e.preventDefault(); 
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isResizing) return;
            const touch = e.touches[0];
            const newHeight = window.innerHeight - touch.clientY;
            terminalPanel.style.height = `${newHeight}px`;
        }, { passive: false });

        document.addEventListener('touchend', () => {
            isResizing = false;
            resizer.classList.remove('dragging');
        });
    }
});