/*
 *对lazyload.js进行修改，用于支持Iscroll做为框架的项目
 *
 *2017/04/08
 *
 * 
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            // container       : myScroll,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/gif;base64,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p52ocX6Vdlpqq9WWyWuxzSblaFhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirppJRWaumlmGaq6aacdurpp6CGKuqopJZq6qmopqrqqqy26uqrsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuusqIEAACH5BAkEAFAALAAAAAAsASwBAAf/gFCCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLZqvhwoofBzbAaAGB0gQcFW4Y6CBAw4TCJUwc2M37gIgPkiCAMEC8uAEMEQRD2NC7+e4LkDQYn06cxu2/MJxrD+AoAvXvFf5y0K7dROtFEzB8/36erwjy2lcwErD+O4i+H+BrF8FIfX3q1+kVgH7atXfIBP99l9xeFxDoHAeKQJAgdRrw1aCDvUGYiIQTGlfhXgNiyJuBhiDYYXEL6pWfiL71dyJxAer1nojyLULfiff1NR6G5jGS3okk6pWdg9w14t2E4f21HL6B0D0i3X/WCUaAbs79AFwkOQxHHXKFlXZaajCUEKQjr8U2W20xjqbmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfg1hoIACH5BAkE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5I2STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaKaSAAIfkECQQAUAAsAAAAACwBLAEAB/+AUIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wADChxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3D/48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4uWCwAICxkJTigIoCgFiBcEjmT4ICGyhwS4c+M+AcCQhAAEggsP/sExANS6k7tgPSiFj+HQCQSovfhE8uu4BQgCEL37i8UWsGOXIQh49+g0EgNwIR67hw/nu/ugbhhEe+wnYMeP3vvw7fvKWbBfdMUdxgKAySkxYHQZIHYggrkpuOBwDfoHYW4uCDghcYjZd2Fq+m3Yn2HrfWgBfBtaQJ9h4UFIHhTmLZieYtYhqB0U3C343WISICfecoSkoOF50zn233W8+RYirXQFPgaABywo4YJqzCHiGmwozLbiaFx26eWXYIYp5phklmnmmWimqeaabLbp5ptwxinnnHTWaeedeOap55589unnn4AGKuighBZq6KGIJqrooow26uijkEYq6aSUVmrppZhmqummnHbq6aeghirqqKSWauqpqKaq6qqsturqq7DGKuustNZq66245qrrrrz26uuvwAYr7LDEFmvsscgmq+yyzDbr7LPQRittq4EAACH5BAkEAFAALAAAAAAsASwBAAf/gFCCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5yd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"
        };

        function filter(){
            var temp = $.grep(elements, function(element) {
                return !($(element).attr("data-loaded")=="true");
            });
            elements = $(temp);
        }
        filter();

        function update() {
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if ($.abovethetop(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.abovethetop(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        $container=myScroll;

        var startScroll;
        $container.on("scrollStart", function() {
            startScroll=setInterval(update,300);
        });
        $container.on("scrollEnd", function() {
            clearInterval(startScroll);
        });

        this.each(function() {
            var self = this;
            var $self = $(self);

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                    $("<img />")
                        .bind("load", function() {
                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            $self.attr("src", original);
                            $self[settings.effect](/*settings.effect_speed*/);

                            $self.attr("data-loaded","true");

                            /* Remove image from array so it is not looped next time. */
                            filter();
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
            });

        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        fold=$("#wrapper").offset().top+$("#wrapper").height();
        var Ep=($(element).offset().top - settings.threshold);
        return fold <= Ep;
    };

    $.abovethetop = function(element, settings) {
        var fold;
        fold=$("#wrapper").offset().top;
        var Ep=$(element).offset().top + settings.threshold  + $(element).height();
        return fold >= Ep;
    };

    $.inviewport = function(element, settings) {
        return !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
    });

})(jQuery, window, document);