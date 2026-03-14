const supabaseUrl = 'https://ffljujqajzuomxmcaflg.supabase.co';  
const supabaseKey = 'sb_publishable_KPc0EGIzWzO5PAvdToaqdA_VZ_Jg3gc';    
const supabaseClient = createClient(supabaseUrl, supabaseKey);

let carouselData = [];
let currentIndex = 0;
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let interval;


async function loadCarouselData() {
  try {
    const { data, error } = await supabaseClient
      .from('carousel_items')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log('Данные загружены:', data); 
      carouselData = data;
    } else {
      console.log('Нет данных, используем локальные');
      // Запасной вариант
      carouselData = [
        {
          image_url: "images/v368_430.png",
          title: "Tacoland",
          rating: "5.0",
          reviews: 203
        },
        {
          image_url: "images/v368_428.png",
          title: "Tokyo City",
          rating: "4.9",
          reviews: 188
        },
        {
          image_url: "images/v368_435.png",
          title: "Зодиак",
          rating: "4.8",
          reviews: 175
        }
      ];
    }
    renderCarousel();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    
    carouselData = [
      {
        image_url: "images/v368_430.png",
        title: "Tacoland",
        rating: "5.0",
        reviews: 203
      },
      {
        image_url: "images/v368_428.png",
        title: "Tokyo City",
        rating: "4.9",
        reviews: 188
      },
      {
        image_url: "images/v368_435.png",
        title: "Зодиак",
        rating: "4.8",
        reviews: 175
      }
    ];
    renderCarousel();
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
    const slideDiv = document.createElement('div');
    slideDiv.className = `carousel-slide ${slide.isActive ? 'active' : ''}`;
    
    slideDiv.innerHTML = `
      <img src="${data.image_url}" alt="${data.title}" width="${slide.isActive ? 560 : 240}" height="${slide.isActive ? 360 : 240}">
      <div class="slide-caption">
        <span>${data.title}</span>
        <span>★ ${data.rating} (${data.reviews})</span>
      </div>
    `;
    
    track.appendChild(slideDiv);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % carouselData.length;
  renderCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
  renderCarousel();
}

function startAutoPlay() {
  if (interval) clearInterval(interval);
  interval = setInterval(nextSlide, 3000);
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

    startAutoPlay();
  }
});
