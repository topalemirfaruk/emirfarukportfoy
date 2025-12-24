// Window Dragging Logic
function makeDraggable(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector(".window-header");

    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

        // Bring to front
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
        elmnt.style.zIndex = 10;
        elmnt.classList.add('dragging'); // Disable transition
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.classList.remove('dragging'); // Re-enable transition
    }
}

// Initialize draggable windows
document.querySelectorAll('.window').forEach(makeDraggable);

// My Showcase Application Logic
const showcaseIcon = document.getElementById('showcase-icon');
const showcaseDesktopIcon = document.getElementById('showcase-desktop-icon');
const showcaseWindow = document.getElementById('showcase-window');

// Toggle My Showcase window from dock icon
showcaseIcon.addEventListener('click', () => {
    if (showcaseWindow.style.display === 'none') {
        showcaseWindow.style.display = 'flex';
        showcaseIcon.classList.add('active');
    } else {
        showcaseWindow.style.display = 'none';
        showcaseIcon.classList.remove('active');
    }
});

// Open My Showcase from desktop icon (double-click)
showcaseDesktopIcon.addEventListener('dblclick', () => {
    showcaseWindow.style.display = 'flex';
    showcaseIcon.classList.add('active');
});

// Sidebar navigation
// Global app object for inline onclick handlers
window.app = {
    switchSection: function (sectionId) {
        // Remove active class from all nav items and sections
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Add active class to target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to corresponding nav item (if exists)
        const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Toggle sidebar visibility based on section
        const showcaseContent = document.getElementById('showcase-content');
        if (showcaseContent) {
            if (sectionId === 'home') {
                showcaseContent.classList.add('home-view');
            } else {
                showcaseContent.classList.remove('home-view');
            }
        }
    }
};

// Sidebar navigation event listeners
document.querySelectorAll('.nav-item').forEach(navItem => {
    navItem.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = navItem.getAttribute('data-section');
        window.app.switchSection(targetSection);
    });
});

// Initialize home view state
document.addEventListener('DOMContentLoaded', () => {
    const showcaseContent = document.getElementById('showcase-content');
    if (showcaseContent && document.getElementById('home-section').classList.contains('active')) {
        showcaseContent.classList.add('home-view');
    }
});

// My Showcase window controls
const showcaseControls = showcaseWindow.querySelectorAll('.control');
showcaseControls[0].addEventListener('click', () => {
    showcaseWindow.style.display = 'none';
    showcaseIcon.classList.remove('active');
});

showcaseControls[1].addEventListener('click', () => {
    if (!isMaximized) {
        originalDimensions = {
            top: showcaseWindow.style.top,
            left: showcaseWindow.style.left,
            width: showcaseWindow.style.width,
            height: showcaseWindow.style.height,
            borderRadius: showcaseWindow.style.borderRadius
        };
        showcaseWindow.style.top = '27px';
        showcaseWindow.style.left = '60px';
        showcaseWindow.style.width = 'calc(100% - 60px)';
        showcaseWindow.style.height = 'calc(100% - 27px)';
        showcaseWindow.style.borderRadius = '0';
        showcaseWindow.classList.add('maximized');
        isMaximized = true;
    } else {
        showcaseWindow.style.top = originalDimensions.top || '150px';
        showcaseWindow.style.left = originalDimensions.left || '200px';
        showcaseWindow.style.width = originalDimensions.width || '700px';
        showcaseWindow.style.height = originalDimensions.height || '500px';
        showcaseWindow.style.borderRadius = originalDimensions.borderRadius || '8px 8px 0 0';
        showcaseWindow.classList.remove('maximized');
        isMaximized = false;
    }
});

showcaseControls[2].addEventListener('click', () => {
    showcaseWindow.style.display = 'none';
    showcaseIcon.classList.remove('active');
    showcaseDesktopIcon.style.display = 'flex'; // Show icon when window closes
});


// Terminal Logic
const terminalContent = document.getElementById('terminal-content');
let currentCommand = '';
const promptHTML = '<span class="prompt">emirft@ubuntu</span>:<span class="path">~</span>$ ';

