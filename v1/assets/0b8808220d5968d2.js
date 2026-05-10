jQuery(function ($) {
  /*
   * Load More
   */

  $(document).on("click", ".popup_close", function () {
    $(".popup").fadeOut();
    $(".popup").attr("data-show", "N");
  });

  // КЛИК ВНЕ ЭЛЕМЕНТА И СКРЫТИЕ
  $(document).mouseup(function (e) {
    var popup_apply_now = $(".popup");
    var $target = $(e.target);
    if (
      !$target.closest(".popup__inner").length &&
      $(".popup__inner").is(":visible")
    ) {
      popup_apply_now.hide();
      popup_apply_now.attr("data-show", "N");
    }
  });

  $("#checkpolicy").change(function () {
    var btn_send_form = $(".btn-send-form");
    if (!$(this).is(":checked")) {
      btn_send_form.addClass("need-checbox");
      btn_send_form.attr("disabled", "");
    } else {
      btn_send_form.removeClass("need-checbox");
      btn_send_form.attr("disabled", false);
    }
  });

  $(".rating-btn-open").on("click", function () {
    $(".input-select-star").show(500);
    $(this).hide(500);
  });

  $(".input-select-star .star .deactivate").on("click", function () {
    var need = $(this).parent().data("id");
    $("#input-select-star").val(need);
    for (let i = 0; i < need; i++) {
      $(".input-select-star .deactivate").eq(i).removeClass("show");
      $(".input-select-star .active").eq(i).addClass("show");
    }
  });

  $(".input-select-star .star .active").on("click", function () {
    var need = $(this).parent().data("id");
    $("#input-select-star").val(need);
    for (let i = need; i <= 10; i++) {
      $(".input-select-star .active").eq(i).removeClass("show");
      $(".input-select-star .deactivate").eq(i).addClass("show");
    }
  });

  $(document).on("click", ".btn__collmore_cat, .filter-title", function () {
    // Определяем, с какого элемента клик:
    const $isTitle = $(this).is(".filter-title");
    let $btn, $section;

    if ($isTitle) {
      // если клик — по заголовку, ищем рядом кнопку и секцию
      $btn = $(this).siblings(".btn__collmore_cat");
      $section = $(this).siblings(".filter__section");
    } else {
      // если клик — по кнопке, как было
      $btn = $(this);
      const id = $btn.data("id");
      $section = $btn.parent().find("#" + id);
    }

    // Если у этой группы нечего показывать — выходим
    if (!$btn.length || $btn.data("click") == 0) {
      return;
    }

    // Переключаем «открыто/закрыто» на кнопке
    $btn.toggleClass("btn__collmore_visible");

    // Показываем/скрываем элементы списка
    $section.find(".coll_li").toggleClass("coll__hidden");

    // Обновляем тексты внутри кнопки
    const textOpen = $btn.data("text-open");
    const textHide = $btn.data("text-hide");

    // Сначала сбросим всем на text-open
    $(".btn__collmore_cat .btn__collmore-text").text(textOpen);
    // А для открытой кнопки — text-hide
    $(".btn__collmore_cat.btn__collmore_visible .btn__collmore-text").text(
      textHide
    );
  });

  $(".validate-footer").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      checkpolicy: {
        required: true,
      },
    },
    messages: {
      email: {
        required: "Обязательное поле",
        email:
          "Ваш адрес электронной почты должен быть в формате maksim1992@mail.ru",
      },
      checkpolicy: {
        required: "(Обязательное поле)",
      },
    },
  });

  $(".validate-comment-form").validate({
    rules: {
      comment: {
        required: true,
      },
      author: {
        required: true,
        minlength: 2,
      },
      phone: {
        required: true,
        checkMaskPhone: true,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      comment: {
        required: "Обязательное поле",
      },
      author: {
        required: "Обязательное поле",
        minlength: "Минимум 2 символа",
      },
      email: {
        required: "Обязательное поле",
        email:
          "Ваш адрес электронной почты должен быть в формате maksim1992@mail.ru",
      },
      phone: {
        required: "Обязательное поле",
        minlength: "Минимум 2 символа",
        phone: "Обязательное поле",
        checkMaskPhone: "Обязательное поле",
      },
    },
  });

  $(".range__value").on("input", function () {
    var max = parseInt($(this)[0].max);
    var val = parseInt($(this).val().replaceAll(" ", ""));

    if (val > max) {
      $(this).val(max);
    }
  });

  // FORM HELP BECOME BETTER
  $(".ajax-form-add").submit(function (e) {
    e.preventDefault();
    var form_data = $(this).serialize();
    var response = $(".response-for-form");

    $.ajax({
      type: "POST",
      url: "/ajax-form-add.php",
      data: form_data,
      dataType: "json",
      success: function (res) {
        console.log(res);
        response.show();

        if (res.success == true) {
          response.html(res.message);
        } else {
          response.text("");
          response.html(res.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        response.text("");
        response.html(jqXHR.responseJSON.message);
      },
    });
  });

  // FORM HELP BECOME BETTER
  $(".form-help-become-better").submit(function (e) {
    e.preventDefault();
    var form_data = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/ajax-form-add.php",
      data: form_data,
      dataType: "json",
      success: function (res) {
        console.log(res);

        if (res.success == true) {
          $("#wrapper-form-help-become-better").hide(500);
          $("#thanks-form-help").show(500);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {},
    });
  });

  // COMMENT PAGE FORM
  $(".comment-form").submit(function (e) {
    e.preventDefault();
    var form_data = $(this).serialize();
    var response = $(".response-for-comment");

    // wp_handle_comment_submission( wp_unslash( $_POST ) ); --- Долго выполняется
    // поэтому сразу покажем что все успешно
    response.text("");
    response.show();
    $.ajax({
      type: "POST",
      url: "/custom-comments-post.php",
      data: form_data,
      dataType: "json",
      success: function (res) {
        response.html(res.message);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        response.text("");
        response.html(jqXHR.responseJSON.message);
      },
    });
  });

  // COMMENT FORM
  $(".article_comment-form").submit(function (e) {
    e.preventDefault();
    var form_data = $(this).serialize();
    var response = $(".response-for-comment");
    // wp_handle_comment_submission( wp_unslash( $_POST ) ); --- Долго выполняется
    // поэтому сразу покажем что все успешно
    response.show();
    $.ajax({
      type: "POST",
      url: "/custom-comments-post.php",
      data: form_data,
      dataType: "json",
      success: function (res) {
        response.text(res.message);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        response.text("");
        response.html(jqXHR.responseJSON.message);
      },
    });
  });

  $(".btn__compare").append(
    '<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>'
  );

  // листинги

  (function ($) {
    function initLoadMore(btnSelector, formSelector, asideSelector, termValue) {
      $(btnSelector).on("click", function (e) {
        e.preventDefault();

        const $btn = $(this);
        const current = parseInt($btn.data("paged"), 10) || 1;
        const maxPage = parseInt($btn.data("max_pages"), 10) || 1;
        const nextPage = current + 1;

        // если дальше некуда — просто скрываем
        if (nextPage > maxPage) {
          return $btn.hide();
        }

        // собираем остальные параметры, как у тебя было
        let postData = formSelector ? $(formSelector).serialize() : "";
        if (asideSelector) {
          const aside = $(asideSelector).serialize();
          if (aside) postData += "&" + aside;
        }
        postData +=
          "&action=cardfilter" +
          "&term=" +
          encodeURIComponent(termValue) +
          "&order=" +
          encodeURIComponent($(".cred-order-select").val() || "") +
          "&page=" +
          nextPage +
          "&posts_per_page=" +
          parseInt($btn.data("posts_per_page") || 20, 10);

        $.ajax({
          url: card_loadmore_params.ajaxurl,
          data: postData,
          dataType: "json",
          type: "POST",
          beforeSend() {
            $btn.text("Загрузка333…");
          },
          success(data) {
            if (!data.content) {
              return $btn.hide();
            }
            // вставляем
            $("#response-cred-card").append(data.content);

            // обновляем data-атрибуты
            $btn
              .data("paged", nextPage)
              .data("max_pages", data.max_page)
              .text(nextPage >= data.max_page ? "" : "Больше решений222");

            if (nextPage >= data.max_page) {
              $btn.hide();
            } else {
              $btn.show();
            }

            // обновляем счётчики
            $(".variants_count").text(data.found_posts);
          },
          error() {
            $btn.text("Ошибка, попробуйте снова");
          },
        });
      });
    }

    // === Инициализация ===
    // 1) Для кредитных карт — фильтрующая форма + aside
    initLoadMore(
      ".load_more_btn",
      "#credit-card-filter",
      //"#calc-credit-card-filter",
      "#credit-card-filter-aside",
      $("main").attr("term") || "creditcard"
    );

    // 2) Для коллекций, где отдельная кнопка и нет формы фильтра
    initLoadMore(".load_more_btn1", "#collection-card", null, "collection");
  })(jQuery);

  // Запуск фильтров, если человек передал ssession, за это отвечает mt
  if ($(".start-func-credit-card-filter").length) {
    filter_main_start();
  }

  // Общая функция фильтра/калькулятора
  function filter_main_start(formSelector) {
    const $form = $(formSelector);
    const order = $form.find(".cred-order-select option:selected").val() || "";
    const checkboxes = $("#credit-card-filter-aside").serialize();

    // Сериализуем все поля формы
    const arr = $form.serializeArray();
    const data = {};

    arr.forEach((field) => {
      let name = field.name;
      const val = field.value;

      // Переименовываем поля из калькулятора
      if (name === "clc_z_sum") name = "z_sum";
      if (name === "calc_z_time" || name === "range2") name = "z_time";
      if (name === "calc_cred_limit" || name === "range1") name = "cred_limit";

      // Обнуляем нулевые числовые поля
      if (
        [
          "z_sum",
          "z_time",
          "cred_limit",
          "summ_limit",
          "cred_day_period",
          "cred_summ_period",
          "percent_limit",
          "cashback_number",
        ].includes(name) &&
        Number(val) === 0
      ) {
        data[name] = "";
      } else {
        data[name] = val;
      }
    });

    // Финальный параметр order
    data["order"] = order;

    // Собираем строку GET-параметров
    let params = $.param(data);
    if (checkboxes) params += "&" + checkboxes;

    // Если используется новая версия шаблона
    if ($(".use_new_template_v1").length) {
      const vt = window.localStorage.getItem("view_type") || "card_list";
      params += "&view_template=1&view_type=" + vt;
    }

    // AJAX-запрос
    $.ajax({
      url: card_loadmore_params.ajaxurl,
      type: "POST",
      dataType: "json",
      data: params,
      beforeSend() {
        $form.find(".submit-button").text("Загрузка...");
      },
      success(data) {
        $form.find(".submit-button").text("Показать");
        $("#response-cred-card.list_posts").html(data.content);
        $(".pagination__description .count_all").text(data.found_posts);
        $(".variants_count").text(data.found_posts);
        $(".pagination__description .count_view").text(
          $(".query__card").length
        );
        card_loadmore_params.current_page = 1;
        card_loadmore_params.posts = data.posts;
        card_loadmore_params.max_page = data.max_page;
        if (data.max_page < 2) {
          $(".load_more_btn").hide();
        } else {
          $(".load_more_btn").show();
        }
        $(".btn__compare").append(
          '<span class="tool-add">Добавить в сравнение</span>' +
            '<span class="tool-remove">Удалить из сравнения</span>'
        );
      },
    });

    // Событие метрики
    yandex_metrika_filter_click();
    return false;
  }

  // Привязки кнопок
  $("#credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#credit-card-filter");
  });
  $("#calc-credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#calc-credit-card-filter");
  });

  // Привязки кнопок
  $("#credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#credit-card-filter");
  });
  $("#calc-credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#calc-credit-card-filter");
  });

  // Привязываем кнопку фильтра
  $("#credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#credit-card-filter");
  });

  // Привязываем кнопку калькулятора
  $("#calc-credit-card-filter .submit-button").on("click", function () {
    return filter_main_start("#calc-credit-card-filter");
  });

  function yandex_metrika_filter_click() {
    ym(35020350, "reachGoal", "click_pokazat_filtr");
    ym(35020350, "reachGoal", "filtr_knopka");
  }

  $(
    "#credit-card-filter .submit-button, #credit-card-filter-aside .submit-button, #calc-credit-card-filter .submit-button"
  ).click(function () {
    filter_main_start();
  });

  // Фильтр сортировки коллекции
  $(".collection-order").change(function () {
    var order = $(".collection-order").find("option").attr("value");
    var filter = $("#collection-card");
    var mydata = filter.serialize();
    mydata += "&order=" + encodeURIComponent(order);

    console.log("mydata_order= " + mydata);

    $.ajax({
      url: card_loadmore_params.ajaxurl, // обработчик
      data: mydata, // данные
      dataType: "json",
      type: "POST", // тип запроса
      beforeSend: function (xhr) {
        filter.find(".submit-button").text("Загрузка..."); // изменяем текст кнопки
      },
      success: function (data) {
        filter.find(".submit-button").text("Показать"); // возвращаеи текст кнопки
        $("#response-cred-card.list_posts").html(data.content);
        $(".pagination__description .count_all").html(data.found_posts);
        $(".variants_count").html(data.found_posts);
        $(".pagination__description .count_view").html(
          $(".query__card").length
        );
        card_loadmore_params.current_page = 1;
        // set the new query parameters
        card_loadmore_params.posts = data.posts;
        // set the new max page parameter
        card_loadmore_params.max_page = data.max_page;
        if (data.max_page < 2) {
          $(".load_more_btn1").hide();
        } else {
          $(".load_more_btn1").show();
        }
        $(".btn__compare").append(
          '<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>'
        );
      },
    });
    return false;
  });

  // Фильтр сортировки
  $(".cred-order-select").change(function () {
    cred_order_select();
  });

  function cred_order_select() {
    var order = $(".cred-order-select option:selected").val() || "";
    var filter = $("#credit-card-filter");
    var mydata = filter.serialize();
    var checkboxes = $("#credit-card-filter-aside").serialize();
    var mydataArray = filter.serializeArray();
    var mydataValues = {};
    $.each(mydataArray, function (i, field) {
      if (
        (this.name == "cred_limit" && this.value == 0) ||
        (this.name == "cred_day_period" && this.value == 0) ||
        (this.name == "z_sum" && this.value == 0) ||
        (this.name == "z_time" && this.value == 0) ||
        (this.name == "summ_limit" && this.value == 0) ||
        (this.name == "cred_summ_period" && this.value == 0) ||
        (this.name == "percent_limit" && this.value == 0) ||

        (this.name == "order_priority" && this.value == 0) ||
        (this.name == "card_bank_link" && this.value == 0) ||
        
        (this.name == "cashback_number" && this.value == 0)
      ) {
        mydataValues[this.name] = "";
      } else {
        mydataValues[this.name] = this.value;
      }
    });
    if (mydataValues["cred_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cred_day_period"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["z_sum"] == 0) {
      $(".cred_limit").val("Любой");
    }
    
    if (mydataValues["z_time"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["summ_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cred_summ_period"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["percent_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cashback_number"] == 0) {
      $(".cred_trat").val("Любой");
    }

    if (mydataValues["card_bank_link"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["order_priority"] == 0) {
      $(".cred_limit").val("Любой");
    }

    var mydata = $.param(mydataValues);
    if (checkboxes) {
      mydata += "&" + checkboxes;
    }

    if ($(".order_type").length) {
      var order_type = $(".order_type").attr("data-order_type");
      // ASC DESC
      mydata += "&order_type=" + order_type;
    }

    if ($(".use_new_template_v1").length) {
      var view_type = window.localStorage.getItem("view_type");
      if (!view_type) {
        view_type = "card_list";
      }

      mydata += "&view_template=1&view_type=" + view_type;
    }

    mydata += "&order=" + encodeURIComponent(order);

    $.ajax({
      url: card_loadmore_params.ajaxurl, // обработчик
      data: mydata, // данные
      dataType: "json",
      type: "POST", // тип запроса
      beforeSend: function (xhr) {
        filter.find(".submit-button").text("Загрузка..."); // изменяем текст кнопки
      },
      success: function (data) {
        filter.find(".submit-button").text("Показать"); // возвращаеи текст кнопки
        $("#response-cred-card.list_posts").html(data.content);
        $(".pagination__description .count_all").html(data.found_posts);
        $(".variants_count").html(data.found_posts);
        $(".pagination__description .count_view").html(
          $(".query__card").length
        );
        card_loadmore_params.current_page = 1;
        // set the new query parameters
        card_loadmore_params.posts = data.posts;
        // set the new max page parameter
        card_loadmore_params.max_page = data.max_page;
        if (data.max_page < 2) {
          $(".load_more_btn").hide();
        } else {
          $(".load_more_btn").show();
        }
        $(".btn__compare").append(
          '<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>'
        );
      },
    });
    return false;
  }

  // Боковой фильтр
  $("#credit-card-filter-aside .submit-button").click(function () {
    var filter = $("#credit-card-filter");
    var mydata = filter.serialize();
    var checkboxes = $("#credit-card-filter-aside").serialize();
    var mydataArray = filter.serializeArray();
    var mydataValues = {};
    $.each(mydataArray, function (i, field) {
      if (
        (this.name == "cred_limit" && this.value == 0) ||
        (this.name == "cred_day_period" && this.value == 0) ||
        (this.name == "z_sum" && this.value == 0) ||
        (this.name == "z_time" && this.value == 0) ||
        (this.name == "summ_limit" && this.value == 0) ||
        (this.name == "cred_summ_period" && this.value == 0) ||
        (this.name == "percent_limit" && this.value == 0) ||
        (this.name == "cashback_number" && this.value == 0)
      ) {
        mydataValues[this.name] = "";
      } else {
        mydataValues[this.name] = this.value;
      }
    });
    if (mydataValues["cred_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cred_day_period"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["z_sum"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["z_time"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["summ_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cred_summ_period"] == 0) {
      $(".cred_trat").val("Любой");
    }
    if (mydataValues["percent_limit"] == 0) {
      $(".cred_limit").val("Любой");
    }
    if (mydataValues["cashback_number"] == 0) {
      $(".cred_trat").val("Любой");
    }

    var mydata = $.param(mydataValues);
    if (checkboxes) {
      mydata += "&" + checkboxes;
    }
    mydata += "&order=" + encodeURIComponent(order);

    $.ajax({
      url: card_loadmore_params.ajaxurl, // обработчик
      data: mydata, // данные
      dataType: "json",
      type: "POST", // тип запроса
      beforeSend: function (xhr) {
        filter.find(".submit-button").text("Загрузка..."); // изменяем текст кнопки
      },
      success: function (data) {
        filter.find(".submit-button").text("Показать"); // возвращаеи текст кнопки
        $("#response-cred-card.list_posts").html(data.content);
        $(".pagination__description .count_all").html(data.found_posts);
        $(".variants_count").html(data.found_posts);
        $(".pagination__description .count_view").html(
          $(".query__card").length
        );
        card_loadmore_params.current_page = 1;
        // set the new query parameters
        card_loadmore_params.posts = data.posts;
        // set the new max page parameter
        card_loadmore_params.max_page = data.max_page;
        if (data.max_page < 2) {
          $(".load_more_btn").hide();
        } else {
          $(".load_more_btn").show();
        }
        $(".btn__compare").append(
          '<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>'
        );
      },
    });
    return false;
  });

  // Фильтр на странице банка
  $("#bank-offer-filter .submit-button").click(function () {
    var filter = $("#bank-offer-filter");
    var mydata = filter.serialize();
    $.ajax({
      url: card_loadmore_params.ajaxurl, // обработчик
      data: mydata, // данные
      dataType: "json",
      type: "POST", // тип запроса
      beforeSend: function (xhr) {
        filter.find(".submit-button").text("Загрузка..."); // изменяем текст кнопки
      },
      success: function (data) {
        filter.find(".submit-button").text("Показать"); // возвращаеи текст кнопки
        $("#response-bank-offers").html(data.content);
        card_loadmore_params.current_page = 1;
        // set the new query parameters
        card_loadmore_params.posts = data.posts;
        // set the new max page parameter
        card_loadmore_params.max_page = data.max_page;
        $(".btn__compare").append(
          '<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>'
        );
      },
    });
    return false;
  });
  $(".bank_card_select .multipleSelect__item").click(function () {
    setTimeout(function () {
      if ($(".bank_card_select .multipleSelect__btn-count").text() != "") {
        $(".bank_kred_select button").addClass("disabled");
      }
      if ($(".bank_card_select .multipleSelect__btn-count").text() == "") {
        $(".bank_kred_select button").removeClass("disabled");
      }
    }, 50);
  });
  $(".kred_select .multipleSelect__item").click(function () {
    setTimeout(function () {
      if ($(".kred_select .multipleSelect__btn-count").text() != "") {
        $(".kred_select button").addClass("disabled");
      }
      if ($(".kred_select .multipleSelect__btn-count").text() == "") {
        $(".kred_select button").removeClass("disabled");
      }
    }, 50);
  });
  // Фильтр на главной странице
  $("#main-page-filter .main-submit-button").click(function () {
    var filter = $("#main-page-filter");
    var productType = $("#productTypeSelect").find("option").attr("value");
    var mydata = filter.serialize();
    mydata += "&product_type=" + productType;
    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-main-filter.php", // обработчик
      data: mydata, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        console.log(data);
        filter.find(".main-submit-button").text("Варианты");
        window.location.href = data;
      },
    });
    //console.log(mydata);
    return false;
  });

  $(function () {
    $("#productTypeSelect").change(function () {
      $(".main_filter_input").addClass("d-none");
      $(".main_filter_input." + $(this).val()).removeClass("d-none");
    });
  });

  // Поиск в шапке
  const search_input = $(".header__search-input");
  search_input.keyup(function () {
    let search_value = $(this).val();
    //console.log(search_value);
    if (search_value.length > 2) {
      // кол-во символов
      $.ajax({
        url: "/wp-admin/admin-ajax.php",
        type: "POST",
        data: {
          action: "ajax_search", // functions.php
          term: search_value,
        },
        success: function (results) {
          $("#result_search_ajax").html(results);
        },
      });
    }
    if (search_value.length < 1) {
      $("#result_search_ajax").html("");
    }
  });
  $("#searchContainer .header__search-close").click(function () {
    $("#result_search_ajax").html("");
    $("#searchContainer .header__search-input").val("");
  });
  $(".search-form").keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  $(".best1-order-select").change(function () {
    var value = $(".best1-order-select option:selected").val();
    console.log(value);
    var GETR = "?order=" + value;
    window.location = window.location.pathname + GETR;
  });

  $(".best-order-select").change(function () {
    var value = $(".best-order-select option:selected").val();
    console.log(value);
    var GETR = "?order=" + value;
    window.location = window.location.pathname + GETR;
  });

  setTimeout(function () {
    var compare_link = window.sessionStorage.getItem("compare_link");
    if (compare_link) {
      $(".header-compare-link").attr("href", compare_link);
      $(".popup_compare_btn").attr("href", compare_link);
    }
  }, 1000);

  var rotation = 0;
  $(document).on("click", ".order_type", function () {
    rotation += 180;
    $(this).css({
      "-webkit-transform": "rotate(" + rotation + "deg)",
      "-moz-transform": "rotate(" + rotation + "deg)",
      "-ms-transform": "rotate(" + rotation + "deg)",
      transform: "rotate(" + rotation + "deg)",
    });

    var sort = $(this).attr("data-order_type");
    if (sort == "DESC") {
      $(this).attr("data-order_type", "ASC");
    } else {
      $(this).attr("data-order_type", "DESC");
    }

    cred_order_select();
  });

  // Сравнение продуктов

  let popupTimeout;
  $(document).on("click", ".btn__compare", function () {
    var post_id = $(this).attr("data-id");
    var post_tax = $(this).attr("data-tax");
    var $popup = $(".popup_compare");
    // переключаем активность кнопки
    $(this).toggleClass("btn_compare_on");

    if ($(this).hasClass("btn_compare_on")) {
      // показ окна
      $popup.fadeIn();

      // если где-то уже висит предыдущий таймаут — сбросим
      clearTimeout(popupTimeout);

      // через 5 секунд автоматически скрываем
      popupTimeout = setTimeout(function () {
        $popup.fadeOut();
      }, 5000);
    } else {
      // при повторном клике — скрываем и очищаем таймаут
      clearTimeout(popupTimeout);
      $popup.fadeOut();
    }

    var compare_link = "/compare-installment-cards/";
    switch (post_tax) {
      // карта рассрочки
      case "installmentcard":
        compare_link = "/compare-installment-cards/";
        break;
      case "zaimy":
        compare_link = "/compare-zaimy/";
        break;
      case "creditcard":
        compare_link = "/compare-cred-cards/";
        break;
      case "debetcard":
        compare_link = "/compare-debet-cards/";
        break;
      case "kredity":
        compare_link = "/compare-kredity/";

        break;
    }

    $(".header-compare-link").attr("href", compare_link);
    $(".popup_compare_btn").attr("href", compare_link);
    window.sessionStorage.setItem("compare_link", compare_link);

    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-compare.php", // обработчик
      data: {
        post_id: post_id,
        post_tax: post_tax,
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        if (data > 0) {
          $(".header-compare-link .count").remove();
          $(".header-compare-link .header__links-icon").prepend(
            '<div class="count">' + data + "</div>"
          );
        } else {
          $(".header-compare-link .count").remove();
        }
      },
    });
    $.ajax({
      url: "/wp-content/themes/finbank_theme/get-compare-offer.php", // обработчик
      data: {
        post_id: post_id,
        post_tax: post_tax,
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        $(".popup_compare_prod").html(data);
      },
    });
    return false;
  });

  //$('.btn__compare').append('<span class="tool-add">Добавить в сравнение</span><span class="tool-remove">Удалить из сравнения</span>');
  $(document).on("click", ".popup_compare_close", function () {
    clearTimeout(popupTimeout);
    $(".popup_compare").fadeOut();
  });

  $(document).on("click", ".delete_card", function () {
    var card_index = $(this).closest(".compare__item").attr("data-index");
    var card_type = $("main").attr("data-type");
    card_index = card_index - 1;
    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-compare.php", // обработчик
      data: {
        card_index: card_index,
        card_type: card_type,
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        if (data == "redirect") {
          $(".header-compare-link").attr(
            "href",
            "http://" + document.domain + "/compare-cred-cards"
          );
        } else {
          $(".header-compare-link").removeAttr("href");
        }
        location.reload();
      },
    });
    return false;
  });

  // Отзывы
  $(document).on("click", ".reviews-link", function () {
    var post_id = $(this).attr("post-id");
    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-reviews.php", // обработчик
      data: {
        post_id: post_id,
        display_type: "comments",
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        window.location.href = "http://" + document.domain + "/reviews";
      },
    });
    return false;
  });
  $(document).on("click", ".tax-reviews", function () {
    var data_tax = $(this).attr("data-tax");
    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-reviews.php", // обработчик
      data: {
        data_tax: data_tax,
        display_type: "reviews",
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
        window.location.href = "http://" + document.domain + "/reviews";
      },
    });
    return false;
  });
  $(document).on("click", ".input-comment-trigger", function () {
    var post_id = $(this).attr("post-id");
    $.ajax({
      url: "/wp-content/themes/finbank_theme/session-reviews.php", // обработчик
      data: {
        post_id: post_id,
        display_type: "comments",
      }, // данные
      type: "POST", // тип запроса
      beforeSend: function (xhr) {},
      success: function (data) {
      },
    });
    return false;
  });
  setTimeout(function () {
    $(".pagination__description .review-count").html(
      $(
        ".comments-page-list .comments__item[style='display: block;'] .comment__one"
      ).length
    );
    $(document).on("click", "#loadMore", function () {
      $(".pagination__description .review-count").html(
        $(".comments-page-list .comments__item:visible .comment__one").length
      );
      setTimeout(function () {
        $(".pagination__description .review-count").html(
          $(
            ".comments-page-list .comments__item[style='display: block;'] .comment__one"
          ).length
        );
      }, 500);
    });
  }, 1000);
  setTimeout(function () {
    $(".pagination__description .review-tax-count").html(
      $(".reviews-page-list .reviews__page-item[style='display: block;']")
        .length
    );
    $(".pagination__description .review-tax-count-all").html(
      $(".reviews-page-list .reviews__page-item").length
    );
    $(document).on("click", "#loadMore", function () {
      setTimeout(function () {
        $(".pagination__description .review-tax-count").html(
          $(".reviews-page-list .reviews__page-item[style='display: block;']")
            .length
        );
        $(document).on("click", "#loadMore", function () {
          $(".pagination__description .review-tax-count").html(
            $(".reviews-page-list .reviews__page-item[style='display: block;']")
              .length
          );
        });
      }, 500);
    });
  }, 1000);

  $(".addtoany_shortcode a").click(function (e) {
    var count_id = $(this).closest(".card__icon").attr("data-id");
    var link = $(this).attr("href");
    console.log(link);
    e.preventDefault();
    $.ajax({
      url: "/wp-admin/admin-ajax.php",
      data: {
        action: "increment_counter",
        post_id: count_id,
      },
      type: "POST",
    })
      .done(function () {
        window.location.href = link;
      })
      .fail(function (xhr) {
        console.log(xhr);
      });
  });

  // Кастомные правки ссылок
  $(".offer-tabs .nav-link").click(function () {
    $(".offers-link-main").attr("href", $(this).attr("data-link"));
  });
  $(".article-tabs .nav-link").click(function () {
    $(".article-link-main").attr("href", $(this).attr("data-link"));
  });
  $(".reviews-tabs .nav-link").click(function () {
    var datatax = $(this).attr("data-tax");
    console.log(datatax);
    if (datatax == "banks")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-banks"
      );
    if (datatax == "kredity")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-kredity"
      );
    if (datatax == "creditcard")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-creditcard"
      );
    if (datatax == "debetcard")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-debetcard"
      );
    if (datatax == "installmentcard")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-installmentcard"
      );
    if (datatax == "zaimy")
      $(".reviews-link-main").attr(
        "href",
        "https://" + document.domain + "/reviews-zaimy"
      );
  });
});

