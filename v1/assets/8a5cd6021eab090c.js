jQuery(document).ready(function($){
    // Обработка нажатия на кнопку "Ответить"
    $('.reply-button').on('click', function(){
        var commentId = $(this).data('comment-id');
        var formContainer = $('#reply-form-container-' + commentId);

        // Проверяем, есть ли уже форма
        if (formContainer.children().length === 0) {
            // Вставляем HTML формы
            var formHtml = `
                <form class="reply-form row" data-parent-id="${commentId}">
                    <input type="hidden" name="action" value="handle_additional_comment_reply_ajax">
                    <input type="hidden" name="additional_comment_reply_nonce" value="${ajax_object_reply.reply_nonce}">
                    <div class="form-group col-12 col-md-6">
                        <div class="mb-3">
                        <input type="text" id="reply_author_name_${commentId}" name="reply_author_name" class="form-control" placeholder="Имя*" required>
                         </div>
                    </div>
                    <div class="form-group col-12 col-md-6">
                    <div class="mb-3">
                        <input type="email" id="reply_author_email_${commentId}" name="reply_author_email" class="form-control" placeholder="E-Mail*" required>
                    </div>
                    </div>
                    <div class="form-group col-12">
                        <textarea id="reply_comment_content_${commentId}" name="reply_comment_content" class="form-control" rows="4" placeholder="Ваш ответ*" required></textarea>
                    </div>
                    <div class="form-comment__bottom">* - Обязательно заполнить</div>
                    <input type="hidden" name="reply_related_post" value="${ajax_object_reply.current_post_id}" />
                    <input type="hidden" name="reply_parent_comment" value="${commentId}" />
                    <div class="col-12">
                    <div class="mt-3">
                    <button type="submit" class="btn btn-primary px-5">Отправить</button>
                     </div>
                    </div>
                </form>
            `;
            formContainer.html(formHtml);
        }

        // Показать или скрыть форму
        formContainer.toggle();
    });

    // Обработка отправки формы ответа
    $(document).on('submit', '.reply-form', function(e){
        e.preventDefault();

        var form = $(this);
        var parentId = form.data('parent-id');

        var formData = {
            action: 'handle_additional_comment_reply_ajax',
            additional_comment_reply_nonce: form.find('input[name="additional_comment_reply_nonce"]').val(),
            reply_author_name: form.find('input[name="reply_author_name"]').val(),
            reply_author_email: form.find('input[name="reply_author_email"]').val(),
            reply_comment_content: form.find('textarea[name="reply_comment_content"]').val(),
            reply_related_post: form.find('input[name="reply_related_post"]').val(),
            reply_parent_comment: parentId,
        };

        $.ajax({
            url: ajax_object_reply.ajax_url,
            type: 'POST',
            data: formData,
            beforeSend: function(){
                // Можно добавить спиннер или индикатор загрузки
                form.find('button[type="submit"]').prop('disabled', true).text('Отправка...');
            },
            success: function(response){
                if(response.success){
                    // Очистить форму и скрыть её
                    form[0].reset();
                    form.parent().hide();

                    // Добавить новый комментарий в список
                    var newCommentHtml = `
                        <li class="additional-comment">
                            <div class="additional-comment__header">
                                <strong>${escapeHtml(response.data.author_name)}</strong> (${escapeHtml(response.data.author_email)}) - ${response.data.comment_date}
                            </div>
                            <div class="additional-comment__content">${escapeHtml(response.data.comment_content)}</div>
                            <div class="additional-comment__actions">
                                <button class="like-button btn btn-sm btn-outline-success" data-comment-id="${response.data.comment_id}">👍 <span class="like-count">0</span></button> 
                                <button class="dislike-button btn btn-sm btn-outline-danger" data-comment-id="${response.data.comment_id}">👎 <span class="dislike-count">0</span></button> 
                                <button class="reply-button btn btn-sm btn-secondary ml-2" data-comment-id="${response.data.comment_id}">Ответить</button>
                            </div>
                            <div class="reply-form-container" id="reply-form-container-${response.data.comment_id}" style="display: none; margin-top: 15px;"></div>
                        </li>
                    `;

                    // Найти родительский комментарий и добавить ответ
                    $('button[data-comment-id="' + parentId + '"]').closest('.additional-comment').children('ul').append(newCommentHtml);
                }
                else{
                    // Выводим ошибку
                    form.after('<div class="comment-error">' + response.data + '</div>');
                }
                form.find('button[type="submit"]').prop('disabled', false).text('Отправить');
            },
            error: function(){
                alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
                form.find('button[type="submit"]').prop('disabled', false).text('Отправить');
            }
        });
    });

    // Функция для экранирования HTML
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
