KISSY.ready(function (S) {

    S.use('dom, node', function(S, Dom, Node) {
        var $ = Node.all;

        $('body').css('height', Dom.viewportHeight());
    });

});