jQuery(document).ready(function ($) {
  // Делегируем на document (или на ближайший статичный контейнер, в котором появляются ссылки)
  $(document).on("click", ".link-data", function () {
    var encodedUrl = $(this).attr("data-link");

    try {
      // Декодируем URL
      var decodedUrl = atob(encodedUrl);

      // Здесь можно добавить аналитические события, если нужно:
      // ym(35020350, 'reachGoal', 'click_oformit_listing');
      // ym(35020350, 'reachGoal', 'click_na_vse_oformit_s_referalkoy');

      // Открываем декодированный URL в новой вкладке
      window.open(decodedUrl, "_blank");
    } catch (e) {
      console.error("Ошибка декодирования URL", e);
    }
  });

  // Cache selectors
  var el = $(".article__one-contents, .mob-menutoc-contents");
  var topMenu = $("#menutoc, #menutocmob"),
    topMenuHeight = 15;
  // All list items
  (menuItems = topMenu.find("li a")),
    // Anchors corresponding to menu items
    (scrollItems = menuItems.map(function () {
      var item = $($(this).attr("href"));
      if (item.length) {
        return item;
      }
    }));
  // Bind to scroll
  $(window).scroll(function () {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + topMenuHeight;
    // Get id of current scroll item
    var cur = scrollItems.map(function () {
      if ($(this).offset().top < fromTop) {
        //console.log($(this).offset().top +' --- '+fromTop);
        return this;
      }
    });

    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    // Set/remove active class
    menuItems
      .parent()
      .removeClass("active")
      .end()
      .filter("[href='#" + id + "']")
      .parent()
      .addClass("active");
  });

  $(".tocdot").click(function () {
    $(".mob-menutoc-contents").toggleClass("open-tocdoc");
    $(".tocdot").toggleClass("tocopen");
  });
  $(".mob-menutoc-contents a").click(function () {
    $(".mob-menutoc-contents").toggleClass("open-tocdoc");
    $(".tocdot").toggleClass("tocopen");
  });

  $(".archive_title").click(function () {
    $(".archive_list").toggleClass("archive_hide");
  });

  $("#subscribe_action").submit(function () {
    var sub = false;
    if ($("#checkpolicy").is(":checked")) {
      sub = true;
    }

    if (sub) {
      $.ajax({
        url: "/subscribe.php",
        type: "POST",
        data: $(this).serialize(),
        beforeSend: function () {
          $(this).find("button[type=submit]").attr("disabled", true);
        },
        success: function (response) {
          if (response.success != false) {
            console.log("Good: " + response);
            $(this).find("button[type=submit]").attr("disabled", false);
            $(this).find("input").val("");
            $("#subscribe_action").css("display", "none");
            $("#subscribe_request").css("display", "block");
          } else {
            $("#email-error").html(response.data[0].message);
          }
        },
        error: function () {
          console.log("Error: " + response);
        },
      });
    }

    return false;
  });

  function present() {
    if ($(".present-content").is(":hidden")) {
      $(".present-content").fadeToggle();
      $(".present-icon-present").fadeToggle("fast");
      $(".present-icon-close").fadeToggle("fast");
    }
  }

  var presentwin = getCookie("popup_present");
  if (
    presentwin != "no" &&
    isMobileBrowser() == false &&
    $(".present-content").data("show_in_page") == 1
  ) {
    setTimeout(present, 10000);
    // записываем cookie на 1 день, с которой мы не показываем окно
    var date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = "popup_present=no; path=/; expires=" + date.toUTCString();
  }

  $(".popup_exit_close, .unified_popup_close").click(function () {
    var exitPopup = $(".unified_popup_wrap[data-popup-type='exit']");
    if (exitPopup.length === 0) {
      exitPopup = $(".popup_exit_wrap");
    }
    exitPopup.fadeOut();
  });

  // SLIDERS ALLL
  if ($(".slider").length) {
    tns({
      container: ".slider",
      pagination: ".slider__pagination",
      items: 1,
      autoplay: 1,
      autoplayTimeout: 7110,
      mouseDrag: !0,
      speed: 1e3,
      prevButton: ".slider__button-prev",
      nextButton: ".slider__button-next",
      autoplayButtonOutput: false,
      responsive: {
        1200: {
          center: !0,
          edgePadding: 125,
        },
      },
      onInit: document
        .querySelector(".wellcome__slider")
        .classList.remove("slider_init"),
    });
  }

  if ($(".slider-new").length) {
    tns({
      container: ".slider-new",
      controlsContainer: ".slider__button_container",
      prev: ".slider__button-prev",
      next: ".slider__button-next",
      pagination: ".slider__pagination",
      items: 1,
      autoplay: !0,
      autoplay: !1,
      autoplayButtonOutput: !1,
      autoplayTimeout: 3e3,
      mouseDrag: !0,
      speed: 1e3,
      nav: !0,
      navPosition: "bottom",
      controls: !0,
      prevButton: ".slider__button-prev",
      nextButton: ".slider__button-next",
      responsive: {},
    });
  }

  if ($(".expert__slider").length) {
    tns({
      container: ".container-elements",
      controlsContainer: ".slider__button_container",
      prev: ".slider__button-prev",
      next: ".slider__button-next",
      pagination: ".slider__pagination",
      items: 1,
      autoplay: !0,
      autoplay: !1,
      autoplayButtonOutput: !1,
      autoplayTimeout: 3e3,
      mouseDrag: !0,
      speed: 1e3,
      nav: !0,
      mode: "gallery",
      navPosition: "bottom",
      controls: !0,
      prevButton: ".slider__button-prev",
      nextButton: ".slider__button-next",
      responsive: {},
    });
  }

  if ($(".tags__main_v2_slider").length) {
    tns({
      container: ".tags__main_v2_slider-container",
      controlsContainer: ".slider__button_container",
      prev: ".slider__button-prev",
      next: ".slider__button-next",
      nav: false,
      items: 8,
      autoplay: !0,
      autoplay: !1,
      autoplayButtonOutput: !1,
      autoplayTimeout: 3e3,
      mouseDrag: !0,
      speed: 1e3,
      nav: false,
      controls: !0,
      prevButton: ".slider__button-prev",
      nextButton: ".slider__button-next",
      responsive: {},
    });
  }

  if ($(".expert__slider-container").length) {
    tns({
      container: ".expert__slider-container ",
      items: 1,
      pagination: ".slider__pagination",
      autoplay: !0,
      autoplay: !1,
      autoplayButtonOutput: !1,
      autoplayTimeout: 3e3,
      mouseDrag: !0,
      speed: 1e3,
      nav: !1,
      navPosition: "bottom",
      center: !1,
      edgePadding: 0,
      prevButton: ".expert__slider-nav .prev",
      nextButton: ".expert__slider-nav .next",
    });
  }

  var select_actual_products = false;
  // Кнопки «Подобрать» / «Оформить» без реф. ссылки — на странице оффера и на страницах со списком офферов (архив, коллекции, таксономии)
  $(document).off("click", ".apply_now_btm, .apply_now_btm *").on("click", ".apply_now_btm, .apply_now_btm *", function (e) {
    if ($(e.target).closest('.link-data').length || $(e.target).hasClass('link-data')) {
      return true;
    }
    // Do not hijack referral/external links accidentally marked with apply_now_btm.
    var $actionEl = $(e.target).closest('a, span, button, .apply_now_btm');
    var href = ($actionEl.attr('href') || '').trim();
    var dataLink = ($actionEl.attr('data-link') || '').trim();
    if (dataLink !== '' || (href !== '' && href !== '#')) {
      return true;
    }
    
    var $btn = $(this);
    var $container = $btn.closest('.apply_now_btm');
    var hasApplyNowId = $container.attr("data-popap-apply-id") || $btn.attr("data-popap-apply-id");
    
    if (!hasApplyNowId) {
      return true;
    }
    
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    var $card = $btn.closest('.card');
    var isArchiveCard = $card.length && $card.hasClass('archive__card');
    var hasArchivePopupTemplate = $('.unified_popup_wrap[data-popup-type="archive"]').length > 0;
    // Priority:
    // 1) archive cards in listings
    // 2) archive single pages (where archive popup template is rendered)
    // 3) regular non-referral flow
    var popupType = (isArchiveCard || hasArchivePopupTemplate) ? 'archive' : 'non_referral';
    
    var offerTitle = ($card.length ? (
                     $card.find('.item-info a.font-weight-semibold').first().text().trim() ||
                     $card.find('.item-info a').first().text().trim() ||
                     $card.find('.item-title').first().text().trim() ||
                     $card.find('.item-about .font-weight-semibold').first().text().trim() ||
                     $card.find('.card__header-title a').first().text().trim() ||
                     $card.find('.card__header-title').first().text().trim()
                     ) : null) ||
                     $btn.closest('article').find('h1').text().trim() ||
                     $btn.closest('.single').find('h1').text().trim() ||
                     $('h1').first().text().trim() ||
                     document.title.split(' - ')[0].trim() ||
                     'это предложение';
    
    var is_check_popap = (typeof window.check_popap !== 'undefined') ? window.check_popap() : (typeof check_popap !== 'undefined' ? check_popap() : true);
    if (is_check_popap && typeof window.showUnifiedPopup !== 'undefined') {
      window.showUnifiedPopup(popupType, offerTitle);
    }
    if (typeof ym !== 'undefined') {
      ym(35020350, "reachGoal", popupType === 'archive' ? "archive_popup_open" : "NOREF_POPUP_open");
    }
    
    return false;
  });

  // Показать 1 раз
  function help_become_better_popup(class_name) {
    var help_become_better_popup = window.localStorage.getItem(
      "help_become_better_popup"
    );

    console.log("from session value: " + help_become_better_popup);

    var is_check_popap = (typeof window.check_popap !== 'undefined') ? window.check_popap() : (typeof check_popap !== 'undefined' ? check_popap() : true);
    if (help_become_better_popup != "Y" && is_check_popap) {
      $(".popup__form-help-become-better").fadeIn("fast");
      $(".popup__form-help-become-better").attr("data-show", "Y");
      window.localStorage.setItem("help_become_better_popup", "Y");
    }
  }

  // Make check_popap globally accessible
  // Also ensure select_actual_products is accessible
  if (typeof window.select_actual_products === 'undefined') {
    window.select_actual_products = false;
  }
  
  window.check_popap = function() {
    var have_active_popap = false;
    var parent = $(".check_popap").parent();

    parent.find($(".check_popap")).each(function () {
      if ($(this).attr("data-show") == "Y") {
        have_active_popap = true;
      }
    });

    // если нету активных попапов, то должно возращать true
    var selectProducts = typeof window.select_actual_products !== 'undefined' ? window.select_actual_products : (typeof select_actual_products !== 'undefined' ? select_actual_products : false);
    if (have_active_popap == false && selectProducts == false) {
      return true;
    } else {
      return false;
    }
  };
  
  // Also keep local reference for backward compatibility
  var check_popap = window.check_popap;
  function getExitPopupShownFlag() {
    return window.sessionStorage.getItem("exit_popup");
  }

  function setExitPopupShownFlag() {
    window.sessionStorage.setItem("exit_popup", "1");
  }

  function clearExitPopupShownFlag() {
    window.sessionStorage.removeItem("exit_popup");
  }

  //Функция вызова контрольного варианта
  function vq_call_block_a() {
    console.log("Эксперемент №1");
    var test = 0;

    if (isMobileBrowser() == false) {
      // Функция для показа поп-апа
      function showExitPopupNow() {
        var exit = getExitPopupShownFlag();
        // Проверяем оба варианта: старый (popup_exit_wrap) и новый (unified_popup_wrap с data-popup-type="exit")
        var popupElement = $(".unified_popup_wrap[data-popup-type='exit']");
        if (popupElement.length === 0) {
          popupElement = $(".popup_exit_wrap");
        }
        
        // Показываем поп-ап только если он еще не показывался в этой сессии
        if (exit != "1" && popupElement.length > 0) {
          // Сразу помечаем сессию — один раз за сессию (до показа, чтобы другие обработчики не открыли попап повторно)
          setExitPopupShownFlag();
          
          // Скрываем другие поп-апы
          $(".archive_exit_wrap").fadeOut();
          $(".archive_exit_wrap").attr("data-show", "N");
          $(".out_exit_wrap").fadeOut();
          $(".out_exit_wrap").attr("data-show", "N");
          $(".popup_apply_now").fadeOut();
          $(".popup_apply_now").attr("data-show", "N");
          // Скрываем другие unified popups
          $(".unified_popup_wrap").not(popupElement).fadeOut();
          $(".unified_popup_wrap").not(popupElement).attr("data-show", "N");

          // Убеждаемся, что элемент видим
          // Убираем inline style="display:none", но сохраняем другие стили
          var currentStyle = popupElement.attr("style");
          if (currentStyle) {
            // Удаляем только display:none из style
            var newStyle = currentStyle.replace(/display\s*:\s*none\s*;?/gi, '');
            popupElement.attr("style", newStyle);
          }
          
          ym(35020350, "reachGoal", "exit_popup_open");
          // Используем show() и fadeIn для более надежного отображения
          popupElement.show();
          popupElement.fadeIn("fast");
          popupElement.attr("data-show", "Y");
          
          // Дополнительно убеждаемся, что элемент видим
          setTimeout(function() {
            if (!popupElement.is(":visible")) {
              popupElement.css("display", "block");
              popupElement.css("visibility", "visible");
              popupElement.css("opacity", "1");
            }
          }, 100);

          // Для обратной совместимости проверяем старый data-popap
          var popap_name = popupElement.data("popap");
          if (!popap_name) {
            // Если нет старого атрибута, используем data-popup-type
            var popup_type = popupElement.data("popup-type");
            if (popup_type === "exit") {
              popap_name = "popap_best_offers"; // По умолчанию для exit popup
            }
          }
          
          if (popap_name == "popap_best_offers") {
            ym(35020350, "reachGoal", "1EX_POPUP_open");
          } else if (popap_name == "popap_witch_tag") {
            ym(35020350, "reachGoal", "2EX_POPUP_open");
          }
          
          // Дополнительная проверка через небольшую задержку
          setTimeout(function() {
            var isVisible = popupElement.is(":visible");
            var display = popupElement.css("display");
            if (!isVisible || display === "none") {
              popupElement.css("display", "block");
              popupElement.css("visibility", "visible");
              popupElement.css("opacity", "1");
            }
          }, 200);
          
          return true;
        }
        return false;
      }

      // Обработчик для выхода курсором вверх (mouseleave) - оригинальная логика
      $(document).mouseleave(function (e) {
        if (e.clientY < 10) {
          showExitPopupNow();
        }
      });

      // Отслеживание движения мыши к верхней части экрана (к адресной строке)
      // Показываем поп-ап заранее, когда пользователь двигает мышь к адресной строке (один раз за сессию)
      var mouseAtTopTimer = null;
      $(document).on('mousemove', function(e) {
        var exit = getExitPopupShownFlag();
        if (exit === "1") {
          if (mouseAtTopTimer) {
            clearTimeout(mouseAtTopTimer);
            mouseAtTopTimer = null;
          }
          return;
        }
        // Если курсор в верхней части экрана (около адресной строки)
        if (e.clientY < 50) {
          if (mouseAtTopTimer) {
            clearTimeout(mouseAtTopTimer);
          }
          mouseAtTopTimer = setTimeout(function() {
            mouseAtTopTimer = null;
            showExitPopupNow();
          }, 300);
        } else {
          if (mouseAtTopTimer) {
            clearTimeout(mouseAtTopTimer);
            mouseAtTopTimer = null;
          }
        }
      });
    }
  }
  //Функция вызова Варианта 1
  function vq_call_block_b() {
    console.log("Эксперемент №2");
  }
  //Функция вызова дефолтного варианта
  function vq_call_block_default() {
    console.log("Эксперимент завершен или не запущен на данной странице");
  }
  //Функция применения флагов
  function render_ab_answer(flags) {
    const flagVal = flags && flags.popap_show && flags.popap_show[0];
    switch (flagVal) {
      case "Y":
        vq_call_block_a();
        ym(35020350, "getClientID", function (clientID) {
          var client = clientID;
        });

        break;
      case "N":
        vq_call_block_b();
        ym(35020350, "getClientID", function (clientID) {
          var client = clientID;
        });
        break;
      default:
        vq_call_block_default();
        vq_call_block_a();
        break;
    }
  }

  render_ab_answer("Y");
  $(document).click(function (e) {
    // Проверяем оба варианта: старый (popup_exit_wrap) и новый (unified_popup_wrap)
    var exitPopup = $(".unified_popup_wrap[data-popup-type='exit']");
    if (exitPopup.length === 0) {
      exitPopup = $(".popup_exit_wrap");
    }
    
    if (
      exitPopup.is(":visible") &&
      !$(e.target).closest(".popup_exit_body, .unified_popup_wrap .popup_exit_body").length
    ) {
      var popap_name = exitPopup.data("popap");
      if (!popap_name) {
        var popup_type = exitPopup.data("popup-type");
        if (popup_type === "exit") {
          popap_name = "popap_best_offers";
        }
      }
      
      if (popap_name == "popap_best_offers") {
        ym(35020350, "reachGoal", "1EX_POPUP_WRAPPER");
      } else if (popap_name == "popap_witch_tag") {
        ym(35020350, "reachGoal", "2EX_POPUP_WRAPPER");
      }
      exitPopup.remove();
    }
  });

  $(".exit_btn, .unified_popup_more_btn").click(function () {
    var exitPopup = $(".unified_popup_wrap[data-popup-type='exit']");
    if (exitPopup.length === 0) {
      exitPopup = $(".popup_exit_wrap");
    }
    exitPopup.remove();
    return true;
  });

  // функция возвращает cookie с именем name, если есть, если нет, то undefined
  function getCookie(name) {
    var matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
});

// Проверяем, является ли браузер мобильным
function isMobileBrowser() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 400 ||
    document.documentElement.scrollTop > 400
  ) {
    if (document.getElementById("myBtn") != null) {
      document.getElementById("myBtn").style.display = "block";
      document.getElementById("popup_compare").style.bottom = "130px";
    }
  } else {
    if (document.getElementById("myBtn") != null) {
      document.getElementById("myBtn").style.display = "none";
      document.getElementById("popup_compare").style.bottom = "60px";
    }
  }
}

