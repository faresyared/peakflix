// Database Mock - Open source & copy-left mock content data
const contentData = [
    {
        id: 1,
        type: 'movie',
        category: 'movies',
        title: 'Tears of Steel',
        titleAr: 'دموع من فولاذ',
        desc: 'A sci-fi short film tracking a group of warriors trying to save the world from giant robots.',
        descAr: 'فيلم خيال علمي قصير يتتبع مجموعة من المحاربين يحاولون إنقاذ العالم من روبوتات عملاقة.',
        year: '2012',
        duration: '12m',
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
        id: 2,
        type: 'series',
        category: 'series',
        title: 'Sintel Adventure',
        titleAr: 'مغامرة سينتيل',
        desc: 'A lonely girl searches for her lost pet dragon in a massive mystical land.',
        descAr: 'تبحث فتاة وحيدة عن تنينها الأليف المفقود في أرض صوفية شاسعة.',
        year: '2010',
        duration: '14m',
        img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    {
        id: 3,
        type: 'anime',
        category: 'anime',
        title: 'Big Buck Bunny Tales',
        titleAr: 'حكايات الأرنب الضخم',
        desc: 'A giant rabbit goes rogue to avenge his forest friends from dynamic pests.',
        descAr: 'أرنب عملاق ينتقم لأصدقائه في الغابة من آفات مزعجة.',
        year: '2008',
        duration: '10m',
        img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
];

// Translation Object
const i18n = {
    en: {
        searchPlaceholder: "Search movies, series, anime...",
        navHome: "Home", navMovies: "Movies", navSeries: "Western Series", navTurkishDrama: "Turkish Drama", navAnime: "Anime", navTurkishSeries: "Turkish Series",
        trendingMovies: "Trending Movies", trendingSeries: "Trending Series", trendingAnime: "Trending Anime",
        continueWatching: "Continue Watching", watchNow: "Watch Now", backToHome: "Back to Home",
        loginTitle: "Sign In to CineVerse", usernameLabel: "Username", passwordLabel: "Password", loginBtn: "Sign In", loginError: "Wrong user or password!",
        logout: "Logout", login: "Sign In"
    },
    ar: {
        searchPlaceholder: "ابحث عن الأفلام، المسلسلات، الأنمي...",
        navHome: "الرئيسية", navMovies: "أفلام", navSeries: "مسلسلات غربية", navTurkishDrama: "دراما تركية", navAnime: "أنمي", navTurkishSeries: "مسلسلات تركية",
        trendingMovies: "أفلام ترند", trendingSeries: "مسلسلات ترند", trendingAnime: "أنمي ترند",
        continueWatching: "تابع المشاهدة حالياً", watchNow: "شاهد الآن", backToHome: "العودة للرئيسية",
        loginTitle: "تسجيل الدخول", usernameLabel: "اسم المستخدم", passwordLabel: "كلمة المرور", loginBtn: "دخول", loginError: "اسم المستخدم أو كلمة السر خاطئة!",
        logout: "تسجيل الخروج", login: "دخول"
    }
};

let currentLang = localStorage.getItem('siteLang') || 'en';
let selectedContentId = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupLanguage();
    renderGrids();
    checkUserAuth();
    setupEventListeners();
    lucide.createIcons();
}

// Language handler
function setupLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langText').innerText = currentLang === 'ar' ? 'English' : 'العربية';
    
    if(currentLang === 'ar') {
        document.body.classList.remove("font-['Inter']");
        document.body.classList.add("font-['Cairo']");
    } else {
        document.body.classList.remove("font-['Cairo']");
        document.body.classList.add("font-['Inter']");
    }

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', i18n[currentLang][key]);
    });
}

// Render dynamic content cards
function renderGrids(filterQuery = '') {
    const movieGrid = document.getElementById('trendingMoviesGrid');
    const seriesGrid = document.getElementById('trendingSeriesGrid');
    const animeGrid = document.getElementById('trendingAnimeGrid');
    
    if(!movieGrid) return; // safeguard if on watch.html

    movieGrid.innerHTML = ''; seriesGrid.innerHTML = ''; animeGrid.innerHTML = '';

    contentData.forEach(item => {
        const title = currentLang === 'ar' ? item.titleAr : item.title;
        if(filterQuery && !title.toLowerCase().includes(filterQuery.toLowerCase())) return;

        const card = document.createElement('div');
        card.className = 'movie-card bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group shadow-lg';
        card.innerHTML = `
            <div class="relative aspect-[2/3] overflow-hidden bg-zinc-800">
                <img src="${item.img}" alt="${title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div class="bg-orange-500 text-black p-3 rounded-full shadow-xl"><i data-lucide="info" class="w-6 h-6"></i></div>
                </div>
            </div>
            <div class="p-3">
                <h4 class="font-bold truncate text-sm group-hover:text-orange-500 transition">${title}</h4>
                <p class="text-xs text-zinc-500 mt-1">${item.year} • ${item.duration}</p>
            </div>
        `;
        card.addEventListener('click', () => openInfoModal(item));
        
        if(item.category === 'movies') movieGrid.appendChild(card);
        if(item.category === 'series') seriesGrid.appendChild(card);
        if(item.category === 'anime') animeGrid.appendChild(card);
    });
    lucide.createIcons();
}

