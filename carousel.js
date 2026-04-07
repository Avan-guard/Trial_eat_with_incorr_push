let carouselData = [];
let currentIndex = 0;
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let interval;

async function loadCarouselData() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/carousel-item?is_active=eq.true&order=order.asc`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        console.log('Полученные данные из Supabase:', data);
        
        if (data && data.length > 0) {
            carouselData = data;
            renderCarousel();
            startAutoPlay();
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderCarousel() {
    if (!track || carouselData.length === 0) return;
    
    track.innerHTML = '';
    
    const prevIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
    const nextIndex = (currentIndex + 1) % carouselData.length;
    
    const slides = [
        { index: prevIndex, isActive: false },
        { index: currentIndex, isActive: true },
        { index: nextIndex, isActive: false }
    ];

    slides.forEach(slide => {
        const data = carouselData[slide.index];
        
        // Используем правильные названия полей из вашей таблицы
        const imgUrl = data.img_url;
        const title = data.title;
        const rating = data.rating;
        const reviews = data.reviews;
        
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-slide ${slide.isActive ? 'active' : ''}`;
        
        slideDiv.innerHTML = `
            <img src="${imgUrl}" alt="${title}" width="${slide.isActive ? 560 : 240}" height="${slide.isActive ? 360 : 240}">
            <div class="slide-caption">
                <span>${title}</span>
                <span>★ ${rating} (${reviews})</span>
            </div>
        `;
        
        track.appendChild(slideDiv);
    });
    
    console.log(`Загружено ${carouselData.length} элементов в карусель`);
}

function nextSlide() {
    if (carouselData.length === 0) return;
    currentIndex = (currentIndex + 1) % carouselData.length;
    renderCarousel();
}

function prevSlide() {
    if (carouselData.length === 0) return;
    currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
    renderCarousel();
}

function startAutoPlay() {
    if (interval) clearInterval(interval);
    if (carouselData.length > 1) {
        interval = setInterval(nextSlide, 3000);
    }
}

function stopAutoPlay() {
    clearInterval(interval);
}

document.addEventListener('DOMContentLoaded', function() {
    if (prevBtn && nextBtn && track) {
        loadCarouselData();
        
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
    }
});
