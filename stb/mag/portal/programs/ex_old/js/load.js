var _load = {
    'files': {},
    'stb': function () {
        log('- - - win.height: ' + win.height + ', win.width: ' + win.width);
        if (typeof (gSTB) == 'object') {
            stb = gSTB;
            window.moveTo(0, 0);
            window.resizeTo(win.width, win.height);
            stb.InitPlayer();
            stb.SetTopWin(0);
            stb.EnableServiceButton(false);
            stb.EnableVKButton(true);
            volume = stb.GetVolume();
            mute = stb.GetMute();
            as.dvice_model = stb.RDir("Model");
            stb.SetPIG(1, 0, 0, 0);
            var langv_set = JSON.parse(stb.GetEnv('{"varList":["lang_audiotracks","lang_subtitles","subtitles_on"]}'));
            info_menu.audio = langv_set.result.lang_audiotracks != '' ? langv_set.result.lang_audiotracks : 0;
            info_menu.subt = langv_set.result.lang_subtitles != '' ? langv_set.result.lang_subtitles : 0;
            info_menu.on = langv_set.result.subtitles_on == true || langv_set.result.subtitles_on == "true" ? true : false;
            stbEvent = {
                onEvent: app.player.events,
                event: 0
            };
        } else {
            modes.emulate = true;
            stb = egSTB;
            log('- - - stb emulate - - -');
        }
    },
    'get': function () {
        _GET['referer'] = '';
        _GET['proxy'] = '';
        get_params();
        as.proxy = _GET['proxy'];
        as.referer = _GET['referer'];
        if (as.proxy.length > 0) {
            log('- - - proxy: "' + as.proxy + '"');
        }
        if (as.proxy.length > 0) {
            log('- - - referer: "' + as.referer + '"');
        }
    },
    'grafics': function () {
        as.actualSize = win.height;
        log("- - - as.actualSize: " + win.height);
    },
    'lang': function (callback) {
        as.cur_lang = getEnvironmentValue('language');
        try {
            as.cur_lang = as.cur_lang.toLowerCase();
        } catch (e) {}
        if (empty(as.cur_lang)) {
            as.cur_lang = as.default_lang;
        }
        log('- - - set language: {' + as.cur_lang + '}');
        this.js('langs/' + as.cur_lang + '.js');
        return this.try_lang(callback);
    },
    'try_lang': function (callback) {
        var self = this;
        log('lang: ' + as.cur_lang);
        setTimeout(function () {
            if (typeof (lang) == 'undefined') {
                return self.try_lang(callback);
            } else {
                callback.call(callback);
                return;
            }
        }, 100);
    },
    'css': function (path) {
        if (empty(path)) {
            return false;
        }
        if (typeof (this.files[paths.js + path]) != 'undefined') {
            return false;
        } else {
            this.files[paths.js + path] = 'done';
        }
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", paths.css + path);
        document.getElementsByTagName("head")[0].appendChild(fileref);
        log('file CSS: "' + path + '" loaded');
        return true;
    },
    'js': function (path) {
        if (empty(path)) {
            return false;
        }
        if (typeof (this.files[paths.js + path]) != 'undefined') {
            return false;
        } else {
            this.files[paths.js + path] = 'waiting';
        }
        var fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", paths.js + path);
        var self = this;
        fileref.onload = function () {
            self.files[paths.js + path] = 'done';
            log('file JS: "' + path + '" loaded');
        };
        document.getElementsByTagName("head")[0].appendChild(fileref);
        return self;
    }
};