/* global jQuery: true*/
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {
    'use strict';
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'cookiesDirective',
        l18n = {
            en: {
                buttonClose: "Close",
                desc1: "Our website uses cookies. You can find out more about cookies ",
                desc2: "here.",
                desc3: " By using our website you agree to this Policy and you consent to our use of cookies in accordance with the terms of this Policy."
            },
            pl: {
                buttonClose: "Zamknij",
                desc1: "Nasz serwis używa cookie. Dowiedz się więcej o ",
                desc2: "plikach cookie.",
                desc3: " Korzystając ze strony wyrażasz zgodę na używanie cookie, zgodnie z aktualnymi ustawieniami przeglądarki."
            },
            ru: {
                buttonClose: "Закрыть",
                desc1: "Наш сайт использует т. н. файлы данных типа «сookie». Узнайте больше о политике ",
                desc2: " «сookie».",
                desc3: " Продолжение использования вами данного сайта и выход на него означает ваше согласие на использование файлов «сookie»."
            },
            ua: {
                buttonClose: "Close",
                desc1: "Nasz serwis używa cookie. Dowiedz się więcej o ",
                desc2: "plikach cookie.",
                desc3: " Korzystając ze strony wyrażasz zgodę na używanie cookie, zgodnie z aktualnymi ustawieniami przeglądarki."
            }
        },
        defaults = {
            selector: 'body',
            cookieName: 'cookieagreed',
            cookieLifeTime: 1000,
            markup: '<div id="cookies-bar" style="display: none;">\
                        <p>%s<a href="%s" target="_blank">%s</a>%s\
                        </p>\
                        <a class="btn btn-xs btn-danger cookies-bar-close">%s</a>\
                     </div>',
            policyLink: 'http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm',
            language: 'en'
        },
        methods = {};

    // The actual plugin constructor
    function Plugin(element, options) {
        var that = this;

        that.options = $.extend({}, defaults, options);
        that._defaults = defaults;
        that._name = pluginName;

        that.element = $(
            that.sprintf(
                that.options.markup,
                l18n[that.options.language].desc1,
                that.policyLink,
                l18n[that.options.language].desc2,
                l18n[that.options.language].desc3,
                l18n[that.options.language].buttonClose
            )
        );
        $('body').append(that.element);

        that.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;

            if (! that.areCookiesEnabled()) {
                return false;
            }

            setTimeout(function () {
                if (! that.getCookie(that.options.cookieName)) {
                    that.showBar();
                    $(document).on('click', '.cookies-bar-close', function (e) {
                        e.preventDefault();
                        that.closeBar();
                    });
                }
            }, 5000);

        },
        showBar: function () {
            var that = this;

            that.element.fadeIn();
        },
        closeBar: function () {
            var that = this;

            that.element.fadeOut().remove();
            that.setCookie(that.options.cookieName, 1, that.options.cookieLifeTime);
        },
        sprintf: function (format, etc) {
            var arg = arguments;
            var i = 1;
            return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
        },
        getCookie: function (c_name) {
            var	c_value = document.cookie,
                c_start = c_value.indexOf(" " + c_name + "=");

            if (c_start == -1) {
                c_start = c_value.indexOf(c_name + "=");
            }
            if (c_start == -1) {
                c_value = null;
            }
            else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = c_value.length;
                }
                c_value = unescape(c_value.substring(c_start,c_end));
            }

            return c_value;
        },
        setCookie: function (c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + ';path=/';
            //alert(c_value);
            document.cookie = c_name + "=" + c_value;
        },
        areCookiesEnabled: function () {
            var cookieEnabled = navigator.cookieEnabled;

            // When cookieEnabled flag is present and false then cookies are disabled.
            if (cookieEnabled === false) {
                return false;
            }

            // try to set a test cookie if we can't see any cookies and we're using
            // either a browser that doesn't support navigator.cookieEnabled
            // or IE (which always returns true for navigator.cookieEnabled)
            if (!document.cookie && (cookieEnabled === null || /*@cc_on!@*/false))
            {
                document.cookie = "testcookie=1";

                if (!document.cookie) {
                    return false;
                } else {
                    document.cookie = "testcookie=; expires=" + new Date(0).toUTCString();
                }
            }

            return true;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations

    methods[pluginName] = function(option) {
        var options = typeof option === 'object' && option,
            element = $(options['selector']),
            data = $.data(element, 'plugin_' + pluginName),
            result;

        if (!data) {
            element.data('plugin_' + pluginName, (data = new Plugin(element, options)));
        }
        // if first argument is a string, call silimarly named function
        // this gives flexibility to call functions of the plugin e.g.
        //   - $('.dial').plugin('destroy');
        //   - $('.dial').plugin('render', $('.new-child'));

        if (typeof option === 'string') {
            result = data[option].apply(data, Array.prototype.slice.call(arguments, 1));
        }

    };
    $.extend(methods);

})(jQuery, window, document);
