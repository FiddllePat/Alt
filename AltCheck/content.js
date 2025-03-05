if (window.location.host === "www.roblox.com") {
    function fetch_and_display_alt() {
        console.log("getting user id");
        const url_path = window.location.pathname;
        const path_segments = url_path.split('/');
        const user_id = path_segments[2];

        if (user_id) {
            console.log(`user id found: ${user_id}`);
            const cached_category = localStorage.getItem(`${user_id}1`);
            const cached_percentage = localStorage.getItem(`${user_id}2`);
            const cache_timestamp = localStorage.getItem(`${user_id}Timestamp`);

            if (cached_category && cached_percentage && cache_timestamp) {
                const cached_date = new Date(cache_timestamp);
                const one_week_ago = new Date();
                one_week_ago.setDate(one_week_ago.getDate() - 7);

                if (cached_date > one_week_ago) {
                    console.log("loading data from cache");
                    add_new_list_item(cached_category, cached_percentage);
                    return;
                } else {
                    console.log("cache is over a week old, refetching data");
                }
            }

            console.log("fetching data from api");
            const api_url = `https://altmodel.fiddllep.at/predict?user_id=${encodeURIComponent(user_id)}`;
            fetch(api_url)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        const categories = {
                            Alt: data.alt,
                            "Long Term Alt": data.longterm_alt,
                            Main: data.main
                        };
                        const highest_category = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
                        const highest_percentage = categories[highest_category];
                        add_new_list_item(highest_category, highest_percentage);
                        localStorage.setItem(`${user_id}1`, highest_category);
                        localStorage.setItem(`${user_id}2`, highest_percentage);
                        localStorage.setItem(`${user_id}Timestamp`, new Date().toISOString());
                    } else {
                        console.error('error fetching data:', data);
                    }
                })
                .catch(error => console.error('error fetching data:', error));
        } else {
            console.log("user id not found");
        }
    }

    function add_new_list_item(highest_category, highest_percentage) {
        var details_info = document.querySelector('ul.profile-header-social-counts');
        if (details_info) {
            var new_list_item = document.createElement('li');
            new_list_item.innerHTML = `<a class="profile-header-social-count"><span class="MuiTypography-root web-blox-css-tss-hzyup-Typography-body1-Typography-root MuiTypography-inherit web-blox-css-mui-clml2g"><b>${highest_percentage}%</b> <span class="profile-header-social-count-label">${highest_category}</span></span></a>`;
            details_info.appendChild(new_list_item);
            console.log("inserted category label and percentage");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', fetch_and_display_alt);
    } else {
        fetch_and_display_alt();
    }
}