jQuery(document).ready(function ($) {
  $("#myBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  if (document.querySelector("#pageNav")) {
    $(function () {
      $("a[href*=#]:not([href=#])").click(function () {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var t = $(this.hash);
          if (
            ((t = t.length ? t : $("[name=" + this.hash.slice(1) + "]")),
            t.length)
          )
            return (
              $("html,body").animate({ scrollTop: t.offset().top - 100 }, 500),
              !1
            );
        }
      });
    });
  } else {
    $(function () {
      $("a[href*=#]:not([href=#])").click(function () {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var t = $(this.hash);
          if (
            ((t = t.length ? t : $("[name=" + this.hash.slice(1) + "]")),
            t.length)
          )
            return (
              $("html,body").animate({ scrollTop: t.offset().top - 50 }, 500),
              !1
            );
        }
      });
    });
  }
});

// Lightbox для dual-gallery: только видимая галерея (ПК или мобильная), счётчик корректный
function setupDualGalleryLightbox() {
  const isMobile = window.innerWidth < 768;
  document.querySelectorAll(".dual-gallery-container").forEach((container) => {
    const containerId = container.id || "dg-" + Math.random().toString(36).slice(2);
    const galleryId = "dual-gallery-" + containerId;
    const $desktop = container.querySelector(".dual-gallery-desktop");
    const $mobile = container.querySelector(".dual-gallery-mobile");
    const visibleGallery = isMobile ? $mobile : $desktop;
    if (!visibleGallery) return;

    // Убираем data-fslightbox у всех изображений в контейнере (и desktop, и mobile)
    container.querySelectorAll("a[data-fslightbox^='dual-gallery-']").forEach((a) => {
      const img = a.querySelector("img");
      if (img) {
        a.parentNode.insertBefore(img, a);
        a.remove();
      }
    });

    // Добавляем lightbox только для оригинальных изображений (без slick-cloned — Slick дублирует слайды для infinite)
    const images = Array.from(visibleGallery.querySelectorAll("img")).filter(function (img) {
      return !img.closest(".slick-cloned");
    });
    images.forEach((n) => {
      const imgHref = n.getAttribute("data-src") || n.getAttribute("src");
      const figure = n.closest("figure");
      const figcaption = figure ? figure.querySelector("figcaption") : null;
      const caption = (figcaption && figcaption.textContent.trim()) ? figcaption.textContent : (n.getAttribute("alt") || "");
      let link = n.parentNode && n.parentNode.tagName === "A" ? n.parentNode : null;
      if (link && link.getAttribute("href") && link.getAttribute("href").match(/\.(webp|png|jpg|jpeg|gif|svg)(\?|$)/i)) {
        // Уже одна ссылка на файл (link=file) — используем её, не создаём вторую
        link.setAttribute("href", imgHref);
        link.setAttribute("data-fslightbox", galleryId);
        link.setAttribute("data-type", "image");
        link.setAttribute("data-caption", caption);
      } else {
        // Старая разметка (ссылка на страницу) — убираем её и создаём одну ссылку на изображение
        if (link) {
          link.parentNode.insertBefore(n, link);
          link.remove();
        }
        link = document.createElement("a");
        link.setAttribute("data-fslightbox", galleryId);
        link.setAttribute("data-type", "image");
        link.setAttribute("href", imgHref);
        link.setAttribute("data-caption", caption);
        n.parentNode.appendChild(link);
        link.appendChild(n);
      }
    });
  });
  if (typeof refreshFsLightbox === "function") refreshFsLightbox();
}