function addToTerminal(text, isCommand = false) {
    const div = document.createElement('div');
    if (isCommand) {
        div.innerHTML = promptHTML + text;
    } else {
        div.innerHTML = text;
    }
    terminalContent.insertBefore(div, document.getElementById('current-line'));
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function processCommand(cmd) {
    const command = cmd.trim().toLowerCase();

    if (command === '') return;

    switch (command) {
        case 'help':
            addToTerminal('Available commands: help, clear, neofetch, whoami, date, ls, exit, reboot, poweroff');
            break;
        case 'clear':
            // Remove all previous siblings of current-line
            let current = document.getElementById('current-line');
            while (terminalContent.firstChild && terminalContent.firstChild !== current) {
                terminalContent.removeChild(terminalContent.firstChild);
            }
            break;
        case 'whoami':
            addToTerminal('emirft');
            break;
        case 'date':
            addToTerminal(new Date().toString());
            break;
        case 'ls':
            addToTerminal('Documents  Downloads  Music  Pictures  Public  Templates  Videos');
            break;
        case 'neofetch':
            addToTerminal(`
            <div style="display: flex; gap: 20px;">
                <div style="color: #E95420;">
                    <pre>
            .-.
           (   )
          /     \
         .       .
        .   o o   .
        .  (   )  .
         .  '-'  .
          \     /
           (   )
            '-'
                    </pre>
                </div>
                <div>
                    <div><span style="color: #E95420;">emirft@ubuntu</span></div>
                    <div>----------------</div>
                    <div><span style="color: #E95420;">OS</span>: Ubuntu 22.04 LTS x86_64</div>
                    <div><span style="color: #E95420;">Host</span>: Portfolio Website</div>
                    <div><span style="color: #E95420;">Uptime</span>: Just now</div>
                    <div><span style="color: #E95420;">Shell</span>: bash</div>
                    <div><span style="color: #E95420;">Theme</span>: Yaru-dark</div>
                </div>
            </div>
            `);
            break;
        case 'exit':
            document.getElementById('terminal-window').style.display = 'none';
            break;
        case 'reboot':
            restartSystem();
            break;
        case 'poweroff':
            powerOffSystem();
            break;
        default:
            addToTerminal(`Command not found: ${command}`);
    }
}

// Handle Typing
document.addEventListener('keydown', (e) => {
    // Only capture input if terminal is visible and system is on
    const terminal = document.getElementById('terminal-window');
    const powerScreen = document.getElementById('power-screen');

    if (terminal.style.display === 'none' || (powerScreen.style.display !== 'none' && !powerScreen.classList.contains('off-state'))) return;

    const cursor = document.getElementById('cursor');
    const inputSpan = document.getElementById('input-text');

    if (e.key === 'Enter') {
        addToTerminal(currentCommand, true);
        processCommand(currentCommand);
        currentCommand = '';
        inputSpan.innerText = '';
    } else if (e.key === 'Backspace') {
        currentCommand = currentCommand.slice(0, -1);
        inputSpan.innerText = currentCommand;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        currentCommand += e.key;
        inputSpan.innerText = currentCommand;
    }

    // Pass events to parent for 3D controls
    window.parent.postMessage({ type: "keydown", key: e.key }, "*");
});

// Dock Icons
document.querySelectorAll('.dock-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const title = icon.getAttribute('title');
        if (title === 'Terminal') {
            const term = document.getElementById('terminal-window');
            if (term.style.display === 'none') {
                term.style.display = 'flex';
                term.style.top = '100px';
                term.style.left = '100px';
                term.style.zIndex = 100;
            } else {
                term.style.zIndex = 100;
            }
        }
    });
});

// Window Controls
document.querySelector('.control.close').addEventListener('click', () => {
    document.getElementById('terminal-window').style.display = 'none';
});

// Minimize Button
document.querySelectorAll('.control')[0].addEventListener('click', () => {
    const term = document.getElementById('terminal-window');
    term.style.display = 'none';
    // Optional: Add animation or dock indicator update
});

// Maximize Button
let isMaximized = false;
let originalDimensions = {};

