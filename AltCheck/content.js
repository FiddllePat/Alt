function fetchAndDisplayAlt() {
  console.log("Extracting user ID from the current page URL...");
  const urlPath = window.location.pathname;
  const pathSegments = urlPath.split('/');
  const userId = pathSegments[2]; 

  if (userId) {
    console.log(`User ID found: ${userId}`);

    const apiUrl = `https://altcheck-demo.fiddllepat.com/predict_by_userid?user_id=${encodeURIComponent(userId)}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.percent_alt !== undefined) {
          addNewListItem(data.percent_alt);
          insertBadgeActivityImage(userId);
        } else {
          console.error('Error fetching data:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  } else {
    console.log("User ID not found in the URL.");
  }
}

function addNewListItem(percentAlt) {
  var detailsInfo = document.querySelector('ul.details-info');
  if (detailsInfo) {
    var newListItem = document.createElement('li');
    newListItem.innerHTML = `<div class="text-label font-caption-header">Alt</div><span class="font-header-2" title="${percentAlt}%">${percentAlt}%</span>`;
    detailsInfo.appendChild(newListItem);
    console.log("New list item added!");
  }
}

function insertBadgeActivityImage(userId) {
  const imageUrl = `https://altcheck-demo.fiddllepat.com/graph_badge_activity/${userId}`;
  const footerDiv = document.querySelector('.border-top.profile-about-footer');
  if (footerDiv) {

    const label = document.createElement('div');
    label.textContent = 'Badge Activity';
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '5px';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Badge Activity';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '7px';

    if (footerDiv.firstChild) {
      footerDiv.insertBefore(label, footerDiv.firstChild);
      footerDiv.insertBefore(img, label.nextSibling);
    } else {
      footerDiv.appendChild(label);
      footerDiv.appendChild(img);
    }
    console.log("Badge activity image and label inserted!");
  }
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', fetchAndDisplayAlt);
} else {
  fetchAndDisplayAlt();
}
