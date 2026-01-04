// === Configuration ===
const typingSpeed = 20; // Milliseconds per character (lower = faster)
let isTyping = false; // Flag to prevent conflicts

// === Main Function to handle file switching ===
function switchFile(fileId) {
    if (isTyping) return; // Block switching while typing runs

    // 1. Remove 'active' class from sidebar
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });

    // 2. Hide all content divs
    document.querySelectorAll('.file-content').forEach(content => {
        content.style.display = 'none';
    });

    // 3. Activate clicked file in sidebar
    const activeItem = document.querySelector(`.file-item[data-file="${fileId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // 4. Show content
    const activeContent = document.getElementById(`content-${fileId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }

    // 5. Update Tab
    updateTab(fileId);
}

// === Function to type code effect ===
function typeCode(elementId, text) {
    const container = document.getElementById(elementId);
    const codeBlock = container.querySelector('code');
    
    // Reset
    codeBlock.textContent = ""; 
    codeBlock.classList.add('typing'); // Add cursor
    isTyping = true;

    let i = 0;
    
    function type() {
        if (i < text.length) {
            // Add next character
            codeBlock.textContent += text.charAt(i);
            i++;
            // Scroll to bottom while typing
            /* container.scrollTop = container.scrollHeight; */ 
            setTimeout(type, typingSpeed);
        } else {
            // Typing finished
            isTyping = false;
            codeBlock.classList.remove('typing'); // Remove cursor
            
            // Trigger Prism to color the code!
            Prism.highlightElement(codeBlock);
        }
    }
    
    // Start typing
    type();
}

// === Helper: Update Tab ===
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

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    
    // Setup click listeners
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileId = item.getAttribute('data-file');
            switchFile(fileId);
        });
    });

    // --- TRIGGER TYPING EFFECT ON LOAD ---
    // We get the raw text from the "About" section before we clear it
    const aboutElement = document.getElementById('content-about');
    const rawText = aboutElement.querySelector('code').textContent;
    
    // Run the effect only on the "About" page initially
    typeCode('content-about', rawText);
});