document.querySelectorAll('.control')[1].addEventListener('click', () => {
    const term = document.getElementById('terminal-window');

    if (!isMaximized) {
        // Store original state
        originalDimensions = {
            top: term.style.top,
            left: term.style.left,
            width: term.style.width,
            height: term.style.height,
            borderRadius: term.style.borderRadius
        };

        // Maximize
        term.style.top = '27px'; // Below top bar
        term.style.left = '50px'; // Right of dock
        term.style.width = 'calc(100% - 50px)';
        term.style.height = 'calc(100% - 27px)';
        term.style.borderRadius = '0';
        term.classList.add('maximized'); // Add class for styling
        isMaximized = true;
    } else {
        // Restore
        term.style.top = originalDimensions.top || '100px';
        term.style.left = originalDimensions.left || '100px';
        term.style.width = originalDimensions.width || '600px';
        term.style.height = originalDimensions.height || '400px';
        term.style.borderRadius = originalDimensions.borderRadius || '8px 8px 0 0';
        term.classList.remove('maximized'); // Remove class
        isMaximized = false;
    }
});

// Clock
function updateClock() {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    document.getElementById('clock').innerText = now.toLocaleDateString('en-US', options).replace(',', '');
}
setInterval(updateClock, 1000);
updateClock();

// --- Power Management Logic ---

const systemMenuTrigger = document.getElementById('system-menu-trigger');
const systemMenu = document.getElementById('system-menu');
const powerScreen = document.getElementById('power-screen');
const restartBtn = document.getElementById('restart-btn');
const powerOffBtn = document.getElementById('power-off-btn');

// Toggle System Menu
systemMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    systemMenu.classList.toggle('visible');
});

// Close menu when clicking elsewhere
document.addEventListener('click', () => {
    systemMenu.classList.remove('visible');
});

// Restart
restartBtn.addEventListener('click', () => {
    restartSystem();
});

// Power Off
powerOffBtn.addEventListener('click', () => {
    powerOffSystem();
});

function restartSystem() {
    // Show boot screen
    powerScreen.style.display = 'flex';
    powerScreen.classList.remove('off-state');

    // Simulate boot delay
    setTimeout(() => {
        powerScreen.style.display = 'none';
        // Reset terminal
        document.getElementById('terminal-window').style.display = 'flex';
        addToTerminal('System restarted.', false);
    }, 3000);
}

function powerOffSystem() {
    powerScreen.style.display = 'flex';
    powerScreen.classList.add('off-state');

    // Hide logo and spinner for "off" state
    powerScreen.innerHTML = '';

    // Add click listener to turn back on
    powerScreen.onclick = turnOnSystem;
}

function turnOnSystem() {
    powerScreen.onclick = null; // Remove listener
    powerScreen.classList.remove('off-state');

    // Restore logo
    powerScreen.innerHTML = `
        <div class="ubuntu-logo">
            <img src="https://assets.ubuntu.com/v1/29985a98-ubuntu-logo-32.png" alt="Ubuntu Logo" width="100">
            <div class="spinner"></div>
            <div class="ubuntu-text">ubuntu</div>
        </div>
    `;

    // Simulate boot
    setTimeout(() => {
        powerScreen.style.display = 'none';
    }, 3000);
}

// Mouse interaction for 3D scene (pass-through)
window.addEventListener("mousemove", (e => { window.parent.postMessage({ clientX: e.clientX, clientY: e.clientY, type: "mousemove" }, "*") }));
window.addEventListener("mousedown", (e => { window.parent.postMessage({ type: "mousedown" }, "*") }));
window.addEventListener("mouseup", (e => { window.parent.postMessage({ type: "mouseup" }, "*") }));

// Listen for messages from parent (3D World)
window.addEventListener('message', (event) => {
    if (event.data.type === 'togglePower') {
        const powerScreen = document.getElementById('power-screen');
        // If system is OFF (screen visible and in off-state) -> Turn ON
        if (powerScreen.style.display !== 'none' && powerScreen.classList.contains('off-state')) {
            turnOnSystem();
        }
        // If system is ON (screen hidden) -> Turn OFF
        else if (powerScreen.style.display === 'none') {
            powerOffSystem();
        }
    }
});


// --- Music Player Logic ---
const musicPlayerIcon = document.getElementById('music-player-icon');
const musicPlayerDesktopIcon = document.getElementById('music-player-desktop-icon');
const musicPlayerWindow = document.getElementById('music-player-window');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackNameEl = document.getElementById('track-name');
const artistNameEl = document.getElementById('artist-name');

