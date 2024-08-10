// script.js

document.addEventListener('DOMContentLoaded', function() {
    const readMoreLink = document.querySelector('.read-more');
    const fullContent = document.querySelector('.full-content');
    const summary = document.querySelector('.summary');

    readMoreLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        fullContent.style.display = 'block'; // Show the full content
        readMoreLink.style.display = 'none'; // Hide the "Read More" link
        summary.style.display = 'none'; // Optionally, hide the summary
    });
});
