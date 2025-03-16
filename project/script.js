const container = document.querySelector('.project-scroll-container');
const grid = document.querySelector('.project-grid');
const prevBtn = document.querySelector('.nav-arrow.prev');
const nextBtn = document.querySelector('.nav-arrow.next');

let currentPosition = 0;
let maxPosition = 0;
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let velocity = 0;
let lastX = 0;
let lastTime = 0;
let animationFrame = null;

// Project filtering
const projectSelect = document.getElementById('project-select');
const projectItems = document.querySelectorAll('.project-item');
const projectsGrid = document.querySelector('.projects-grid');

// Add no results message
const noResults = document.createElement('div');
noResults.className = 'no-results';
noResults.textContent = 'No projects found in this category.';
projectsGrid.appendChild(noResults);

function filterProjects(category) {
    let hasVisibleProjects = false;
    
    // First, hide all projects with animation
    projectItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            setTimeout(() => {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, 300); // Delay showing to allow hide animation to complete
            hasVisibleProjects = true;
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
        }
    });

    // Show/hide no results message
    if (!hasVisibleProjects) {
        setTimeout(() => {
            noResults.classList.add('visible');
        }, 300);
    } else {
        noResults.classList.remove('visible');
    }

    // Update select styling
    const label = projectSelect.previousElementSibling;
    label.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
}

// Initialize filtering
projectSelect.addEventListener('change', (e) => {
    filterProjects(e.target.value);
});

// Menu button animation
const menuButton = document.querySelector('.menu-button');
let isMenuOpen = false;

menuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    const spans = menuButton.querySelectorAll('.hamburger span');
    
    if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Smooth scroll animation for project links
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Add your navigation logic here
    });
});

// Initial animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    projectItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
});

function updateMaxPosition() {
    const totalWidth = grid.scrollWidth;
    const containerWidth = container.clientWidth;
    maxPosition = totalWidth - containerWidth;
}

function updateNavigation() {
    prevBtn.classList.toggle('disabled', currentPosition === 0);
    nextBtn.classList.toggle('disabled', Math.abs(currentPosition) >= maxPosition);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function animate() {
    if (!isDragging && Math.abs(velocity) > 0.05) {
        currentPosition += velocity;
        velocity *= 0.98; // Slower decay for smoother momentum

        // Softer bounce at edges
        if (currentPosition > 0) {
            currentPosition *= 0.85;
            velocity *= 0.85;
        } else if (Math.abs(currentPosition) > maxPosition) {
            const overscroll = Math.abs(currentPosition) - maxPosition;
            currentPosition = -maxPosition - (overscroll * 0.85);
            velocity *= 0.85;
        }

        grid.style.transform = `translateX(${currentPosition}px)`;
        updateNavigation();
        requestAnimationFrame(animate);
    } else if (!isDragging) {
        // Gentler snapping
        const cardWidth = container.clientWidth / 4;
        const targetPosition = Math.round(currentPosition / cardWidth) * cardWidth;
        currentPosition = lerp(currentPosition, targetPosition, 0.15);

        if (Math.abs(currentPosition - targetPosition) > 0.1) {
            grid.style.transform = `translateX(${currentPosition}px)`;
            requestAnimationFrame(animate);
        } else {
            currentPosition = targetPosition;
            grid.style.transform = `translateX(${currentPosition}px)`;
        }
    }
}

function startDragging(e) {
    isDragging = true;
    container.style.cursor = 'grabbing';
    startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    scrollLeft = currentPosition;
    lastX = startX;
    lastTime = Date.now();
    velocity = 0;

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
    const dx = x - lastX;
    const now = Date.now();
    const dt = Math.max(now - lastTime, 8); // Prevent division by very small numbers
    
    velocity = dx / dt * 24; // Increased velocity multiplier
    currentPosition = scrollLeft + (x - startX) * 1.2; // Increased movement multiplier

    // Reduced edge resistance
    if (currentPosition > 0) {
        currentPosition *= 0.75;
    } else if (Math.abs(currentPosition) > maxPosition) {
        const overscroll = Math.abs(currentPosition) - maxPosition;
        currentPosition = -maxPosition - (overscroll * 0.75);
    }

    grid.style.transform = `translateX(${currentPosition}px)`;
    updateNavigation();

    lastX = x;
    lastTime = now;
}

function stopDragging() {
    isDragging = false;
    container.style.cursor = 'grab';
    animationFrame = requestAnimationFrame(animate);
}

// Button Navigation with smoother movement
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    velocity = 20; // Added initial velocity for smoother movement
    const cardWidth = container.clientWidth / 4;
    currentPosition = Math.min(currentPosition + cardWidth, 0);
    animationFrame = requestAnimationFrame(animate);
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    velocity = -20; // Added initial velocity for smoother movement
    const cardWidth = container.clientWidth / 4;
    currentPosition = Math.max(currentPosition - cardWidth, -maxPosition);
    animationFrame = requestAnimationFrame(animate);
});

// Mouse Events
container.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('mouseleave', stopDragging);

// Touch Events
container.addEventListener('touchstart', startDragging, { passive: false });
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', stopDragging);
document.addEventListener('touchcancel', stopDragging);

// Initial setup
function initialize() {
    updateMaxPosition();
    currentPosition = 0;
    velocity = 0;
    grid.style.transform = `translateX(0)`;
    updateNavigation();
    container.style.cursor = 'grab';
}

initialize();
window.addEventListener('resize', initialize);
container.addEventListener('contextmenu', (e) => e.preventDefault()); 