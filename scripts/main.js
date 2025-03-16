document.addEventListener('DOMContentLoaded', () => {
    // Menu button functionality
    const menuButton = document.querySelector('.menu-button');
    menuButton?.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });

    // Service tag hover animation
    const serviceTags = document.querySelectorAll('.service-tag');
    serviceTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px)';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0)';
        });
    });
}); 