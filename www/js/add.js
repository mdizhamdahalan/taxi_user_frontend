$(document).ready(function () {
    $('.add').submit(function () {
        $.post(MAIN_URL+'/requests/taxi/add.php', $(this).serialize(), function (data) {
            console.log(data);
            if (data == 1) location.href = MAIN_URL+'/taxi';
        })
        return false
    })
})
