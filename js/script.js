document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    
    // Button click handler
    const button = document.getElementById('myButton');
    if (button) {
        button.addEventListener('click', function() {
            alert('Button clicked!');
        });
    }
});
