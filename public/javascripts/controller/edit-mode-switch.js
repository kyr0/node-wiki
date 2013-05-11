jQuery(document).ready(function() {

    $(".editButton").click(function (e) {
        e.preventDefault();

        if ($(".editButton").hasClass('active')) {
            app.disableContentEditing();
        } else {
            app.enableContentEditing();
        }
    });
});