let isPlaying = false;
let currentTrackIndex = 0;
const tracks = [
    { name: 'Lofi Beats', artist: 'Unknown Artist', file: 'radio1' },
    { name: 'Synthwave', artist: 'Retro Vibes', file: 'radio2' },
    { name: 'Jazz Vibes', artist: 'Smooth Jazz', file: 'radio3' },
    { name: 'Tükeneceğiz', artist: 'Sezen Aksu', file: 'radio4' }
];

function updateTrackInfo() {
    trackNameEl.innerText = tracks[currentTrackIndex].name;
    artistNameEl.innerText = tracks[currentTrackIndex].artist;
}

function toggleMusicWindow() {
    if (musicPlayerWindow.style.display === 'none') {
        musicPlayerWindow.style.display = 'flex';
        musicPlayerIcon.classList.add('active');
    } else {
        musicPlayerWindow.style.display = 'none';
        musicPlayerIcon.classList.remove('active');
    }
}

musicPlayerIcon.addEventListener('click', toggleMusicWindow);
musicPlayerDesktopIcon.addEventListener('dblclick', toggleMusicWindow);

// Window Controls for Music Player
const musicPlayerControls = musicPlayerWindow.querySelectorAll('.control');

// Minimize Button
musicPlayerControls[0].addEventListener('click', () => {
    musicPlayerWindow.style.display = 'none';
    musicPlayerIcon.classList.remove('active');
});

// Maximize Button
let isMusicPlayerMaximized = false;
let musicPlayerOriginalDims = {};

musicPlayerControls[1].addEventListener('click', () => {
    if (!isMusicPlayerMaximized) {
        musicPlayerOriginalDims = {
            top: musicPlayerWindow.style.top,
            left: musicPlayerWindow.style.left,
            width: musicPlayerWindow.style.width,
            height: musicPlayerWindow.style.height,
            borderRadius: musicPlayerWindow.style.borderRadius
        };

        musicPlayerWindow.style.top = '27px';
        musicPlayerWindow.style.left = '60px';
        musicPlayerWindow.style.width = 'calc(100% - 60px)';
        musicPlayerWindow.style.height = 'calc(100% - 27px)';
        musicPlayerWindow.style.borderRadius = '0';
        musicPlayerWindow.classList.add('maximized');
        isMusicPlayerMaximized = true;
    } else {
        musicPlayerWindow.style.top = musicPlayerOriginalDims.top || '150px';
        musicPlayerWindow.style.left = musicPlayerOriginalDims.left || '300px';
        musicPlayerWindow.style.width = musicPlayerOriginalDims.width || '350px';
        musicPlayerWindow.style.height = musicPlayerOriginalDims.height || '500px';
        musicPlayerWindow.style.borderRadius = musicPlayerOriginalDims.borderRadius || '12px';
        musicPlayerWindow.classList.remove('maximized');
        isMusicPlayerMaximized = false;
    }
});

// Close button for music player
musicPlayerControls[2].addEventListener('click', () => {
    musicPlayerWindow.style.display = 'none';
    musicPlayerIcon.classList.remove('active');
    // Optional: Stop music when closed?
    // stopMusic();
});

// Controls
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playMusic();
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playMusic();
});

function playMusic() {
    isPlaying = true;
    playPauseBtn.innerText = '⏸';
    updateTrackInfo();

    // Send message to parent
    window.parent.postMessage({
        type: 'audioControl',
        action: 'play',
        track: tracks[currentTrackIndex].file
    }, '*');
}

function pauseMusic() {
    isPlaying = false;
    playPauseBtn.innerText = '▶';

    // Send message to parent
    window.parent.postMessage({
        type: 'audioControl',
        action: 'stop' // Using stop for now as pause might be complex with current setup
    }, '*');
}

function stopMusic() {
    isPlaying = false;
    playPauseBtn.innerText = '▶';
    window.parent.postMessage({
        type: 'audioControl',
        action: 'stop'
    }, '*');
}

// Resize Logic
const resizeHandle = musicPlayerWindow.querySelector('.resize-handle');

resizeHandle.addEventListener('pointerdown', initResize);

