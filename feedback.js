function createModal() {
    
    if (document.getElementById('customModal')) return;
    
    const modalHTML = `
        <div id="customModal" class="custom-modal">
            <div class="custom-modal-content">
                <button class="custom-modal-close">&times;</button>
                  <p>Спасибо за доверие!<br>Свяжемся с Вами в ближайшее время!</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    
    const modal = document.getElementById('customModal');
    const closeBtn = modal.querySelector('.custom-modal-close');
    
    closeBtn.onclick = function() {
        modal.classList.remove('show');
    };
    
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };
}


function showModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.classList.add('show');
    }
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}


async function submitApplication(name, email) {
    if (!name || name.trim() === '') {
        throw new Error('Введите название заведения');
    }
    
    if (!email || email.trim() === '') {
        throw new Error('Введите email');
    }
    
    if (!isValidEmail(email)) {
        throw new Error('Введите корректный email (например: name@domain.com)');
    }
    
    
    const { data, error } = await supabaseClient
        .from('feedback-restaurant')
        .insert([{
            restaurant_name: name.trim(),
            email: email.trim().toLowerCase()
        }]);
    
    if (error) {
        console.error('Ошибка Supabase:', error);
        throw new Error('Не удалось отправить заявку');
    }
    
    return { success: true };
}


function initForm() {
    const form = document.getElementById('partnerForm');
    
    if (!form) {
        console.log('Форма не найдена');
        return;
    }
    
    
    createModal();
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('phone');
        const submitBtn = form.querySelector('.submit-btn');
        
        const name = nameInput.value;
        const email = emailInput.value;
        const originalBtnText = submitBtn.innerHTML;
        
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Отправка...';
        
        try {
            await submitApplication(name, email);
            
            
            form.reset();
            
            
            showModal();
            
        } catch (error) {
            alert(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

document.addEventListener('DOMContentLoaded', initForm);