window.onload = function () {
  setTimeout(function () {
    // Старые галереи: группируем по каждой галерее отдельно, чтобы счётчик был корректным (1/N внутри одной галереи)
    document.querySelectorAll(".gallery, .wp-block-gallery").forEach((galleryEl, idx) => {
      if (galleryEl.closest(".dual-gallery-container")) return; // dual-gallery обрабатываем отдельно
      const groupId = `gallery-${galleryEl.id || idx}`;

      Array.from(galleryEl.querySelectorAll("img"))
        .filter((img) => !img.closest(".slick-cloned")) // если slick дублирует слайды
        .forEach((n) => {
          const imgHref = n.getAttribute("data-src") || n.getAttribute("src");

          // Получаем текст из figcaption, если он есть, иначе alt
          const figure = n.closest("figure");
          const figcaption = figure ? figure.querySelector("figcaption") : null;
          const captionText =
            (figcaption && figcaption.textContent.trim() !== "")
              ? figcaption.textContent
              : (n.getAttribute("alt") || "");

          // Если картинка уже внутри <a>, не создаём второй <a> (иначе получится вложенная ссылка)
          let link = n.parentNode && n.parentNode.tagName === "A" ? n.parentNode : null;

          if (link) {
            // Переиспользуем существующую ссылку без перестройки DOM (меньше шансов на "скачок")
            link.setAttribute("href", imgHref);
            link.setAttribute("data-fslightbox", groupId);
            link.setAttribute("data-type", "image");
            link.setAttribute("data-caption", captionText);
          } else {
            // Если ссылки нет — создаём одну ссылку на файл
            link = document.createElement("a");
            link.setAttribute("href", imgHref);
            link.setAttribute("data-fslightbox", groupId);
            link.setAttribute("data-type", "image");
            link.setAttribute("data-caption", captionText);
            n.parentNode.appendChild(link);
            link.appendChild(n);
          }
        });
    });

    // Одиночные figure img (вне галерей) — оставляем общей группой
    document.querySelectorAll("figure img").forEach((n) => {
      if (n.closest(".dual-gallery-container")) return;
      if (n.closest(".gallery, .wp-block-gallery")) return;
      if (n.closest(".slick-cloned")) return;

      const imgHref = n.getAttribute("data-src") || n.getAttribute("src");
      const figure = n.closest("figure");
      const figcaption = figure ? figure.querySelector("figcaption") : null;
      const captionText =
        (figcaption && figcaption.textContent.trim() !== "")
          ? figcaption.textContent
          : (n.getAttribute("alt") || "");
      let link = n.parentNode && n.parentNode.tagName === "A" ? n.parentNode : null;
      if (link) {
        link.setAttribute("href", imgHref);
        link.setAttribute("data-fslightbox", "gallery");
        link.setAttribute("data-type", "image");
        link.setAttribute("data-caption", captionText);
      } else {
        link = document.createElement("a");
        link.setAttribute("href", imgHref);
        link.setAttribute("data-fslightbox", "gallery");
        link.setAttribute("data-type", "image");
        link.setAttribute("data-caption", captionText);
        n.parentNode.appendChild(link);
        link.appendChild(n);
      }
    });

    setupDualGalleryLightbox();
  }, 300);

  document.querySelectorAll("img.bigpic").forEach((n) => {
    const link = document.createElement("a");
    link.setAttribute("data-fslightbox", "gallery");
    link.setAttribute("data-type", "image");

    link.setAttribute("href", n.getAttribute("src"));

    // Для bigpic пробуем тоже получить текст из figcaption, иначе title
    let captionText = "";
    const figure = n.closest("figure");
    if (figure) {
      const figcaption = figure.querySelector("figcaption");
      if (figcaption && figcaption.textContent.trim() !== "") {
        captionText = figcaption.textContent;
      } else {
        captionText = n.getAttribute("title");
      }
    } else {
      captionText = n.getAttribute("title");
    }
    link.setAttribute("data-caption", captionText);

    n.parentNode.append(link);
    link.append(n);
  });

  setTimeout(function () {
    const lightbox = new FsLightbox();
    refreshFsLightbox();
  }, 500);

  // При изменении размера окна переключаем lightbox dual-gallery (ПК ↔ мобильная)
  var lightboxResizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(lightboxResizeTimer);
    lightboxResizeTimer = setTimeout(function () {
      setupDualGalleryLightbox();
    }, 300);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const btnShow5 = (selector, hiddenTrClass) => {
    const btn = document.querySelectorAll(selector);

    btn.forEach((item) => {
      const target = document.getElementById(item.dataset.target);
      const arrTr = target.querySelectorAll(".code3text");
      let hiddenTr = [];
      let textShowHide = false;

      // create array of hidden elements
      arrTr.forEach((tr) => {
        if (tr.classList.contains(hiddenTrClass)) {
          hiddenTr.push(tr);
        }
      });

      item.addEventListener("click", (e) => {
        e.preventDefault();
        // toggle text onClick
        item.lastChild.previousSibling.innerText = textShowHide
          ? item.dataset.textOpen
          : item.dataset.textHide;
        textShowHide = !textShowHide;
        // toggle visible elements
        if (hiddenTr.length > 0) {
          hiddenTr.forEach((tr) => {
            tr.classList.toggle(hiddenTrClass);
          });
        }
      });
    });
  };

  btnShow5(".btn__details", "div__hidden");
});

