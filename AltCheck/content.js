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
    const textLabel = document.createElement('span');
    textLabel.textContent = 'Badge Activity';
    textLabel.style.display = 'block';
    textLabel.style.fontWeight = 'bold';
    textLabel.style.marginBottom = '5px';

    const loadingText = document.createElement('span');
    loadingText.textContent = 'Loading';
    loadingText.style.display = 'block';
    footerDiv.appendChild(loadingText);

    let dotCount = 0;
    const loadingInterval = setInterval(() => {
      loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
      dotCount = (dotCount + 1) % 4;
    }, 500);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Badge Activity';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'none';

    img.onload = () => {
      clearInterval(loadingInterval); 
      loadingText.remove(); 
      img.style.display = 'block'; 
    };

    if (footerDiv.firstChild) {
      footerDiv.insertBefore(textLabel, footerDiv.firstChild);
      footerDiv.insertBefore(img, textLabel.nextSibling);
    } else {
      footerDiv.appendChild(textLabel);
      footerDiv.appendChild(img);
    }

    console.log("Badge activity image loading started!");
  }
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', fetchAndDisplayAlt);
} else {
  fetchAndDisplayAlt();
}
