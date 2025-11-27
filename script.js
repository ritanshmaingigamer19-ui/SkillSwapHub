/* ============================================================
   SCRIPT.JS — PART 1
   Core Logic: Navigation, Rendering, LocalStorage, Sharing
   ============================================================*/

// ----- DOM ELEMENTS -----
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-links li");

// ----- NAVIGATION -----
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const pageID = link.dataset.page;
        switchPage(pageID);

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

function switchPage(pageID) {
    pages.forEach(page => page.classList.add("hidden"));
    const activePage = document.getElementById(pageID);
    activePage.classList.remove("hidden");
    activePage.classList.add("active");
}

// Default page
switchPage("home");

// ----- LOCAL STORAGE -----
let resources = JSON.parse(localStorage.getItem("resources")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let profile = JSON.parse(localStorage.getItem("profile")) || {};

// ----- RENDER RESOURCES -----
function renderResources(list = resources) {
    const container = document.getElementById("resourceList");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `<p>No resources found.</p>`;
        return;
    }

    list.forEach((res, index) => {
        container.innerHTML += `
        <div class="resource-card fade-in">
            <span class="bookmark" onclick="toggleBookmark(${index})">
                ${bookmarks.includes(index) ? "🔖" : "📘"}
            </span>

            <div class="category-tag">${res.category}</div>

            <h3>${res.title}</h3>
            <p>${res.desc}</p>

            <a href="${res.link}" target="_blank" class="primary-btn" style="margin-top:12px; display:inline-block;">
                Visit Resource
            </a>

            <div class="star-container">
                ${[1,2,3,4,5].map(n => `
                    <span class="star" onclick="rateResource(${index}, ${n})">
                        ${res.rating >= n ? "★" : "☆"}
                    </span>
                `).join("")}
            </div>
        </div>
        `;
    });
}

// Render on load
renderResources();

// ----- ADD RESOURCE -----
document.getElementById("shareForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const newResource = {
        title: document.getElementById("resourceTitle").value,
        link: document.getElementById("resourceLink").value,
        desc: document.getElementById("resourceDesc").value,
        category: document.getElementById("resourceCategory").value,
        rating: 0
    };

    resources.push(newResource);
    localStorage.setItem("resources", JSON.stringify(resources));

    renderResources();
    alert("Resource added!");
    e.target.reset();
});

// ----- RATING SYSTEM -----
window.rateResource = function (index, stars) {
    resources[index].rating = stars;
    localStorage.setItem("resources", JSON.stringify(resources));
    renderResources();
};

// ----- BOOKMARK SYSTEM -----
window.toggleBookmark = function (index) {
    if (bookmarks.includes(index)) {
        bookmarks = bookmarks.filter(b => b !== index);
    } else {
        bookmarks.push(index);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    renderResources();
};

// ----- SEARCH & FILTER -----
document.getElementById("searchBox").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    const filtered = resources.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.desc.toLowerCase().includes(term)
    );

    renderResources(filtered);
});

document.getElementById("filterCategory").addEventListener("change", (e) => {
    const cat = e.target.value;

    if (cat === "All") renderResources();
    else renderResources(resources.filter(r => r.category === cat));
});
/* ============================================================
   SCRIPT.JS — PART 2
   AI Tools, Profile System, Contact Form, UI Enhancements
============================================================ */


/* -------------------------------
   AI TOOLS (AUTO LOAD)
--------------------------------*/
const aiToolsData = [
    {
        name: "ChatGPT",
        desc: "Generate ideas, improve writing, debug code, and learn anything.",
        link: "https://chat.openai.com/"
    },
    {
        name: "Canva AI",
        desc: "AI-powered graphic design for thumbnails, posters, and social media.",
        link: "https://www.canva.com/"
    },
    {
        name: "Codeium",
        desc: "Free AI tool for generating and completing code.",
        link: "https://codeium.com/"
    },
    {
        name: "Pixlr AI",
        desc: "AI image editor for quick design enhancements.",
        link: "https://pixlr.com/"
    }
];

function loadAITools() {
    const container = document.getElementById("aiTools");
    container.innerHTML = "";

    aiToolsData.forEach(tool => {
        container.innerHTML += `
            <div class="ai-card fade-in">
                <div class="category-tag">AI Tool</div>

                <h3>${tool.name}</h3>
                <p>${tool.desc}</p>

                <a href="${tool.link}" target="_blank" class="primary-btn" style="margin-top:12px; display:inline-block;">
                    Visit Tool
                </a>
            </div>
        `;
    });
}

loadAITools();



/* -------------------------------
   PROFILE SYSTEM
--------------------------------*/
const saveBtn = document.getElementById("saveProfile");
const previewBox = document.getElementById("profilePreview");

saveBtn.addEventListener("click", () => {
    const name = document.getElementById("fullName").value;
    const bio = document.getElementById("bioText").value;
    const photoFile = document.getElementById("photoUpload").files[0];

    const reader = new FileReader();

    reader.onload = function () {
        profile = {
            name: name,
            bio: bio,
            photo: reader.result
        };

        localStorage.setItem("profile", JSON.stringify(profile));
        renderProfile();
        alert("Profile saved!");
    };

    if (photoFile) reader.readAsDataURL(photoFile);
    else {
        profile = { name, bio, photo: profile.photo || "" };
        localStorage.setItem("profile", JSON.stringify(profile));
        renderProfile();
        alert("Profile saved!");
    }
});

function renderProfile() {
    if (!profile.name && !profile.bio && !profile.photo) {
        previewBox.innerHTML = `<p>No profile yet.</p>`;
        return;
    }

    previewBox.innerHTML = `
        <div class="glass" style="padding:20px;">
            ${profile.photo ? `<img src="${profile.photo}" style="width:120px; height:120px; border-radius:50%; margin-bottom:15px;">` : ""}
            <h3>${profile.name || "Unnamed User"}</h3>
            <p>${profile.bio || ""}</p>
        </div>
    `;
}

renderProfile();



/* -------------------------------
   CONTACT FORM
--------------------------------*/
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("contactEmail").value;
    const message = document.getElementById("contactMsg").value;

    document.getElementById("contactResponse").innerHTML = `
        <div class="glass fade-in" style="padding:20px;">
            <h3>Message Sent!</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Your Message:</strong><br>${message}</p>
        </div>
    `;

    e.target.reset();
});



/* -------------------------------
   SMOOTH PAGE ANIMATION
--------------------------------*/
function smoothScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach(link => {
    link.addEventListener("click", smoothScrollToTop);
});


/* -------------------------------
   PAGE LOAD ANIMATION
--------------------------------*/
window.onload = () => {
    document.body.classList.add("fade-in");
};
