jQuery(document).ready(function($){
    $('#additional-comment-form').on('submit', function(e){
        e.preventDefault();

        var formData = $(this).serialize();

        $.ajax({
            url: ajax_object_comment.ajax_url,
            type: 'POST',
            data: formData,
            beforeSend: function(){
                // Можно добавить спиннер или индикатор загрузки
                $('#additional-comment-form .submit-button').prop('disabled', true).text('Отправка...');
            },
            success: function(response){
                if(response.success){
                    // Выводим сообщение об успешной отправке
                    $('#additional-comment-form').after('<div class="comment-success">' + response.data + '</div>');
                    // Сбрасываем форму
                    $('#additional-comment-form')[0].reset();
                }
                else{
                    // Выводим ошибку
                    $('#additional-comment-form').after('<div class="comment-error">' + response.data + '</div>');
                }
                $('#additional-comment-form .submit-button').prop('disabled', false).text('Отправить');
            },
            error: function(){
                alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
                $('#additional-comment-form .submit-button').prop('disabled', false).text('Отправить');
            }
        });
    });
});
