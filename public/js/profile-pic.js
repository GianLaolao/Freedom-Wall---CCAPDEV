const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');

profilePicInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