function initResize(e) {
    e.preventDefault();
    e.stopPropagation();

    resizeHandle.setPointerCapture(e.pointerId);

    resizeHandle.addEventListener('pointermove', resize);
    resizeHandle.addEventListener('pointerup', stopResize);
    resizeHandle.addEventListener('pointercancel', stopResize);
}

function resize(e) {
    const rect = musicPlayerWindow.getBoundingClientRect();
    // Calculate new width and height based on pointer position relative to window top-left

    const newWidth = e.clientX - rect.left;
    const newHeight = e.clientY - rect.top;

    // Minimum dimensions
    if (newWidth > 300) {
        musicPlayerWindow.style.width = newWidth + 'px';
    }
    if (newHeight > 400) {
        musicPlayerWindow.style.height = newHeight + 'px';
    }
}

function stopResize(e) {
    resizeHandle.releasePointerCapture(e.pointerId);
    resizeHandle.removeEventListener('pointermove', resize);
    resizeHandle.removeEventListener('pointerup', stopResize);
    resizeHandle.removeEventListener('pointercancel', stopResize);
}

// --- Doom Logic ---
const doomIcon = document.getElementById('doom-icon');
const doomDesktopIcon = document.getElementById('doom-desktop-icon');
const doomWindow = document.getElementById('doom-window');
let dosInstance = null;

function toggleDoomWindow() {
    if (doomWindow.style.display === 'none') {
        doomWindow.style.display = 'flex';
        doomIcon.classList.add('active');

        // Initialize Doom if not already running
        if (!dosInstance) {
            Dos(document.getElementById("doom-canvas"), {
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
                cycles: 1000,
                autolock: false,
            }).ready((fs, main) => {
                fs.extract("https://js-dos.com/6.22/current/test/doom.zip").then(() => {
                    main(["-c", "doom"]).then((ci) => {
                        dosInstance = ci;
                    });
                });
            });
        }
    } else {
        doomWindow.style.display = 'none';
        doomIcon.classList.remove('active');
        // Optional: Pause or stop logic could go here
    }
}

doomIcon.addEventListener('click', toggleDoomWindow);
if (doomDesktopIcon) {
    doomDesktopIcon.addEventListener('dblclick', toggleDoomWindow);
}

// Doom Window Controls
const doomControls = doomWindow.querySelectorAll('.control');

// Minimize
doomControls[0].addEventListener('click', () => {
    doomWindow.style.display = 'none';
    doomIcon.classList.remove('active');
});

// Maximize
let isDoomMaximized = false;
let doomOriginalDims = {};

doomControls[1].addEventListener('click', () => {
    if (!isDoomMaximized) {
        doomOriginalDims = {
            top: doomWindow.style.top,
            left: doomWindow.style.left,
            width: doomWindow.style.width,
            height: doomWindow.style.height,
            borderRadius: doomWindow.style.borderRadius
        };

        doomWindow.style.top = '27px';
        doomWindow.style.left = '60px';
        doomWindow.style.width = 'calc(100% - 60px)';
        doomWindow.style.height = 'calc(100% - 27px)';
        doomWindow.style.borderRadius = '0';
        doomWindow.classList.add('maximized');
        isDoomMaximized = true;
    } else {
        doomWindow.style.top = doomOriginalDims.top || '100px';
        doomWindow.style.left = doomOriginalDims.left || '150px';
        doomWindow.style.width = doomOriginalDims.width || '640px';
        doomWindow.style.height = doomOriginalDims.height || '400px';
        doomWindow.style.borderRadius = doomOriginalDims.borderRadius || '8px 8px 0 0';
        doomWindow.classList.remove('maximized');
        isDoomMaximized = false;
    }
});

// Close
// Close
doomControls[2].addEventListener('click', () => {
    doomWindow.style.display = 'none';
    doomIcon.classList.remove('active');

    // Reload iframe to completely stop the game and sound
    const iframe = doomWindow.querySelector('iframe');
    if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = ''; // Clear src first
        setTimeout(() => {
            iframe.src = currentSrc; // Restore src (resets the game)
        }, 100);
    }
});

// Update Music Player Close Logic
// Note: We need to find the existing listener or just add a new one that handles the stop logic.
// Since we can't easily replace an anonymous function listener without knowing its exact position,
// let's add a specific listener for the close button that stops music.
// The existing listener just hides the window.
musicPlayerControls[2].addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    }
});