var wt_gt_domain = "";
var wt_gt_protocol = "https";
var list_tag = "ul";
var column_class = "col-12 col-sm-6 col-md-3";
var type_select_location = "java_script";
jQuery(function ($) {
  $(document).on("click", ".popup_image_close", function () {
    $(".popup_image_wrap").fadeOut();
  });

  $(document).on("click", ".tabs-table .mobile div", function () {
    var parent = $(this).closest(".tabs-table");
    var data_class_item = $(this).attr("data-class-item");

    var all_items = parent.find(".item");

    all_items.each(function (i) {
      $(this).removeClass("show");
    });

    var need_item = parent.find("." + data_class_item);
    need_item.each(function (i) {
      $(this).addClass("show");
    });

    $(parent).find(".mobile div").removeClass("active");
    $(this).addClass("active");
  });

  $(document).on("click", ".tab-item", function () {
    var parent = $(this).parent().parent();

    var tabId = $(this).attr("data-tab");
    // Ищем контент вкладки только внутри текущего модального окна (при нескольких карточках на странице)
    var content = parent.find("#" + tabId);

    // Удаляем активный класс у текущих вкладок и контента
    if (parent.find(".tab-item.active").length) {
      parent.find(".tab-item.active").removeClass("active");
    }
    if (parent.find(".tab-pane.active").length) {
      parent.find(".tab-pane.active").removeClass("active");
    }

    // Добавляем активный класс для выбранной вкладки и контента
    $(this).addClass("active");
    content.addClass("active");
  });

  $("[data-fancybox]").click(function (e) {
    e.preventDefault();
    const src = $(this).attr("href");
    $(".popup_image_body").html('<img src="' + src + '" style="width:100%" />');
    $(".popup_image_wrap").fadeIn();
  });

  let citiesContainer = $("#all-cities");
  let citiesLoaded = false;

  $("#btn__region").click(function () {
    if (citiesLoaded) {
      return;
    }

    citiesLoaded = true;

    $.ajax({
      url: "/wp-admin/admin-ajax.php?action=get_cities",
      method: "get",
      cache: true,
      dataType: "json",
      success: function (cities) {
        let columns = [];
        for (let i = 0; i < 4; i++) {
          let div = document.createElement("div");
          div.classList.add("col-12", "col-sm-6", "col-md-3");
          let ul = document.createElement("ul");
          div.appendChild(ul);
          citiesContainer.get(0).appendChild(div);

          columns.push(ul);
        }

        let countInColumn = Math.ceil(Object.keys(cities).length / 4);
        let i = 0;
        for (let k in cities) {
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.classList.add("location_child");
          a.onclick = function () {
            WtLocation.setValue(cities[k], "city", "reload");
          };
          a.innerHTML = cities[k];

          li.appendChild(a);
          columns[Math.floor(i / countInColumn)].appendChild(li);
          i++;
        }
      },
    });
  });

  if (!isMobileBrowser()) {
    $(document).on("mouseover", ".navigation__item", function () {
      $(".navigation__item").each(function (i) {
        $(this).find(".navigation__item-sub").removeClass("show_menu_items");
      });
      $(this).find(".navigation__item-sub").toggleClass("show_menu_items");
    });

    $(document).on("mouseleave", ".show_menu_items", function () {
      $(this).removeClass("show_menu_items");
    });
  }

  $(".js-phone").inputmask("+7(999)999-99-99");

  // change icon for pc ЗАМЕНА ИКОНКИ СВГ CVG и TITLE
  if ($(".breadcrumb-item").length) {
    // это может быт детальная страница
    var bread_name = $($(".breadcrumb-item")[1]).find("a").text();

    // если пусто, то берем без тега "а"
    if (bread_name == "") {
      bread_name = $($(".breadcrumb-item")[1]).text();
    }

    var title_old = $("title").text();
    var svg_old = $('link[rel="icon"], link[rel="shortcut icon"]').attr("href");

    var new_title = "";

    switch (bread_name) {
      case "Кредиты":
        new_title = "Не забудьте оформить кредит!";
        break;
      case "Займы":
        new_title = "Не забудьте оформить займ!";
        break;
      case "Кредитные карты":
      case "Карты рассрочки":
      case "Дебетовые карты":
        new_title = "Не забудьте оформить карту!";
        break;
      default:
    }

    if (new_title != "") {
      var start_show_new_title;

      // неактивно
      window.onblur = function () {
        start_show_new_title = setInterval(function () {
          if (document.title == new_title) {
            document.title = title_old;
          } else {
            document.title = new_title;
          }
        }, 1000);
        $('link[rel="icon"], link[rel="shortcut icon"]').attr(
          "href",
          "/red_icon.png"
        );
      };
      // активно
      window.onfocus = function () {
        if (start_show_new_title) {
          clearInterval(start_show_new_title);
        }

        document.title = title_old;
        $('link[rel="icon"], link[rel="shortcut icon"]').attr("href", svg_old);
      };
    }
  }

  // вопросы и ответы кастом
  $(document).on("click", ".question-wrapper .quest", function () {
    $(this).toggleClass("collapsed");
    $(this).siblings(".answer-faq").toggle("slow");
  });

  if ($(".use_new_template_v1").length) {
    var view_type = window.localStorage.getItem("view_type");

    if (view_type) {
      if (view_type == "card_list") {
      } else {
        $("#response-cred-card .card").removeClass("card_list");
        $("#response-cred-card .card").removeClass("card_grid");
        $("#response-cred-card .card").addClass(view_type);

        $(".template_view .card_list").removeClass("active");
        $(".template_view .card_grid").addClass("active");
      }
    }
  }

  // comment-reply-link
  // Цитировать функционал
  // Кнопка пожаловаться
  $(".comment__one-answer").click(function () {
    // console.log($(this))
    var this_text = $(this).text();
    var postid = $(this).attr("data-postid");
    var search = $("textarea[post-id='" + postid + "']");
    if (this_text == "Цитировать") {
      var search_text_comment = $(this)
        .parent()
        .parent()
        .find(".comment__one-content")
        .text();
      search.val($.trim(search_text_comment));
    } else {
      // Очищаем
      search.val(" ");
    }
  });

  // Кнопка пожаловаться
  $(document).on("click", ".complain-btn", function () {
    var id = $(this).data("id");

    $.ajax({
      type: "POST",
      url: "/custom-comments-post.php",
      data: {
        complain: 1,
        id: id,
      },
      dataType: "json",
      success: function (res) {
        $(".popup_alert_body").text(res.message);
        $(".popup_alert_wrap").fadeIn();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON.message);
      },
    });

    return false;
  });

  // Сменить шаблон отоброжения плитка и лист
  $(document).on("click", ".js_change_view_template", function () {
    var view = $(this).data("view");

    $(".js_change_view_template").removeClass("active");
    $(this).addClass("active");
    window.localStorage.setItem("view_type", view);
    $("#response-cred-card .card").removeClass("card_list");
    $("#response-cred-card .card").removeClass("card_grid");
    $("#response-cred-card .card").addClass(view);

    $.ajax({
      type: "POST",
      url: "/ajax-settings-session.php",
      data: {
        view_type: view,
      },
      dataType: "json",
      success: function (res) {
        console.log(res);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  function clear_form__filter_v1() {
    if ($(".filter_v1").length) {
      $(".filter_v1")[0].reset();
      $(".filter_v1 .range__input").css("--range-progress", "0%");
      $(".filter_v1 .styledSelect option").val("");
      $(".filter_v1 .choices__list--single .choices__item--selectable").text(
        "Любой"
      );

      $(".filter_v1 .range__value").attr("value", 0);
      $(".filter_v1 .range__input").attr("value", 0);

      let range_items = document.querySelectorAll('input[type="range"]');

      range_items.forEach((elem) => {
        elem.value = 0;
      });
    }
  }

  clear_form__filter_v1();

  $(document).on("click", ".clear_form__filter_v1", function () {
    clear_form__filter_v1();
  });

  $(document).on("click", ".show__detail_popup", function () {
    var $this = $(this);
    var id = $(this).attr("data-id");
    var was_loaded = $(this).attr("data-was_loaded");
    var popup = $this.siblings(".popup");

    if (!was_loaded) {
      $.ajax({
        url: "/wp-admin/admin-ajax.php", // AJAX handler
        data: {
          action: "get_more_details", // the parameter for admin-ajax.php
          id: id,
        },
        type: "POST",
        dataType: "json",
        success: function (res) {
          // После Ajax получения делаем
          $this.attr("data-was_loaded", "1");
          popup.find(".detail_popup").html(res.content);
          popup.show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
      });
    } else {
      popup.show();
    }
  });

  $(document).on("click", ".open__dop-btn", function (event) {
    event.stopPropagation(); // Останавливаем всплытие, чтобы document click не закрыл сразу

    var $this = $(this);
    var id = $this.attr("data-id");
    var tabsTarget = $this.attr("data-tabs-target");
    var parent = $this.closest(".tabs-and-btns");
    var btnText = parent.find(".open__dop-btn-text");
    var tabs = tabsTarget ? $("#" + tabsTarget) : parent.parent().find(".tabs");
    var have_content_more_detail =
      tabs.attr("data-loaded") === "1" || tabs.children().length > 0;

    // Проверяем, открыто ли уже это окно
    var isVisible = tabs.is(":visible");

    // Закрываем все открытые окна перед открытием нового
    $(".tabs").hide();
    $(".open__dop-btn").removeClass("active");

    if (!isVisible) {
      // Если текущее окно не было открыто, то открываем
      if (!have_content_more_detail) {
        $.ajax({
          url: "/wp-admin/admin-ajax.php",
          data: {
            action: "get_more_details",
            id: id,
          },
          type: "POST",
          dataType: "json",
          success: function (res) {
            console.log(res);
            $(tabs).html(res.content);
            $(tabs).attr("data-loaded", "1");
            $(tabs).show();
            $this.addClass("active"); // Добавляем класс активной кнопке
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
          },
        });
      } else {
        $(tabs).show();
        $this.addClass("active");
      }
    }
  });

  // Закрытие при клике вне области .tabs или .open__dop-btn
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".new-tab-content, .open__dop-btn").length) {
      $(".tabs").hide(); // Закрываем все вкладки
      $(".open__dop-btn").removeClass("active"); // Сбрасываем активные кнопки
    }
  });

  $("#select_item_otziv").on("change", function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    console.log(valueSelected);
    $(".form_otziv #comment_post_ID").val(valueSelected);
  });

  // Закоментил, т.к где то  есть готовый функционал открытия и закрытия.
  $(document).on("click", ".accordion__header", function () {
    // $(this).hide();
    // $(this).siblings('.accordion__collapse').toggleClass('show');
    // $(this).siblings('.accordion__collapse').toggle('show');
  });

  $(document).on("click", ".show__popup_filter_wrap", function () {
    $(".popup_filter_wrap").show();
  });

  $(document).on("click", ".show__popup_calc_wrap", function () {
    // $(this).hide();
    $(".popup_calc_wrap").show();
  });

  $(document).on("click", ".show__custom_form_v1", function () {
    $(this).hide();
    $(".custom_form_v1").show();
  });

  $(document).on("click", ".show__custom_form_v2", function () {
    $(this).hide();
    $(".custom_form_v2").show();
  });

  $(document).on("click", ".page__heading-description---open", function () {
    $(".page__heading-description").toggleClass("active");
    if ($(this).text() == "Свернуть") {
      $(this).text("Развернуть");
    } else {
      $(this).text("Свернуть");
    }
  });

  // show__siblilings__filter__btn

  $(document).on("click", ".show__siblilings__filter__btn", function () {
    $(this).siblings(".dop-box").show(200);
    $(this).hide();

    return false;
  });

  // Чтоб не переписывать функционал, решил из калькулятора получить поля, и отправить их в
  // фильтр, но они немного различаются
  $(document).on("click", ".popup_calc_wrap .submit-button", function () {
    // в любом случае получаем переменные name="range1" name="range2"
    let calc_sum = $('input[name="range1"]').val();
    let calc_time = $('input[name="range2"]').val();

    let sum, time;

    // для займа
    if ($('input[name="z_sum"]').length) {
      sum = $('input[name="z_sum"]');
      time = $('input[name="z_time"]');
    }

    // для кредит
    if ($('input[name="summ_limit"]').length) {
      sum = $('input[name="summ_limit"]');
      time = $('input[name="cred_summ_period"]');
    }

    // кредитные карты cred_limit
    if ($('input[name="cred_limit"]').length) {
      sum = $('input[name="cred_limit"]');
      time = $('input[name="cred_day_period"]');
    }

    sum.val(calc_sum);
    time.val(calc_time);

    $(".filter_v1 .submit-button").click();
  });

  // ============================================
  // UNIFIED POPUP HANDLING
  // ============================================

  // Get best offers URL based on current page category
  function getBestOffersUrl(popupType) {
    // For gift popup, always use zaimy
    if (popupType === 'gift') {
      return window.location.origin + '/best-zaimy/';
    }
    
    var url = window.location.href;
    if (url.indexOf('/best-') > -1) {
      // Already on best offers page, extract category
      var match = url.match(/best-([^\/]+)/);
      if (match) {
        return url;
      }
    }
    
    // Try to determine category from page
    var category = 'zaimy'; // default changed to zaimy
    if (url.indexOf('/zaimy/') > -1 || url.indexOf('/zaimy-') > -1) {
      category = 'zaimy';
    } else if (url.indexOf('/kredity/') > -1 || url.indexOf('/kredity-') > -1) {
      category = 'kredity';
    } else if (url.indexOf('/debetcard/') > -1 || url.indexOf('/debetovaja-') > -1) {
      category = 'debetcard';
    } else if (url.indexOf('/creditcard/') > -1 || url.indexOf('/kreditnaja-') > -1) {
      category = 'creditcard';
    } else if (url.indexOf('/installmentcard/') > -1) {
      category = 'installmentcard';
    }
    
    return window.location.origin + '/best-' + category + '/';
  }

  // Flag to prevent immediate closing after opening
  var unifiedPopupJustOpened = false;

  // Show unified popup - make it globally accessible
  window.showUnifiedPopup = function(popupType, offerTitle) {
    console.log('showUnifiedPopup called with type:', popupType, 'title:', offerTitle);
    
    // Find the correct unified popup first
    var $popup = $('.unified_popup_wrap[data-popup-type="' + popupType + '"]');
    console.log('Looking for popup type:', popupType, 'Found:', $popup.length);
    
    if (!$popup.length) {
      // Single-popup mode fallback: reuse the only rendered unified popup.
      $popup = $('.unified_popup_wrap').first();
      if ($popup.length) {
        $popup.attr('data-popup-type', popupType);
      } else {
        console.error('Unified popup not found for type:', popupType);
        return;
      }
    }
    
    // Hide all other popups (but not the one we're about to show)
    $(".archive_exit_wrap").not($popup).fadeOut();
    $(".archive_exit_wrap").not($popup).attr("data-show", "N");
    $(".out_exit_wrap").not($popup).fadeOut();
    $(".out_exit_wrap").not($popup).attr("data-show", "N");
    $(".popup_apply_now").not($popup).fadeOut();
    $(".popup_apply_now").not($popup).attr("data-show", "N");
    $(".popup_exit_wrap").not($popup).fadeOut();
    $(".popup_exit_wrap").not($popup).attr("data-show", "N");
    
    // Hide other unified popups
    $('.unified_popup_wrap').not($popup).fadeOut();
    $('.unified_popup_wrap').not($popup).attr("data-show", "N");
    
    if ($popup.length) {
      // Update title based on requested popup type.
      if (offerTitle && (popupType === 'non_referral' || popupType === 'archive')) {
        var title = 'К сожалению, ' + offerTitle + ' недоступен для оформления, но Вы можете выбрать из наших лучших предложений месяца!';
        $popup.find('.unified_popup_title').text(title);
      } else {
        $popup.find('.unified_popup_title').text('Выберите лучшее предложение месяца!');
      }
      
      // Set flag to prevent immediate closing
      unifiedPopupJustOpened = true;
      
      // Hide all other popups first
      $(".popup_exit_wrap, .archive_exit_wrap, .out_exit_wrap, .popup_apply_now").hide();
      
      // Ensure popup is visible - use show() instead of fadeIn for immediate visibility
      $popup.show();
      $popup.css({
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1'
      });
      $popup.attr("data-show", "Y");
      
      console.log('Unified popup shown:', popupType);
      console.log('Popup element:', $popup[0]);
      console.log('Popup display:', $popup.css('display'));
      console.log('Popup visibility:', $popup.css('visibility'));
      console.log('Popup z-index:', $popup.css('z-index'));
      console.log('Popup opacity:', $popup.css('opacity'));
      
      // Force repaint
      if ($popup[0]) {
        $popup[0].offsetHeight;
      }
      
      // Double check popup is visible after a short delay
      setTimeout(function() {
        if ($popup.css('display') === 'none') {
          console.warn('Popup was hidden, showing again');
          $popup.show();
          $popup.css('display', 'block');
        }
        unifiedPopupJustOpened = false;
      }, 100);
      
      // Reset flag after a longer delay
      setTimeout(function() {
        unifiedPopupJustOpened = false;
      }, 1000);
      
      // Track in analytics
      if (typeof ym !== 'undefined') {
        if (popupType === 'exit') {
          ym(35020350, "reachGoal", "exit_popup_open");
        } else if (popupType === 'archive') {
          ym(35020350, "reachGoal", "archive_popup_open");
        } else if (popupType === 'non_referral') {
          ym(35020350, "reachGoal", "NOREF_POPUP_open");
        } else if (popupType === 'gift') {
          ym(35020350, "reachGoal", "PRESENT_POPUP_open");
        }
      }
    } else {
      console.error('Unified popup not found for type:', popupType);
      // Fallback: if popup not found, try to open best-zaimy directly
      if (popupType === 'gift') {
        window.open(window.location.origin + '/best-zaimy/', '_blank');
      }
    }
  };

  // Handle popup close (X button or click outside)
  $(document).on("click", ".unified_popup_close", function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't close if popup just opened
    if (unifiedPopupJustOpened) {
      return false;
    }
    
    var $popup = $(this).closest('.unified_popup_wrap');
    var popupType = $popup.attr('data-popup-type');
    
    // Exit popup X should only close popup
    if (popupType === 'exit') {
      $popup.fadeOut();
      $popup.attr("data-show", "N");
      return false;
    }
    
    // Get current page URL without popup parameter
    var currentUrl = window.location.href.split('?')[0];
    if (currentUrl.indexOf('#') > -1) {
      currentUrl = currentUrl.split('#')[0];
    }
    var urlWithoutPopup = currentUrl + (currentUrl.indexOf('?') > -1 ? '&' : '?') + 'no_popup=1';
    
    // Get best offers URL
    var bestOffersUrl = getBestOffersUrl(popupType);
    
    // FIRST: Open best offers in new window (user will see this)
    // This must happen while user interaction is still active
    // Otherwise browser will block it as a popup
    window.open(bestOffersUrl, '_blank');
    
    // THEN: Redirect current window to same page without popup
    // User stays on current page, but it reloads without popup
    window.location.href = urlWithoutPopup;
    
    return false;
  });

  // Handle click outside popup (on overlay)
  $(document).on("click", ".unified_popup_wrap", function (e) {
    // Don't close if popup just opened
    if (unifiedPopupJustOpened) {
      return;
    }
    
    // Only close if clicking directly on the overlay, not on child elements
    if ($(e.target).hasClass('unified_popup_wrap') || $(e.target).is('.unified_popup_wrap')) {
      var $popup = $(this);
      var popupType = $popup.attr('data-popup-type');
      
      // Exit popup overlay click should only close popup
      if (popupType === 'exit') {
        $popup.fadeOut();
        $popup.attr("data-show", "N");
        return;
      }
      
      // Get current page URL without popup parameter
      var currentUrl = window.location.href.split('?')[0];
      if (currentUrl.indexOf('#') > -1) {
        currentUrl = currentUrl.split('#')[0];
      }
      var urlWithoutPopup = currentUrl + (currentUrl.indexOf('?') > -1 ? '&' : '?') + 'no_popup=1';
      
      // Get best offers URL
      var bestOffersUrl = getBestOffersUrl(popupType);
      
      // FIRST: Open best offers in new window (user will see this)
      // This must happen while user interaction is still active
      // Otherwise browser will block it as a popup
      window.open(bestOffersUrl, '_blank');
      
      // THEN: Redirect current window to same page without popup
      // User stays on current page, but it reloads without popup
      window.location.href = urlWithoutPopup;
    }
  });

  // Prevent popup from closing when clicking inside
  $(document).on("click", ".unified_popup_wrap .popup_exit_body, .unified_popup_wrap .popup_exit, .unified_popup_wrap .exit1_offers, .unified_popup_wrap .exit1_offer", function (e) {
    e.stopPropagation();
  });

  // Handle "Больше лучших предложений" button
  $(document).on("click", ".unified_popup_more_btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Больше лучших предложений clicked');
    
    // Get popup type from the popup wrapper
    var $popup = $(this).closest('.unified_popup_wrap');
    var popupType = $popup.length ? $popup.attr('data-popup-type') : null;
    console.log('Popup type:', popupType);
    
    // Also try to get URL from href attribute as fallback
    var href = $(this).attr('href');
    var bestOffersUrl = getBestOffersUrl(popupType);
    
    console.log('Best offers URL:', bestOffersUrl);
    console.log('Href attribute:', href);
    
    // Use href from attribute if available, otherwise use calculated URL
    var targetUrl = href && href !== '#' ? href : bestOffersUrl;
    
    window.open(targetUrl, '_blank');
    
    return false;
  });

  // Exit popup trigger (mouse leave)
  function initExitPopup() {
    if (isMobileBrowser() == false) {
      $(document).off('mouseleave.exitpopup').on('mouseleave.exitpopup', function (e) {
        var exit = getExitPopupShownFlag();
        if (exit === "1") {
          return;
        }
        // Don't trigger exit popup if gift popup is visible
        var $giftPopup = $('.unified_popup_wrap[data-popup-type="gift"]');
        if ($giftPopup.length && $giftPopup.is(':visible')) {
          return;
        }
        // Don't trigger exit popup if any popup is visible
        if ($('.unified_popup_wrap[data-show="Y"]').length > 0) {
          return;
        }
        if (e.clientY < 10) {
          setExitPopupShownFlag();
          if (typeof window.showUnifiedPopup !== 'undefined') {
            window.showUnifiedPopup('exit');
          }
        }
      });
    }
  }

  // Archive popup trigger (10 seconds delay)
  function initArchivePopup() {
    var $archivePopup = $('.unified_popup_wrap[data-popup-type="archive"]');
    if ($archivePopup.length) {
      setTimeout(function() {
        var is_check_popap = (typeof window.check_popap !== 'undefined') ? window.check_popap() : (typeof check_popap !== 'undefined' ? check_popap() : true);
        if (is_check_popap) {
          var offerTitle = $archivePopup.attr('data-offer-title') || '';
          if (typeof window.showUnifiedPopup !== 'undefined') {
            window.showUnifiedPopup('archive', offerTitle);
          }
        } else {
          setTimeout(initArchivePopup, 10000);
        }
      }, 10000);
    }
  }

  // Non-referral popup trigger (on button click)
  // Remove old handler first to prevent conflicts
  $(document).off("click", ".out_exit_link").on("click", ".out_exit_link", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    console.log('out_exit_link clicked');
    
    // Get offer title - try multiple selectors
    var $btn = $(this);
    var offerTitle = $btn.closest('article').find('h1').text() || 
                     $btn.closest('.single').find('h1').text() || 
                     $('h1').first().text() ||
                     document.title.split(' - ')[0] || 
                     'это предложение';
    
    console.log('Offer title:', offerTitle);
    console.log('Showing unified popup non_referral');
    
    showUnifiedPopup('non_referral', offerTitle);
    
    return false;
  });

  // Gift popup trigger (on present icon click)
  // Shows old present-content popup when clicking on gift icon
  $(document).off('click', '.present-icon').on('click', '.present-icon', function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    if (typeof ym !== 'undefined') {
      ym(35020350, "reachGoal", "PRESENT_CLICK");
    }
    
    // Show old present-content popup (toggle)
    $(".present-content").fadeToggle();
    $(".present-icon-present").fadeToggle("fast");
    $(".present-icon-close").fadeToggle("fast");
    
    // Hide all unified popups when showing present-content
    $('.unified_popup_wrap').fadeOut();
    $('.unified_popup_wrap').attr("data-show", "N");
    
    return false;
  });

  // Handle "Посмотреть" button in present popup - should open unified popup
  // Remove inline onclick first, then add our handler
  $(document).ready(function() {
    // Remove inline onclick handlers
    $(".present-button a, .present-content a").each(function() {
      var $link = $(this);
      var onclick = $link.attr('onclick');
      if (onclick) {
        // Store original href for fallback
        var originalHref = $link.attr('href');
        $link.data('original-href', originalHref);
        // Remove inline onclick, we handle it in our handler
        $link.removeAttr('onclick');
      }
    });
  });
  
  // Handle click on "Посмотреть" button - should navigate to best-zaimy page
  $(document).on("click", ".present-button a, .present-content a", function (e) {
    console.log('Посмотреть button clicked');
    
    // Track analytics first
    if (typeof ym !== 'undefined') {
      ym(35020350, 'reachGoal', 'PRESENT_CLICK_CTA');
    }
    
    // Get the link from href attribute
    var $link = $(this);
    var href = $link.attr('href');
    
    // Determine best offers URL based on current page category
    // For gift popup, always use zaimy
    var bestOffersUrl = getBestOffersUrl('gift');
    
    // Use href from link if it's a best-* page, otherwise use calculated URL
    var targetUrl = href && href.indexOf('/best-') > -1 ? href : bestOffersUrl;
    
    console.log('Original href:', href);
    console.log('Target URL:', targetUrl);
    
    // Close old present content
    $(".present-content").fadeOut();
    $(".present-icon-present").fadeIn("fast");
    $(".present-icon-close").fadeOut("fast");
    
    // Navigate to best-zaimy in current window
    window.location.href = targetUrl;
    
    return false;
  });

  var hasNoPopupParam = window.location.search.indexOf('no_popup=1') > -1;

  // Don't show popup if no_popup parameter is present
  if (hasNoPopupParam) {
    $('.unified_popup_wrap').hide();
    $('.unified_popup_wrap').attr("data-show", "N");
  }
  
  // Also hide old popups if they exist
  if (hasNoPopupParam) {
    $('.popup_exit_wrap, .archive_exit_wrap, .out_exit_wrap, .popup_apply_now').hide();
  }

  // Initialize popups only when popups are not explicitly disabled by URL parameter.
  if (!hasNoPopupParam) {
    var exitPopupEnabled = typeof unified_popup_settings !== 'undefined' && unified_popup_settings.exit_enabled !== false;
    if (exitPopupEnabled) {
      initExitPopup();
    }

    var archivePopupEnabled = typeof unified_popup_settings !== 'undefined' && unified_popup_settings.archive_enabled !== false;
    if (archivePopupEnabled) {
      initArchivePopup();
    }
  }

  // Переключение табов плюсов и минусов на мобильных
  $(document).on('click', '.plus-minus__tab', function() {
    var $tab = $(this);
    var tabName = $tab.data('tab');
    var $wrapper = $tab.closest('.plus-minus__wrapper');
    
    // Убираем активный класс со всех табов
    $wrapper.find('.plus-minus__tab').removeClass('active');
    // Добавляем активный класс к текущему табу
    $tab.addClass('active');
    
    // Устанавливаем data-атрибут для CSS переключения
    $wrapper.attr('data-active-tab', tabName);
  });
});