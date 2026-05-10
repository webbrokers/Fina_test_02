document.addEventListener("DOMContentLoaded", function() {
    // Получаем контейнеры с рейтингами
    const clientRatings = document.querySelectorAll('.client-rating');

    clientRatings.forEach(clientRating => {
        const postId = clientRating.getAttribute('data-post-id');

        if(!postId) return;

        // Получаем все звёздочки внутри контейнера
        const stars = clientRating.querySelectorAll('.star');

        // Добавляем обработчики событий для клика, наведения и ухода курсора
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const ratingValue = parseInt(this.getAttribute('data-value'));
                const ratingItem = this.closest('.rating-item');
                const ratingIndex = parseInt(ratingItem.getAttribute('data-rating-index'));
                const ratingBlock = ratingItem.getAttribute('data-rating-block');

                const cookieName = `rated_${postId}_${ratingBlock}_${ratingIndex}`;

                // Проверяем, проголосовал ли пользователь
                if(getCookie(cookieName)) {
                    alert('Вы уже проголосовали за этот критерий.');
                    return;
                }

                // Отправляем AJAX-запрос для обновления рейтинга
                submitRating(postId, ratingBlock, ratingIndex, ratingValue, ratingItem, cookieName);
            });

            // Обработчик наведения на звёздочку
            star.addEventListener('mouseenter', function() {
                const ratingValue = parseInt(this.getAttribute('data-value'));
                const ratingItem = this.closest('.rating-item');
                fillStars(ratingItem, ratingValue);
            });

            // Обработчик ухода курсора с звёздочки
            star.addEventListener('mouseleave', function() {
                const ratingItem = this.closest('.rating-item');
                const currentAverage = getCurrentAverage(ratingItem);
                fillStars(ratingItem, currentAverage);
            });
        });

        // Обработчик ухода курсора с контейнера рейтинга
        clientRating.addEventListener('mouseleave', function() {
            const ratingItems = clientRating.querySelectorAll('.rating-item');
            ratingItems.forEach(ratingItem => {
                const currentAverage = getCurrentAverage(ratingItem);
                fillStars(ratingItem, currentAverage);
            });
        });
    });

    // Функция отправки AJAX-запроса
    function submitRating(postId, ratingBlock, index, value, ratingItem, cookieName) {
        // Подготовка данных для отправки
        const data = {
            action: 'submit_rating',
            security: my_ajax_object.ajax_nonce,
            post_id: postId,
            rating_block: ratingBlock,
            rating_index: index,
            rating_value: value
        };

        fetch(my_ajax_object.ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: new URLSearchParams(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // Обновляем звёздочки и числовой рейтинг
                updateStarDisplay(ratingItem, data.data.new_average, data.data.new_count);
                // Устанавливаем куку
                setCookie(cookieName, '1', 365);
                // Показываем уведомление
                alert('Спасибо за ваш голос!');
            } else {
                alert('Ошибка при отправке рейтинга: ' + data.data);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    // Функция обновления звёздочек и числового рейтинга
    function updateStarDisplay(ratingItem, newAverage, newCount) {
        const stars = ratingItem.querySelectorAll('.star');
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if(starValue <= newAverage) {
                star.classList.add('filled');
                star.textContent = '★'; // Обновляем символ на заполненную звёздочку
            } else {
                star.classList.remove('filled');
                star.textContent = '☆'; // Обновляем символ на пустую звёздочку
            }
        });

        // Обновляем количество оценок и средний рейтинг
        if(newCount !== undefined) {
            const ratingStatElement = ratingItem.querySelector('.rating-stat');
            if(ratingStatElement) {
                ratingStatElement.innerHTML = 'Оценок ' + newCount + ', среднее <span class="average-rating">' + newAverage + '</span> из 5';
            }
        }

        // Обновляем числовое отображение среднего рейтинга (на случай, если используется отдельно)
        const averageRatingElement = ratingItem.querySelector('.average-rating');
        if(averageRatingElement) {
            averageRatingElement.textContent = newAverage;
        }
    }

    // Функция заполнения звёздочек на основе переданного рейтинга
    function fillStars(ratingItem, rating) {
        const stars = ratingItem.querySelectorAll('.star');
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if(starValue <= rating) {
                star.classList.add('filled');
                star.textContent = '★'; // Обновляем символ на заполненную звёздочку
            } else {
                star.classList.remove('filled');
                star.textContent = '☆'; // Обновляем символ на пустую звёздочку
            }
        });
    }

    // Функция получения текущего среднего рейтинга из data
    function getCurrentAverage(ratingItem) {
        const averageRatingElement = ratingItem.querySelector('.average-rating');
        if(averageRatingElement) {
            return parseFloat(averageRatingElement.textContent) || 0;
        }
        return 0;
    }

    // Функция для получения куки
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if(parts.length === 2) return parts.pop().split(';').shift();
    }

    // Функция для установки куки
    function setCookie(name, value, days) {
        let expires = "";
        if(days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
});
