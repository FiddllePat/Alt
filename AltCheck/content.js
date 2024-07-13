if (window.location.host === "www.roblox.com") {

    function fetchAndDisplayAlt() {
        console.log("Getting user ID");
        const urlPath = window.location.pathname;
        const pathSegments = urlPath.split('/');
        const userId = pathSegments[2];
    
        if (userId) {
            console.log(`User ID found: ${userId}`);
            const apiUrl = `https://altmodel.fiddllep.at/predict?user_id=${encodeURIComponent(userId)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        const categories = {
                            Alt: data.alt,
                            "Long Term Alt": data.longterm_alt,
                            Main: data.main
                        };
                        const highestCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
                        const highestPercentage = categories[highestCategory];
                        addNewListItem(highestCategory, highestPercentage);
                        //insertBadgeActivityImage(userId);
                    } else {
                        console.error('Error fetching data:', data);
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
            fetchLastOnline(userId);
        } else {
            console.log("User ID not found.");
        }
    }
    
    function addNewListItem(highestCategory, highestPercentage) {
        var detailsInfo = document.querySelector('ul.details-info');
        if (detailsInfo) {
            var newListItem = document.createElement('li');
            newListItem.innerHTML = `<div class="text-label font-caption-header">${highestCategory}</div><span class="font-header-2" title="${highestPercentage}%">${highestPercentage}%</span>`;
            detailsInfo.appendChild(newListItem);
            console.log("Inserted category label and percentage");
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

            console.log("started loading the badge activity");
        }
    }

    function fetchLastOnline(userId) {
        const lastOnlineApiUrl = 'https://presence.roblox.com/v1/presence/last-online';
        fetch(lastOnlineApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                "userIds": [parseInt(userId)]
            })
        })
        .then(response => response.json())
        .then(data => {
            const lastOnlineTimestamps = data.lastOnlineTimestamps;
            if (lastOnlineTimestamps && lastOnlineTimestamps.length > 0) {
                const lastOnline = lastOnlineTimestamps[0].lastOnline;
                const lastOnlineDate = new Date(lastOnline);
                const daysAgo = Math.floor((new Date() - lastOnlineDate) / (1000 * 60 * 60 * 24));
                let lastOnlineText;
                if (daysAgo === 0) {
                    lastOnlineText = 'Last Online Today';
                } else if (daysAgo === 1) {
                    lastOnlineText = 'Last Online Yesterday';
                } else {
                    lastOnlineText = `Last Online ${daysAgo} Days Ago`;
                }

                const profileDisplayName = document.querySelector('.profile-display-name.font-caption-body.text.text-overflow');
                if (profileDisplayName) {
                    const originalText = profileDisplayName.textContent;
                    profileDisplayName.innerHTML = `${originalText} | ${lastOnlineText}`;
                }
            }
        })
        .catch(error => console.error('error fetching last online data:', error));
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', fetchAndDisplayAlt);
    } else {
        fetchAndDisplayAlt();
    }
}

if (window.location.href === "https://www.roblox.com/home") {
    const homeContainer = document.querySelector('#HomeContainer.row.home-container.expand-max-width');
    if (homeContainer) {
        homeContainer.classList.remove('expand-max-width');
        homeContainer.style.maxWidth = '60%';
        console.log("Updated HomeContainer max-width to 60%");
    }
}
