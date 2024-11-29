function showError(message) {
  const errorModal = document.getElementById('errorModal');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorModal.style.display = 'block'; // Shows the module on the site
}

// Function to close the module
function closeModal() {
  const errorModal = document.getElementById('errorModal');
  errorModal.style.display = 'none'; // Hides the module
}

// If user clicks on x the module closes
document.getElementById('closeModal').addEventListener('click', closeModal);

// Click outside of the module and it will close
window.addEventListener('click', function(event) {
  const errorModal = document.getElementById('errorModal');
  if (event.target === errorModal) {
    errorModal.style.display = 'none';
  }
});