// Modal info views
function openInfoModal(item) {
    selectedContentId = item.id;
    document.getElementById('modalTitle').innerText = currentLang === 'ar' ? item.titleAr : item.title;
    document.getElementById('modalDesc').innerText = currentLang === 'ar' ? item.descAr : item.desc;
    document.getElementById('modalCategory').innerText = item.type;
    document.getElementById('modalYear').innerText = item.year;
    document.getElementById('modalDuration').innerText = item.duration;
    document.getElementById('modalHeroBg').style.backgroundImage = `url('${item.img}')`;

    const modal = document.getElementById('infoModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.children[0].classList.remove('scale-95');
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.children[0].classList.add('scale-95');
}

// Auth State Management
function checkUserAuth() {
    const userArea = document.getElementById('authArea');
    if(!userArea) return;

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(user) {
        userArea.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-orange-400">👋 ${user.username}</span>
                <button id="logoutBtn" class="bg-zinc-800 hover:bg-red-600 px-4 py-2 rounded-xl text-xs font-bold transition">${i18n[currentLang].logout}</button>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            checkUserAuth();
        });
        renderContinueWatching(user.username);
    } else {
        userArea.innerHTML = `
            <button id="loginBtn" class="bg-orange-500 text-black hover:bg-orange-600 px-5 py-2 rounded-xl text-sm font-bold transition">${i18n[currentLang].login}</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', () => {
            document.getElementById('loginModal').classList.remove('opacity-0', 'pointer-events-none');
        });
        document.getElementById('continueWatchingSection').classList.add('hidden');
    }
}

// Load and Render Continue Watching from client cache
function renderContinueWatching(username) {
    const section = document.getElementById('continueWatchingSection');
    const grid = document.getElementById('continueWatchingGrid');
    const list = JSON.parse(localStorage.getItem(`list_${username}`)) || [];

    if(list.length === 0) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    grid.innerHTML = '';

    list.forEach(historyItem => {
        const item = contentData.find(c => c.id == historyItem.id);
        if(item) {
            const title = currentLang === 'ar' ? item.titleAr : item.title;
            const mins = Math.floor(historyItem.time / 60);
            const card = document.createElement('div');
            card.className = 'relative bg-zinc-900 border border-orange-500/30 rounded-xl overflow-hidden cursor-pointer group';
            card.innerHTML = `
                <div class="relative aspect-video bg-zinc-800">
                    <img src="${item.img}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition">
                    <div class="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs flex justify-between items-center">
                        <span class="text-orange-400 font-bold">${mins}m watched</span>
                        <i data-lucide="play" class="w-3 h-3 fill-orange-500 text-orange-500"></i>
                    </div>
                </div>
                <div class="p-2 text-xs font-bold truncate">${title}</div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `watch.html?id=${item.id}`;
            });
            grid.appendChild(card);
        }
    });
    lucide.createIcons();
}

// Events binders
function setupEventListeners() {
    // Language switch click handler
    document.getElementById('langToggle')?.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('siteLang', currentLang);
        setupLanguage();
        renderGrids();
        checkUserAuth();
    });

    // Close modalls
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('closeLoginModal')?.addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('opacity-0', 'pointer-events-none');
    });

    // Search input event
    document.getElementById('searchBar')?.addEventListener('input', (e) => {
        renderGrids(e.target.value);
    });

    // Play button in modal
    document.getElementById('modalPlayBtn')?.addEventListener('click', () => {
        if(selectedContentId) {
            window.location.href = `watch.html?id=${selectedContentId}`;
        }
    });

    // Handle Login authentication
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('usernameInput').value;
        const pass = document.getElementById('passwordInput').value;

        // Hardcoded custom Admin requirements requested by user
        if(user === 'admin' && pass === 'admin') {
            localStorage.setItem('currentUser', JSON.stringify({username: 'admin'}));
            document.getElementById('loginModal').classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('loginError').classList.add('hidden');
            checkUserAuth();
        } else {
            document.getElementById('loginError').classList.remove('hidden');
        }
    });
}
