// Initialize counts for each item
let totalItemsCollected = 0;
let itemCounts = {
    'Clothes': 0,
    'Food': 0,
    'Cleaning supplies': 0,
    'Personal hygiene items': 0,
    'Medication': 0
};

// Track selected items
let selectedItems = {};

// Function to handle item button click
function handleItemClick(event) {
    const button = event.target;
    const item = button.getAttribute('data-item');

    if (!selectedItems[item]) {
        // Item is selected
        selectedItems[item] = true;
        itemCounts[item]++;
        button.classList.add('selected');
        totalItemsCollected++;
    } else {
        // Item is deselected
        selectedItems[item] = false;
        itemCounts[item]--;
        button.classList.remove('selected');
        totalItemsCollected--;
    }

    // Update individual item counts display
    document.getElementById('clothesCount').innerText = itemCounts['Clothes'];
    document.getElementById('foodCount').innerText = itemCounts['Food'];
    document.getElementById('cleaningSuppliesCount').innerText = itemCounts['Cleaning supplies'];
    document.getElementById('personalHygieneCount').innerText = itemCounts['Personal hygiene items'];
    document.getElementById('medicationCount').innerText = itemCounts['Medication'];

    // Update total item count display
    document.getElementById('itemCount').innerText = `Total Items Collected: ${totalItemsCollected}`;
}

// Attach event listeners to buttons
document.querySelectorAll('.item-button').forEach(button => {
    button.addEventListener('click', handleItemClick);
});

// Handle form submission
document.getElementById('donationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const place = document.getElementById('place').value;

    // Basic validation for contact number
    if (!contact || isNaN(contact) || contact.length !== 10) {
        alert('Please enter a valid 10-digit contact number.');
        return; // Stop form submission
    }

    // Check if any items are selected
    if (totalItemsCollected === 0) {
        alert('Please select at least one item to donate.');
        return; // Stop form submission
    }

    // Display thank you message
    const thankYouMessage = document.getElementById('thankYouMessage');
    thankYouMessage.innerHTML = `Thank you for donating, ${name} from ${place}! Your contact number is ${contact}.`;
    thankYouMessage.style.display = 'block';

    // Clear the form
    document.getElementById('donationForm').reset();

    // Clear selection
    document.querySelectorAll('.item-button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedItems = {};
});
