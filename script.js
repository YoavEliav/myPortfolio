// === Configuration ===
const typingSpeed = 20; 
let isTyping = false; 

// === Helper: Generate Line Numbers Dynamically ===
function updateLineNumbers(text) {
    const lineNumbersCol = document.getElementById('line-numbers-col');
    if (!lineNumbersCol) return;

    // סופר כמה שורות יש בטקסט (לפי כמות ה-Newlines)
    // מוסיף 1 כי תמיד יש לפחות שורה אחת
    const linesCount = text.split('\n').length;
    
    // מייצר את ה-HTML של המספרים
    let linesHTML = '';
    for (let i = 1; i <= linesCount; i++) {
        linesHTML += `${i}<br>`;
    }
    
    lineNumbersCol.innerHTML = linesHTML;
}

// === Main Function to handle file switching ===
function switchFile(fileId) {
    if (isTyping) return; 

    // Reset Visuals
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.file-content').forEach(content => {
        content.style.display = 'none';
    });

    // Activate File Item
    const activeItem = document.querySelector(`.file-item[data-file="${fileId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // Show Content
    const activeContent = document.getElementById(`content-${fileId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        
        // === UPDATE LINE NUMBERS FOR THE NEW FILE ===
        // אנחנו לוקחים את הטקסט הנקי מתוך הקוד
        const codeText = activeContent.querySelector('code').textContent;
        updateLineNumbers(codeText);
    }

    updateTab(fileId);
}

// === Function to type code effect ===
function typeCode(elementId, text) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const codeBlock = container.querySelector('code');
    
    codeBlock.textContent = ""; 
    codeBlock.classList.add('typing'); 
    isTyping = true;
    
    // מאפסים את המספרים ל-1 בהתחלה
    updateLineNumbers(""); 

    let i = 0;
    
    function type() {
        if (i < text.length) {
            codeBlock.textContent += text.charAt(i);
            i++;
            
            // === עדכון המספרים בזמן אמת תוך כדי הקלדה ===
            // זה גורם למספרים "לרוץ" יחד עם הטקסט
            if (text.charAt(i-1) === '\n') {
                updateLineNumbers(codeBlock.textContent);
            }
            
            setTimeout(type, typingSpeed);
        } else {
            isTyping = false;
            codeBlock.classList.remove('typing'); 
            Prism.highlightElement(codeBlock);
            // וידוא סופי שהמספרים נכונים
            updateLineNumbers(codeBlock.textContent);
        }
    }
    
    type();
}

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

// === Switch Terminal Tabs ===
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

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    
    // File Listeners
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileId = item.getAttribute('data-file');
            switchFile(fileId);
        });
    });

    // Terminal Listeners
    const termTabs = document.querySelectorAll('.term-tab');
    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            switchTerminalTab(target);
        });
    });

    // Initial Typing Effect
    const aboutElement = document.getElementById('content-about');
    if (aboutElement) {
        const rawText = aboutElement.querySelector('code').textContent;
        typeCode('content-about', rawText);
    }

    // === TERMINAL RESIZER ===
    const resizer = document.getElementById('drag-handle');
    const terminalPanel = document.getElementById('terminal-panel');

    if (resizer && terminalPanel) {
        let isResizing = false;

        // Mouse
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

        // Touch
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
