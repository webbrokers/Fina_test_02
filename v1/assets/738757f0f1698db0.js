document.addEventListener("DOMContentLoaded", () => {
  function toggleModal(modalSelector) {
    var modal = document.querySelector(modalSelector);
    if (modal) {
      modal.classList.toggle("active");
    }
  }

  function closeModal(modalSelector) {
    var modal = document.querySelector(modalSelector);
    if (modal) {
      modal.classList.remove("active");
    }
  }

  // Универсальная функция для кликов по кнопкам
  function setupModalToggle(buttonSelector, modalSelector) {
    document.querySelectorAll(buttonSelector).forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleModal(modalSelector);
      });
    });
  }

  function setupModalClose(buttonSelector, modalSelector) {
    document.querySelectorAll(buttonSelector).forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeModal(modalSelector);
      });
    });
  }

  // Фильтр
  setupModalToggle(".filtr-butt", ".new-filter-modal");
  setupModalClose(".new-filter-modal-close", ".new-filter-modal");
  setupModalClose(".submit-button", ".new-filter-modal");

  // Калькулятор
  setupModalToggle(".calc-butt", ".new-calc-modal");
  setupModalClose(".new-calc-close, .new-calc-btn-close", ".new-calc-modal");

  // Закрытие модального окна при клике вне области .new-calc-content и .new-filter-content
  document.addEventListener("click", function (event) {
    document
      .querySelectorAll(".new-filter-modal, .new-calc-modal")
      .forEach(function (modal) {
        let isClickInsideContent = event.target.closest(
          ".new-filter-modal-content, .new-calc-content"
        );
        let isClickInsideModal = event.target.closest(
          ".new-filter-modal, .new-calc-modal"
        );
        let isClickOnButton = event.target.closest(".filtr-butt, .calc-butt");

        if (
          modal.classList.contains("active") &&
          !isClickInsideContent &&
          isClickInsideModal &&
          !isClickOnButton
        ) {
          modal.classList.remove("active");
        }
      });
  });

  var topmoreButton = document.querySelector(".top-offers-more");
  var topulElement = document.querySelector(".top-offers-wrapper ul");

  if (topmoreButton && topulElement) {
    topmoreButton.addEventListener("click", function () {
      topulElement.classList.add("active");
      topmoreButton.classList.add("hide");
    });
  }

  // Первый блок
  const moreButton = document.querySelector(".page__heading-description-more");
  const descriptionEl = document.querySelector(".page__heading-description");

  if (moreButton && descriptionEl) {
    moreButton.addEventListener("click", () => {
      const isActive = descriptionEl.classList.toggle("active");
      moreButton.textContent = isActive ? "Свернуть" : "Развернуть";
    });
  }

  const openAdCommentForm = document.getElementById(
    "openAdditionalCommentForm"
  );

  const adCommentForm = document.getElementById("additional-comment-form");

  openAdCommentForm.addEventListener("click", () => {
    adCommentForm.classList.add("active");
  });

  const openCommentForm = document.getElementById("openCommentForm");

  const commentForm = document.getElementById("commentForm");

  if (openCommentForm) {
  openCommentForm.addEventListener("click", () => {
    commentForm.classList.add("active");
  });
    } 
});

document.addEventListener("DOMContentLoaded", () => {
  // Получаем контейнер скролла
  const scrollContainer2 = document.querySelector(".reviews-scroll-container");

  // Обработчик для кнопки "horiz-next": прокручиваем вправо (scrollLeft увеличивается)
  document
    .querySelector(".reviews-horiz-next")
    .addEventListener("click", () => {
      scrollContainer2.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    });

  // Обработчик для кнопки "horiz-prew": прокручиваем влево (scrollLeft уменьшается)
  document
    .querySelector(".reviews-horiz-prew")
    .addEventListener("click", () => {
      scrollContainer2.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    });

  const wrapper = document.querySelector(".tags-list_wrapper");

  // При клике на кнопку "предыдущий" прокручиваем влево на 200px
  document
    .querySelector(".tags-list_prev")
    .addEventListener("click", function () {
      wrapper.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    });

  // При клике на кнопку "следующий" прокручиваем вправо на 200px
  document
    .querySelector(".tags-list_next")
    .addEventListener("click", function () {
      wrapper.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    });
});

