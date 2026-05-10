jQuery(document).ready(function ($) {
  // Функции для работы с куками
  function setCookie(name, value, maxAge) {
    document.cookie = name + "=" + value + "; path=/; max-age=" + maxAge;
  }
  function deleteCookie(name) {
    document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // Вспомогательные функции блокировки/разблокировки кнопки
  function disableButton($btn) {
    $btn.prop("disabled", true);
  }
  function enableButton($btn) {
    $btn.prop("disabled", false);
  }

  // Обработчик клика по кнопке "Лайк"
  $(".like-button").on("click", function () {
    var commentId = $(this).data("comment-id");
    var likeButton = $(this);
    var dislikeButton = likeButton.siblings(".dislike-button");

    // Если лайк уже поставлен – отправляем запрос на отмену
    if (likeButton.hasClass("active")) {
      disableButton(likeButton);
      $.ajax({
        url: ajax_object_like_dislike.ajax_url,
        type: "POST",
        data: {
          action: "handle_like_dislike_ajax",
          comment_id: commentId,
          type: "like",
          cancel: true, // флаг отмены действия
          nonce: ajax_object_like_dislike.like_dislike_nonce,
        },
        success: function (response) {
          console.log("Отмена лайка:", response); // для отладки
          if (response.success) {
            // Обновляем счётчик лайков и убираем класс active
            likeButton.find(".like-count").text(response.data.likes);
            likeButton.removeClass("active");
            deleteCookie("liked_comment_" + commentId);
          } else {
            alert(response.data);
          }
          enableButton(likeButton);
        },
        error: function () {
          alert(
            "Произошла ошибка при отмене лайка. Пожалуйста, попробуйте снова."
          );
          enableButton(likeButton);
        },
      });
    } else {
      // Если был дизлайк, сначала отменяем его
      if (dislikeButton.hasClass("active")) {
        disableButton(dislikeButton);
        $.ajax({
          url: ajax_object_like_dislike.ajax_url,
          type: "POST",
          data: {
            action: "handle_like_dislike_ajax",
            comment_id: commentId,
            type: "dislike",
            cancel: true,
            nonce: ajax_object_like_dislike.like_dislike_nonce,
          },
          success: function (response) {
            console.log("Отмена дизлайка перед лайком:", response); // для отладки
            if (response.success) {
              dislikeButton.find(".dislike-count").text(response.data.dislikes);
              dislikeButton.removeClass("active");
              deleteCookie("disliked_comment_" + commentId);
              sendLike(); // После отмены дизлайка ставим лайк
            } else {
              alert(response.data);
              enableButton(dislikeButton);
            }
          },
          error: function () {
            alert(
              "Произошла ошибка при отмене дизлайка. Пожалуйста, попробуйте снова."
            );
            enableButton(dislikeButton);
          },
        });
      } else {
        sendLike();
      }

      // Функция отправки лайка
      function sendLike() {
        disableButton(likeButton);
        // Можно установить спиннер или иную индикацию
        likeButton.html(`
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.9063 7.22222H15.1965C16.5355 7.22222 17.4063 8.613 16.8075 9.79505L13.6555 16.0173C13.3504 16.6196 12.7268 17 12.0445 17H8.4263C8.27903 17 8.13232 16.9822 7.98946 16.9469L4.60228 16.1111M10.9063 7.22222V2.77778C10.9063 1.79594 10.0999 1 9.10514 1H9.01915C8.56927 1 8.20457 1.35997 8.20457 1.80402C8.20457 2.43896 8.01415 3.05969 7.65733 3.58799L4.60228 8.11111V16.1111M10.9063 7.22222H9.10514M4.60228 16.1111H2.80114C1.8064 16.1111 1 15.3152 1 14.3333V9C1 8.01816 1.8064 7.22222 2.80114 7.22222H5.05257" stroke="#7b8aa3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        `);
        $.ajax({
          url: ajax_object_like_dislike.ajax_url,
          type: "POST",
          data: {
            action: "handle_like_dislike_ajax",
            comment_id: commentId,
            type: "like",
            nonce: ajax_object_like_dislike.like_dislike_nonce,
          },
          success: function (response) {
            console.log("Установка лайка:", response); // для отладки
            if (response.success) {
              likeButton.addClass("active").html(`
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.9063 7.22222H15.1965C16.5355 7.22222 17.4063 8.613 16.8075 9.79505L13.6555 16.0173C13.3504 16.6196 12.7268 17 12.0445 17H8.4263C8.27903 17 8.13232 16.9822 7.98946 16.9469L4.60228 16.1111M10.9063 7.22222V2.77778C10.9063 1.79594 10.0999 1 9.10514 1H9.01915C8.56927 1 8.20457 1.35997 8.20457 1.80402C8.20457 2.43896 8.01415 3.05969 7.65733 3.58799L4.60228 8.11111V16.1111M10.9063 7.22222H9.10514M4.60228 16.1111H2.80114C1.8064 16.1111 1 15.3152 1 14.3333V9C1 8.01816 1.8064 7.22222 2.80114 7.22222H5.05257" stroke="#7b8aa3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="like-count">${response.data.likes}</span>
              `);
              setCookie("liked_comment_" + commentId, 1, 31536000);
            } else {
              alert(response.data);
            }
            enableButton(likeButton);
          },
          error: function () {
            alert(
              "Произошла ошибка при установке лайка. Пожалуйста, попробуйте снова."
            );
            enableButton(likeButton);
          },
        });
      }
    }
  });

  // Обработчик клика по кнопке "Дизлайк"
  $(".dislike-button").on("click", function () {
    var commentId = $(this).data("comment-id");
    var dislikeButton = $(this);
    var likeButton = dislikeButton.siblings(".like-button");

    // Если дизлайк уже поставлен – отправляем запрос на отмену
    if (dislikeButton.hasClass("active")) {
      disableButton(dislikeButton);
      $.ajax({
        url: ajax_object_like_dislike.ajax_url,
        type: "POST",
        data: {
          action: "handle_like_dislike_ajax",
          comment_id: commentId,
          type: "dislike",
          cancel: true,
          nonce: ajax_object_like_dislike.like_dislike_nonce,
        },
        success: function (response) {
          console.log("Отмена дизлайка:", response); // для отладки
          if (response.success) {
            dislikeButton.find(".dislike-count").text(response.data.dislikes);
            dislikeButton.removeClass("active");
            deleteCookie("disliked_comment_" + commentId);
          } else {
            alert(response.data);
          }
          enableButton(dislikeButton);
        },
        error: function () {
          alert(
            "Произошла ошибка при отмене дизлайка. Пожалуйста, попробуйте снова."
          );
          enableButton(dislikeButton);
        },
      });
    } else {
      // Если установлен лайк – сначала отменяем его, затем ставим дизлайк
      if (likeButton.hasClass("active")) {
        disableButton(likeButton);
        $.ajax({
          url: ajax_object_like_dislike.ajax_url,
          type: "POST",
          data: {
            action: "handle_like_dislike_ajax",
            comment_id: commentId,
            type: "like",
            cancel: true,
            nonce: ajax_object_like_dislike.like_dislike_nonce,
          },
          success: function (response) {
            console.log("Отмена лайка перед дизлайком:", response); // для отладки
            if (response.success) {
              likeButton.find(".like-count").text(response.data.likes);
              likeButton.removeClass("active");
              deleteCookie("liked_comment_" + commentId);
              sendDislike();
            } else {
              alert(response.data);
              enableButton(likeButton);
            }
          },
          error: function () {
            alert(
              "Произошла ошибка при отмене лайка. Пожалуйста, попробуйте снова."
            );
            enableButton(likeButton);
          },
        });
      } else {
        sendDislike();
      }

      // Функция отправки дизлайка
      function sendDislike() {
        disableButton(dislikeButton);
        // Можно добавить спиннер или другую индикацию
        dislikeButton.html(`
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.09372 11.7778H3.80347C2.46453 11.7778 1.59368 10.387 2.19248 9.20495L5.34447 2.98273C5.64957 2.38045 6.27324 2 6.95546 2H10.5737C10.721 2 10.8677 2.01783 11.0105 2.05308L14.3977 2.88889M8.09372 11.7778V16.2222C8.09372 17.2041 8.90012 18 9.89486 18H9.98084C10.4307 18 10.7954 17.64 10.7954 17.196C10.7954 16.561 10.9858 15.9403 11.3427 15.412L14.3977 10.8889V2.88889M8.09372 11.7778H9.89486M14.3977 2.88889H16.1989C17.1936 2.88889 18 3.68483 18 4.66667V10C18 10.9818 17.1936 11.7778 16.1989 11.7778H13.9474" stroke="#7b8aa3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        `);
        $.ajax({
          url: ajax_object_like_dislike.ajax_url,
          type: "POST",
          data: {
            action: "handle_like_dislike_ajax",
            comment_id: commentId,
            type: "dislike",
            nonce: ajax_object_like_dislike.like_dislike_nonce,
          },
          success: function (response) {
            console.log("Установка дизлайка:", response); // для отладки
            if (response.success) {
              dislikeButton.addClass("active").html(`
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.09372 11.7778H3.80347C2.46453 11.7778 1.59368 10.387 2.19248 9.20495L5.34447 2.98273C5.64957 2.38045 6.27324 2 6.95546 2H10.5737C10.721 2 10.8677 2.01783 11.0105 2.05308L14.3977 2.88889M8.09372 11.7778V16.2222C8.09372 17.2041 8.90012 18 9.89486 18H9.98084C10.4307 18 10.7954 17.64 10.7954 17.196C10.7954 16.561 10.9858 15.9403 11.3427 15.412L14.3977 10.8889V2.88889M8.09372 11.7778H9.89486M14.3977 2.88889H16.1989C17.1936 2.88889 18 3.68483 18 4.66667V10C18 10.9818 17.1936 11.7778 16.1989 11.7778H13.9474" stroke="#7b8aa3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="dislike-count">${response.data.dislikes}</span>
              `);
              setCookie("disliked_comment_" + commentId, 1, 31536000);
            } else {
              alert(response.data);
            }
            enableButton(dislikeButton);
          },
          error: function () {
            alert(
              "Произошла ошибка при установке дизлайка. Пожалуйста, попробуйте снова."
            );
            enableButton(dislikeButton);
          },
        });
      }
    }
  });
});
