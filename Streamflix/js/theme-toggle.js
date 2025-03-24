$(document).ready(function() {
    $('#theme-toggle').click(function() {
        $('body, header, footer, nav').toggleClass('light-theme');
        $('body, header, footer, nav').css('transition', 'background-color 0.5s, color 0.5s');
        
        // Toggle between black and white themes
        if ($('body').hasClass('light-theme')) {
            $('body, header, footer, nav').css({
                'background-color': 'white',
                'color': 'black'
            });
        } else {
            $('body, header, footer, nav').css({
                'background-color': 'black',
                'color': 'white'
            });
        }
    });
});