jQuery(function ($) {
  const $slider = $(".best-offers-slider");
  if (!$slider.length) return;

  $slider.slick({
    infinite: true, // бесконечная прокрутка
    slidesToShow: 4, // кол-во видимых карточек
    slidesToScroll: 1, // кол-во прокручиваемых за раз
    arrows: true, // покажем стрелки
    prevArrow: $(".offers-horiz-prew"),
    nextArrow: $(".offers-horiz-next"),
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  // слушаем именно кнопку "Подобрать" в вашем попапе калькулятора
  $(".new-calc-modal .c-footer .btn.btn-primary").on("click", function (e) {
    e.preventDefault();
    // Скрываем попап
    $(".new-calc-modal").removeClass("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Функция для установки режима отображения
  function setLayout(layout) {
    const listPosts = document.querySelectorAll(".list_posts");
    if (layout === "horisont") {
      document.querySelectorAll(".horisont-butt").forEach(function (el) {
        el.classList.add("active");
      });
      document.querySelectorAll(".cards-butt").forEach(function (el) {
        el.classList.remove("active");
      });
      listPosts.forEach(function (el) {
        el.classList.add("horisont");
        el.classList.remove("cards");
      });
    } else if (layout === "cards") {
      document.querySelectorAll(".cards-butt").forEach(function (el) {
        el.classList.add("active");
      });
      document.querySelectorAll(".horisont-butt").forEach(function (el) {
        el.classList.remove("active");
      });
      listPosts.forEach(function (el) {
        el.classList.add("cards");
        el.classList.remove("horisont");
      });
    }
  }

  // При загрузке страницы проверяем сохранённый режим
  var savedLayout = localStorage.getItem("layout");
  if (savedLayout) {
    setLayout(savedLayout);
  }

  // Обработчик для кнопки с классом horisont-butt
  var horisontButtons = document.querySelectorAll(".horisont-butt");
  horisontButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLayout("horisont");
      localStorage.setItem("layout", "horisont");
    });
  });

  // Обработчик для кнопки с классом cards-butt
  var cardsButtons = document.querySelectorAll(".cards-butt");
  cardsButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLayout("cards");
      localStorage.setItem("layout", "cards");
    });
  });
});
jQuery(document).ready(function ($) {
  // AJAX загрузка постов для archive-kredity, taxonomy-bankcards, archive-zaimy и синглов подборок
  var loadmoreParams = null;
  var paramName = null;
  
  if (typeof kredity_loadmore_params !== 'undefined') {
    loadmoreParams = kredity_loadmore_params;
    paramName = 'kredity';
  } else if (typeof debetcard_loadmore_params !== 'undefined') {
    loadmoreParams = debetcard_loadmore_params;
    paramName = 'debetcard';
  } else if (typeof creditcard_loadmore_params !== 'undefined') {
    loadmoreParams = creditcard_loadmore_params;
    paramName = 'creditcard';
  } else if (typeof installmentcard_loadmore_params !== 'undefined') {
    loadmoreParams = installmentcard_loadmore_params;
    paramName = 'installmentcard';
  } else if (typeof zaimy_loadmore_params !== 'undefined') {
    loadmoreParams = zaimy_loadmore_params;
    paramName = 'zaimy';
  }
  
  // Резерв: параметры из data-атрибутов (если скрипт с переменной не выполнился, напр. кэш)
  if (!loadmoreParams) {
    var $container = $('#response-cred-card');
    var $btn = $('.load-daha[data-term]');
    if ($container.length && $btn.length) {
      try {
        var dataJson = $container.attr('data-json');
        var query = dataJson ? JSON.parse(dataJson) : null;
        var term = $btn.attr('data-term') || $('main[term]').attr('term') || 'kredity';
        var ajaxUrl = $container.attr('data-ajaxurl') || (typeof finbank_ajaxurl !== 'undefined' ? finbank_ajaxurl : null) || '/wp-admin/admin-ajax.php';
        if (query && ajaxUrl) {
          loadmoreParams = { ajaxurl: ajaxUrl, query: query, term: term };
          paramName = term;
        }
      } catch (e) {}
    }
  }
  
  if (loadmoreParams) {
    // Используем делегирование событий для надежной работы
    // Удаляем предыдущие обработчики, если они есть
    $(document).off("click.loadmore", ".load-daha[data-term]");
    
    // Устанавливаем обработчик через делегирование СРАЗУ
    // Это гарантирует, что обработчик будет работать с первого клика
    $(document).on("click.loadmore", ".load-daha[data-term]", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      var $btn = $(this);
      
      // Проверяем, что это кнопка для AJAX загрузки (есть data-term)
      if (!$btn.attr('data-term') && !$btn.data('term')) {
        return false;
      }
      
      // Проверяем, не идет ли уже загрузка
      if ($btn.data('is-loading') === true) {
        return false;
      }
      
      // Проверяем, не отключена ли кнопка
      if ($btn.prop('disabled')) {
        return false;
      }
      
      // Читаем данные из атрибутов (приоритет attr над data)
      var currentPage = parseInt($btn.attr('data-page')) || 1;
      var maxPages = parseInt($btn.attr('data-max-pages')) || 1;
      var foundPosts = parseInt($btn.attr('data-found-posts')) || 0;
      var term = $btn.attr('data-term') || 'kredity';
      
      // Считаем количество уже загруженных постов
      var loadedPosts = $('#response-cred-card .card, #response-cred-card .query__card, #response-cred-card .archive__card').length;

      // Проверяем, есть ли еще посты для загрузки
      if (loadedPosts >= foundPosts) {
        $btn.hide();
        return false;
      }

      // Устанавливаем флаг загрузки СРАЗУ, чтобы предотвратить повторные клики
      $btn.data('is-loading', true);
      var originalText = $btn.text();
      $btn.prop('disabled', true).text('Загрузка...');

      // Подготавливаем параметры запроса
      var queryParams = JSON.parse(JSON.stringify(loadmoreParams.query)); // Копируем объект
      // Используем posts_per_page из query (задан в настройках листингов) или 40 по умолчанию
      var postsPerPage = (queryParams.posts_per_page && parseInt(queryParams.posts_per_page, 10) > 0)
        ? parseInt(queryParams.posts_per_page, 10)
        : 40;
      
      // Рассчитываем offset на основе количества уже загруженных постов
      // Первая страница: 0-39 (40 постов), первый клик: offset=40, второй: offset=80 и т.д.
      var offset = loadedPosts; // offset = количество уже загруженных постов
      
      // Убеждаемся, что offset не меньше 0
      if (offset < 0) {
        offset = 0;
      }
        
        queryParams.posts_per_page = postsPerPage;
        // Удаляем все параметры пагинации из queryParams, так как мы передаем их отдельно
        delete queryParams.paged;
        delete queryParams.offset;
        delete queryParams.page;

        // Получаем текущий порядок сортировки, если есть
        var order = $('.cred-order-select option:selected').val() || '';

        // Сохраняем количество постов до загрузки для проверки дублирования
        var postsBefore = loadedPosts;
        var requestId = Date.now() + '_' + Math.random(); // Уникальный ID запроса

        $.ajax({
          url: loadmoreParams.ajaxurl,
          type: 'POST',
          data: {
            action: 'loadmorebutton',
            query: JSON.stringify(queryParams),
            page: currentPage,
            posts_per_page: postsPerPage,
            offset: offset, // Передаем offset для правильной пагинации
            term: term,
            order: order || '',
            exclude_post: '',
            request_id: requestId // Передаем ID запроса для отладки
          },
          success: function(response) {
            // Сбрасываем флаг загрузки сразу после получения ответа
            $btn.data('is-loading', false);
            
            if (response && response.trim()) {
              // Создаем временный контейнер для проверки дублирования
              var $tempContainer = $('<div>').html(response);
              var $newPosts = $tempContainer.find('.card, .query__card, .archive__card');
              
              // Получаем ID уже загруженных постов из различных источников
              var existingIds = [];
              $('#response-cred-card .card, #response-cred-card .query__card, #response-cred-card .archive__card').each(function() {
                var $post = $(this);
                // Пробуем найти ID из разных мест
                var postId = $post.find('[data-popap-apply-id]').attr('data-popap-apply-id') ||
                             $post.find('[data-id]').first().attr('data-id') ||
                             $post.find('.btn__compare').attr('data-id') ||
                             $post.find('.open__dop-btn').attr('data-id') ||
                             $post.attr('data-id');
                
                // Если не нашли, пробуем извлечь из ссылки
                if (!postId) {
                  var href = $post.find('a[href*="/kredity/"], a[href*="/creditcard/"], a[href*="/debetcard/"]').first().attr('href');
                  if (href) {
                    var match = href.match(/\/(\d+)\//);
                    if (match) postId = match[1];
                  }
                }
                
                if (postId) {
                  existingIds.push(postId.toString());
                }
              });
              
              // Фильтруем новые посты, исключая дубликаты
              var $uniquePosts = $newPosts.filter(function() {
                var $post = $(this);
                // Пробуем найти ID из разных мест
                var postId = $post.find('[data-popap-apply-id]').attr('data-popap-apply-id') ||
                             $post.find('[data-id]').first().attr('data-id') ||
                             $post.find('.btn__compare').attr('data-id') ||
                             $post.find('.open__dop-btn').attr('data-id') ||
                             $post.attr('data-id');
                
                // Если не нашли, пробуем извлечь из ссылки
                if (!postId) {
                  var href = $post.find('a[href*="/kredity/"], a[href*="/creditcard/"], a[href*="/debetcard/"]').first().attr('href');
                  if (href) {
                    var match = href.match(/\/(\d+)\//);
                    if (match) postId = match[1];
                  }
                }
                
                if (postId) {
                  var postIdStr = postId.toString();
                  if (existingIds.indexOf(postIdStr) !== -1) {
                    return false;
                  }
                  existingIds.push(postIdStr);
                }
                return true;
              });
              
              // Добавляем только уникальные посты
              if ($uniquePosts.length > 0) {
                var $uniqueContainer = $('<div>').append($uniquePosts);
                $('#response-cred-card').append($uniqueContainer.html());
              }
              
              // Обновляем номер страницы
              var nextPage = currentPage + 1;
              $btn.data('page', nextPage);
              $btn.attr('data-page', nextPage);
              
              // Обновляем данные кнопки для следующего запроса
              $btn.data('max-pages', maxPages);
              $btn.data('found-posts', foundPosts);
              $btn.data('term', term);

              // Проверяем, нужно ли скрыть кнопку:
              // 1) Если сервер вернул меньше постов, чем запрашивали — это последняя порция, скрываем кнопку
              // 2) Пересчитываем загруженные посты в DOM и сравниваем с foundPosts
              var receivedCount = $newPosts.length;
              var isLastBatch = (receivedCount > 0 && receivedCount < postsPerPage);
              var loadedPostsAfter = $('#response-cred-card .card, #response-cred-card .query__card, #response-cred-card .archive__card').length;
              var allLoaded = (loadedPostsAfter >= foundPosts) || isLastBatch;
              
              if (allLoaded) {
                $btn.hide();
              } else {
                $btn.prop('disabled', false).text(originalText);
              }
            } else {
              // Если ответ пустой, значит больше нет постов
              $btn.hide();
            }
          },
          error: function(xhr, status, error) {
            // Сбрасываем флаг загрузки при ошибке
            $btn.data('is-loading', false);
            $btn.prop('disabled', false).text(originalText);
            alert('Произошла ошибка при загрузке постов. Пожалуйста, попробуйте еще раз.');
          }
        });
        
        return false;
      });
  } else {
    // Fallback для других страниц - старое поведение (показ/скрытие)
    var itemsPerPage = 40; // при fallback используем значение по умолчанию
    var totalItems = $(".list_posts .card").length;
    var shownItems = itemsPerPage;

    $(".list_posts .card").slice(itemsPerPage).hide();
    if (shownItems < totalItems) {
      $(".load-daha").show();
    }

    // Удаляем предыдущие обработчики для fallback, чтобы избежать конфликтов
    $(".load-daha").off("click.fallback").on("click.fallback", function (e) {
      // Проверяем, не обрабатывается ли это кнопкой с data-term (AJAX загрузка)
      var $btn = $(this);
      if ($btn.attr('data-term') || $btn.data('term')) {
        return; // Пропускаем, если это AJAX кнопка
      }
      e.preventDefault();
      $(".list_posts .card")
        .slice(shownItems, shownItems + itemsPerPage)
        .fadeIn();
      shownItems += itemsPerPage;
      if (shownItems >= totalItems) {
        $(this).hide();
      }
    });
  }
  
  // Обработчик для кнопки загрузки таблицы new_table_collection
  $(document).on("click", ".load-daha[data-action='load_more_table_collection']", function(e) {
    e.preventDefault();
    var $btn = $(this);
    var paged = parseInt($btn.data('paged')) || 1;
    var maxPages = parseInt($btn.data('max-pages')) || 1;
    var type = $btn.data('type') || '';
    var $container = $btn.closest('.code3');
    var isLoading = $btn.data('loading');
    
    if (isLoading || paged >= maxPages) {
      return;
    }
    
    $btn.data('loading', true);
    var originalText = $btn.text();
    $btn.prop('disabled', true).text('Загрузка...');
    
    // Получаем allposts_collection из data-атрибута контейнера или глобальной переменной
    var $container = $btn.closest('#table_collection');
    var allpostsCollection = [];
    if ($container.length) {
      var collectionData = $container.data('allposts-collection');
      if (collectionData && Array.isArray(collectionData)) {
        allpostsCollection = collectionData;
      } else if (typeof collectionData === 'string') {
        try {
          allpostsCollection = JSON.parse(collectionData);
        } catch(e) {
          // Ошибка парсинга - используем пустой массив
        }
      }
    }
    if (allpostsCollection.length === 0 && typeof window.allposts_collection !== 'undefined') {
      allpostsCollection = window.allposts_collection;
    }
    
    $.ajax({
      url: (typeof table_collection_ajax !== 'undefined' ? table_collection_ajax.ajax_url : '/wp-admin/admin-ajax.php'),
      type: 'POST',
      data: {
        action: 'load_more_table_collection',
        paged: paged,
        type: type,
        allposts_collection: JSON.stringify(allpostsCollection)
      },
      success: function(response) {
        if (response.success && response.data.html) {
          // Вставляем HTML перед кнопкой
          $btn.before(response.data.html);
          
          // Обновляем data-атрибуты кнопки
          $btn.data('paged', response.data.paged);
          $btn.data('max-pages', response.data.max_pages);
          
          if (!response.data.has_more) {
            $btn.hide();
          } else {
            $btn.prop('disabled', false).text(originalText);
          }
        } else {
          $btn.hide();
        }
        $btn.data('loading', false);
      },
      error: function(xhr, status, error) {
        $btn.prop('disabled', false).text(originalText);
        $btn.data('loading', false);
        alert('Произошла ошибка при загрузке. Пожалуйста, попробуйте еще раз.');
      }
    });
  });
});
