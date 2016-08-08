//<!--
document.addEventListener("keypress", KeyHandler, false);

if (typeof (Api) == 'undefined') {
    Api = new StbApi();
}

var stalkerObject = new initObject();
var stalkerClient = new StalkerClient();

var ChanNumDiv = new Status();
var ChanNameDiv = new Status();
var BottomDiv = new Status();
var ClockDiv = new Status();
var NewsDiv = new Status();
var TopLine = new Status();
var AudioPIDs = new Status();

var MainMenu = new PageMenu();
MainMenu.List = new Array();
var Setting = new Settings();
var Operator = new OperatorObj();
var CheckBot = new Checker();

var curMenuName = "MainMenu";
var CurMenu = MainMenu;
var ShowMenu = null;
var epgActive = 0;
var ChanObj = new Channel();
ChanObj.name = "ChanObj";

var TIMER = new Timer();
var currentTime = new Date();
var osdActive = 0;
var clockIntId;
var settingTm = null;

var Fav1Menu = null;
if (typeof (favs1) != "undefined" && favs1.length > 0) {
    Fav1Menu = new PageMenu();
    Fav1Menu.List = favs1;
}
var Fav2Menu = null;
if (typeof (favs2) != "undefined" && favs2.length > 0) {
    Fav2Menu = new PageMenu();
    Fav2Menu.List = favs2;
}
var Fav3Menu = null;
if (typeof (favs3) != "undefined" && favs3.length > 0) {
    Fav3Menu = new PageMenu();
    Fav3Menu.List = favs3;
}
var checkmcast = false;
var checkplay = false;
var blinkTimes = 0;
var checkPlayerStatus = 0;
var timeshiftStatus = 0;
var arrGenres = new Array(13);
arrGenres[0] = ""
arrGenres[1] = "movies";
arrGenres[2] = "news";
arrGenres[3] = "educations";
arrGenres[4] = "sports";
arrGenres[5] = "childrens";
arrGenres[6] = "musics";
arrGenres[7] = "hdtv"
arrGenres[8] = "russia";
arrGenres[9] = "ukraine";
arrGenres[10] = "odessa";
arrGenres[11] = "shows";
arrGenres[12] = "favorites";

var GenresRus = new Array(13);
GenresRus[0] = "Все каналы";
GenresRus[1] = "Фильмовые";
GenresRus[2] = "Новостные";
GenresRus[3] = "Познавательные";
GenresRus[4] = "Спортивные";
GenresRus[5] = "Детские";
GenresRus[6] = "Музыкальные";
GenresRus[7] = "HDTV";
GenresRus[8] = "Зарубежные";
GenresRus[9] = "Украинские";
GenresRus[10] = "Одесские";
GenresRus[11] = "Развлекательные";
GenresRus[12] = "Избранное";

MainMenu.Genre = arrGenres;

function VolumeObj() {
    this.value = Api.GetVolume();
    this.tmId = null;

    this.Show = function () {
        if (this.tmId != null) {
            clearTimeout(this.tmId);
        }

        $("#VolumeBlock").css('visibility', 'visible');
        this.tmId = this.SetTm(2000);
    };
    this.Hide = function () {
        $("#VolumeBlock").css('visibility', 'hidden');
        this.tmId = null;
    };
    this.Mute = function () {
        Api.Mute();
        if (Api.GetMute() == 1) {
            $("#Muted").css('display', 'block');
        } else {
            $("#Muted").css('display', 'none');
        }
    };
    this.Plus = function () {
        if (Api.GetMute() == 1) {
            this.Mute();
            //unMute
        }
        this.value = Api.VolUp();
        VolumeRender(this.value);
        this.Show();
    };
    this.Minus = function () {
        if (Api.GetMute() == 1) {
            this.Mute();
            //unMute
        }
        this.value = Api.VolDown();
        VolumeRender(this.value);
        this.Show();
    };
    this.SetTm = function (time) {
        return setTimeout("Volume.Hide()", time);
    }
}

var Volume = new VolumeObj();

function blink(div) {
    disp = $("#" + div).css("visibility");
    if (disp == "visible") {
        $("#" + div + " img").fadeTo("slow", "0.4").fadeTo("slow", "1", function () {
            blink(div);
        });
    } else
        return;
}

function checkStandBy() {
    stbEvent.onEvent = stbevt;
}

function stbevt(event) {

    switch (event) {
        case '1':

            checkplay = true;
            CheckBot.Enable();

            $.get('http://briz.ua/stb/mag/portal/programs/iptv/stbdebug.php', {
                'chanID': CurMenu.List[CurMenu.GetItemId()][2],
                'ip': Api.GetDeviceIP(),
                'mac': Api.GetDeviceMac(),
                'time': Math.round((new Date()).getTime() / 1000)
            });
            break;
        case '4':
            CheckBot.Disable();
            checkplay = false;
            checkmcast = true;
            break;
    }

}

function checkMcast() {
    if (checkplay == true) {
        if (Operator.Expire() === false) {
            ChanObj.PlayCheck();
        }
    }
}

window.onload = function () {

    /*$.getJSON(Api.GetLoaderUrl(), {
        g: ''
    }, function (genre) {
        MainMenu.List = genre;
        MainMenu.FirstPage();
        MainMenu.RestartTm();
    });*/
    setInterval(checkStandBy, 1000);

    CheckBot.Init("CheckBot");

    setInterval("ChanObj.PlayCheck()", 1000);
    Api.InitStb();
    Api.SetAlpha(10);
    Api.DisableServiceButton();
    Setting.Init();
    Operator.Init('Operator');
    Operator.StartCheckExpire();
    ChanNumDiv.onload("ChanNumDiv");
    ChanNameDiv.onload("ChanNameDiv");
    ClockDiv.onload("ClockDiv");
    BottomDiv.onload("BottomDiv");
    MainMenu.onload("MainMenu");
    NewsDiv.onload("NewsDiv");
    TopLine.onload("TopLine");
    AudioPIDs.onload("AudioPIDs");
    TIMER.onload("timerDiv");
    TIMER.name = "TIMER";

    if (Fav1Menu) {
        Fav1Menu.onload("Fav1Menu");
    }
    if (Fav2Menu) {
        Fav2Menu.onload("Fav2Menu");
    }
    if (Fav3Menu) {
        Fav3Menu.onload("Fav3Menu");
    }
    Iframe = document.getElementById("iframe1");
    Api.Stop();
    Api.SetFull();

    stalkerObject.setMac(Api.GetDeviceMac());

    stalkerClient.init(stalkerObject).then(
        function(data){

            stalkerClient.getGenres().then(function(genres){
                arrGenres = genres;
            });

            stalkerClient.getChannels().then(
                    function(channels){
                        MainMenu.List = channels;
                        MainMenu.FirstPage();
                        MainMenu.RestartTm();

                        ChanObj.CheckGET();
                        ChanObj.Play();
                    },
                    function(error_description){
                        MainMenu.List = [['0', 'Пустой список', '-']];
                        MainMenu.FirstPage();
                        MainMenu.RestartTm();
                        alert(error_description);
                    }
                )

        },
        function(error_description){
            MainMenu.List = [['0', 'Пустой список', '-']];
            MainMenu.FirstPage();
            MainMenu.RestartTm();
            alert(error_description);
        }
    );

    $.post("./news/news.php", {
        getNews: "check"
    }, function (data) {
        text = "<div style=\"background-color: #111111\">";
        text += "<img src=\"./images/rss.png\"\>&nbsp<span style=\"position: relative; top: -7px; font-size: 24px;\">СООБЩЕНИЕ</span><div style=\"float: right;\"><span style=\"position: relative; top: -7px; font-size: 24px;\"> НАЖМИТЕ <font color=\"green\">ЗЕЛЕНУЮ</font> КНОПКУ</span>&nbsp</div>&nbsp";
        text += "</div>"
        if (data == 1) {
            NewsDiv.Show(text, 30000);
            blink("NewsDiv");
            BottomDiv.Hide();
        }
    });


}
//
window.onunload = function () {
    Api.Stop();
    Api.SetAlpha(10);
}
function OnloadIframe(iframe) {
    var doc = null;
    if (iframe.contentDocument) {//NS6
        doc = iframe.contentDocument;
    } else if (iframe.contentWindow) {//IE5.5 and IE6
        doc = iframe.contentWindow;
    } else if (iframe.document) {//IE5
        doc = iframe.document;
    } else {
        alert("Error: could not find sumiFrame document");
    }
    if (osdActive != 1) {
        BottomDiv.Show(doc.getElementById("content").innerHTML, 5000);
    } else {
        BottomDiv.Show(doc.getElementById("content").innerHTML, 'always');
    }
}

function KeyHandler(event) {
    var keyrtn = true;
    var key = event.keyCode > 0 ? event.keyCode : event.charCode;
    var shift = event.shiftKey;
    var key = event.which;
    var alt = event.altKey;
    pat = /^(\S+)_(\S+)/;
    //alert(key + ' alt: ' + alt + ' shift: ' + shift);
    if (Api.standBy == 0) {
        switch (key) {
            case VK_POWER:
                if (alt === true) {
                    Api.StandBy();
                    if (Api.standBy == 1) {
                        ChanObj.Play();
                    }
                }
                break;
        }
    } else {
        switch (key) {

            case VK_POWER:
                if (alt === true) {
                    Api.StandBy();
                    if (Api.standBy == 1) {
                        ChanObj.Play();
                    }
                }
                break;

            case VK_CAPTURE:
                if (document.getElementById("timerDiv").style.display == 'none') {
                    TIMER.Show();
                } else {
                    TIMER.Hide();
                }
                break;

            case VK_MUTE:
                if (alt === true) {
                    Volume.Mute();
                }
                break;

            case VK_SETUP:
                x = document.getElementById("video_settings").style.display;
                if (x == 'none') {
                    Setting.Render();
                    document.getElementById("video_settings").style.display = "block";
                    settingActive = 1;
                } else {
                    document.getElementById("video_settings").style.display = "none";
                    Setting.Save();
                    settingActive = 0;
                }
                break;
            case VK_AUDIO_MODE:
                if (alt === true) {
                    Setting.AudioModeNext();
                    Setting.Render();
                    txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetAudioModeName() + "<\/font>";
                    BottomDiv.Hide();
                    NewsDiv.Show(txt, 2000);
                }
                break;
            case VK_VIDEO_ASPECT:
                if (alt === true) {
                    Setting.AspectNext();
                    Setting.Render();
                    txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetAspectName() + "<\/font>";

                    BottomDiv.Hide();
                    NewsDiv.Show(txt, 2000);
                }
                break;
            case VK_VIDEO_MODE:

                if (alt === true) {
                    Setting.ContentNext();
                    Setting.Render();
                    var txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + Setting.GetContentName() + "<\/font>";
                    if (settingTm != null) {
                        clearTimeout(settingTm);
                        settingTm = null;
                    }

                    settingTm = setTimeout('Setting.Save()', 5000);

                    BottomDiv.Hide();
                    NewsDiv.Show(txt, 2000);

                }
                break;

            case VK_FAV:
                /*
                 $.getJSON(Api.GetInterfaceUrl(), {
                 g : MainMenu.SetGenre(13)
                 }, function(genre) {
                 MainMenu.List = genre;
                 MainMenu.FirstPage();
                 MainMenu.RestartTm();
                 if (!ShowMenu) MainMenu.Display();
                 });
                 */
                break;
            case VK_MENU:
                MainMenu.Display();
                keyrtn = false;
                break;

            case VK_EXIT:
                if (ShowMenu) {
                    MainMenu.Display();
                } else {
                    if (epgActive == 1) {
                        epgActive = 0;
                        $("#EpgFull").hide();
                    } else {
                        window.location.href = Api.GetHomePage();
                    }

                }
                break;

            case VK_INFO:
                if (alt === true) {
                    if (osdActive == 0) {
                        osdActive = 1;
                        ChanObj.LoadEpg();
                        TopLine.Show("", 'always');
                        AudioPIDs.Show("", 'always');
                        BottomDiv.Show("show", 'always');
                        ClockDiv.Show('clock', 'always');
                        ChanNumDiv.Show(ChanObj.currentNo, 'always');
                        ChanNameDiv.Show(CurMenu.List[ChanObj.currentNo - 1][1] + "<i>&nbsp;</i>", 'always');
                    } else {
                        osdActive = 0;
                        TopLine.Hide();
                        BottomDiv.Hide();
                        ClockDiv.Hide();
                        ChanNumDiv.Hide();
                        ChanNameDiv.Hide();
                    }
                }
                break;

            case VK_RED:
                break;

            case VK_YELLOW:
                if (alt === false) {
                    var txt = "";
                    var status = "";
                    var id = "";
                    if (ShowMenu) {
                        id = ShowMenu.page * ShowMenu.size + ShowMenu.pos;
                    } else {
                        id = ChanObj.currentNo - 1;
                    }
                    chanGlobalId = CurMenu.List[id][2];
                    if (MainMenu.Genre[MainMenu.genrePos] == "favorites") {

                        stalkerClient.deleteFavorite(CurMenu.List[id][0]).then(
                            function(success){
                                status = "УБРАНО ИЗ СПИСКА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                                CurMenu.List[id][0] = "0";
                                CurMenu.List[id][1] = "удален из списка";
                                CurMenu.List[id][2] = "0";
                                MainMenu.RefreshPage();
                                MainMenu.RestartTm();
                            },
                            function(error){
                                status = "ОШИБКА: ПРИ УДАЛЕНИЕ КАНАЛА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            }
                        );

                        /*$.get(Api.GetLoaderUrl(), {
                            delFav: chanGlobalId
                        }, function (data) {
                            if (data * 1 == 1) {
                                status = "УБРАНО ИЗ СПИСКА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                                CurMenu.List[id][0] = "0";
                                CurMenu.List[id][1] = "удален из списка";
                                CurMenu.List[id][2] = "0";
                                MainMenu.RefreshPage();
                                MainMenu.RestartTm();
                            } else if (data * 1 == 0) {
                                status = "НЕТ ТАКОГО КАНАЛА В ИЗБРАННОМ";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            } else {
                                status = "ОШИБКА: ПРИ УДАЛЕНИЕ КАНАЛА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            }
                        });*/
                    } else {

                        stalkerClient.addFavorite(CurMenu.List[id][0]).then(
                            function(success){
                                status = "КАНАЛ ДОБАВЛЕН В ИЗБРАННОЕ";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            },
                            function(error){
                                status = "ОШИБКА: ПРИ ДОБАВЛЕНИИ КАНАЛА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            }
                        );

                       /* $.get(Api.GetLoaderUrl(), {
                            addFav: chanGlobalId
                        }, function (data) {
                            if (data * 1 == 1) {
                                status = "КАНАЛ ДОБАВЛЕН В ИЗБРАННОЕ";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            } else if (data * 1 == 0) {
                                status = "КАНАЛ УЖЕ В ИЗБРАННОМ";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            } else {
                                status = "ОШИБКА: ПРИ ДОБАВЛЕНИИ КАНАЛА";
                                txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                                BottomDiv.Hide();
                                NewsDiv.Show(txt, 2000);
                            }
                        });*/
                    }
                    txt = "<font style=\"font-size: 20px; float: right; color: white;\">" + status + "<\/font>";
                    BottomDiv.Hide();
                    NewsDiv.Show(txt, 2000);
                }
                break;

            case VK_GREEN:
              /*  NewsDiv.Hide();
                $newsBlock = $("#NewsBlock");
                var disp = $newsBlock.css("display");
                if (disp == "none") {
                    $.post("./news/news.php", {
                        getNews: "new"
                    }, function (data) {
                        $newsBlock.html(data).show();
                    });
                } else {
                    $newsBlock.hide();
                    $newsBlock.html("");
                }*/
                break;

            case VK_VOL_UP:
                Volume.Plus();
                break;

            case VK_VOL_DOWN:
                Volume.Minus();
                break;

            case VK_PG_UP:
                if (ShowMenu) {
                    ShowMenu.PageUpEx();
                }
                break;

            case VK_PG_DOWN:
                if (ShowMenu) {
                    ShowMenu.PageDownEx();
                }
                keyrtn = false;
                break;

            case VK_RIGHT:
                if (settingActive == 0) {
                    if (document.getElementById("timerDiv").style.display == 'none') {
                        if (ShowMenu) {

                            var show_favorites = false;
                            var genreName = MainMenu.GenreNext();

                            if (genreName == 'favorites'){
                                genreName = '';
                                show_favorites = true;
                            }

                            stalkerClient.getChannels(genreName, show_favorites).then(
                                function(channels){
                                    MainMenu.List = channels;
                                    MainMenu.FirstPage();
                                    MainMenu.RestartTm();
                                },
                                function(error_description){
                                    MainMenu.List = [['0', 'Пустой список', '-']];
                                    MainMenu.FirstPage();
                                    MainMenu.RestartTm();
                                });

                            //ShowMenu.PageDownEx();
                           /* $.getJSON(Api.GetLoaderUrl(), {
                                g: MainMenu.GenreNext()
                            }, function (genre) {
                                MainMenu.List = genre;
                                MainMenu.FirstPage();
                                MainMenu.RestartTm();
                            });*/
                        } else {
                            if (epgActive) {
                                ChanObj.EpgFullNext();
                            } else {
                                Volume.Plus();
                            }
                        }

                    } else {
                        $next = $("div.timerActive").next("div");
                        if ($next.attr('class') == 'timer') {
                            $("div.timerActive").attr("class", "timer");
                            //.animate({opacity: "-=0.5"}, 1000);
                            $next.attr("class", "timerActive");
                            //.animate({opacity: "+=0.5"}, 1000);
                        }
                    }
                } else {
                    Setting.Set('right');
                }
                break;

            case VK_LEFT:
                if (settingActive == 0) {
                    if (document.getElementById("timerDiv").style.display == 'none') {
                        if (ShowMenu) {
                            ShowMenu.PageUpEx();

                            var show_favorites = false;
                            var genreName = MainMenu.GenrePrev();

                            if (genreName == 'favorites'){
                                genreName = '';
                                show_favorites = true;
                            }

                            stalkerClient.getChannels(genreName, show_favorites).then(
                                function(channels){
                                    MainMenu.List = channels;
                                    MainMenu.FirstPage();
                                    MainMenu.RestartTm();
                                },
                                function(error_description){
                                    MainMenu.List = [['0', 'Пустой список', '-']];
                                    MainMenu.FirstPage();
                                    MainMenu.RestartTm();
                                });
                           /*
                            var jqxhr = $.getJSON(Api.GetLoaderUrl(), {
                                g: MainMenu.GenrePrev()
                            }, function (genre) {
                                MainMenu.List = genre;
                                MainMenu.FirstPage();
                                MainMenu.RestartTm();
                            })*/
                        } else {
                            if (epgActive) {
                                ChanObj.EpgFullPrev();
                            } else {
                                Volume.Minus();
                            }
                        }
                    } else {
                        $prev = $("div.timerActive").prev("div");
                        if ($prev.attr('class') == 'timer') {
                            $("div.timerActive").attr("class", "timer");
                            //.animate({opacity: "-=0.5"}, 1000);
                            $prev.attr("class", "timerActive");
                            //.animate({opacity: "+=0.5"}, 1000);
                        }
                    }
                } else {
                    Setting.Set('left');
                }
                keyrtn = false;
                break;

            case VK_UP:
                if (settingActive == 0) {
                    if (epgActive == 0) {
                        if (document.getElementById("timerDiv").style.display == 'none') {
                            if (ShowMenu) {
                                ShowMenu.PrevEx();
                            } else {
                                ChanObj.Next();
                            }
                        } else {
                            var el = $("div.timerActive").attr('id');
                            TIMER.Increase(el);
                        }
                    } else {
                        if ($('.shedule-container').css("marginTop").replace("px", "") < 0) {
                            $(".shedule-container").animate({marginTop: '+=29px'}, 0, function () {
                            });
                        }
                    }
                } else {
                    Setting.ElementPrev();
                }
                keyrtn = false;
                break;
            case VK_CHAN_UP:
                if (shift === false) {
                    if (settingActive == 0) {
                        if (epgActive == 0) {
                            if (document.getElementById("timerDiv").style.display == 'none') {
                                if (ShowMenu) {
                                    ShowMenu.PrevEx();
                                } else {
                                    ChanObj.Next();
                                }
                            } else {
                                var el = $("div.timerActive").attr('id');
                                TIMER.Increase(el);
                            }
                        }
                    }
                }
                else if (shift === true) {
                    if (settingActive == 0) {
                        if (epgActive == 0) {
                            if (document.getElementById("timerDiv").style.display == 'none') {
                                if (ShowMenu) {
                                    ShowMenu.NextEx();
                                } else {
                                    ChanObj.Prev();
                                }
                            } else {
                                var el = $("div.timerActive").attr('id');
                                TIMER.Decrease(el);
                            }
                        }
                    }
                }

                break;

            case VK_DOWN:
                if (settingActive == 0) {
                    if (epgActive == 0) {
                        if (document.getElementById("timerDiv").style.display == 'none') {
                            if (ShowMenu) {
                                ShowMenu.NextEx();
                            } else {
                                ChanObj.Prev();
                            }
                        } else {
                            var el = $("div.timerActive").attr('id');
                            TIMER.Decrease(el);
                        }
                    } else {
                        $height = $('#EpgFull').css("height").replace("px", "") / -1.25;
                        if ($('.shedule-container').css("marginTop").replace("px", "") > $height) {
                            $('.shedule-container').animate({marginTop: '-=29px'}, 0, function () {
                            });
                        }

                    }
                } else {
                    Setting.ElementNext();
                }
                keyrtn = false;
                break;

            case VK_OK:
                //ok
                if (settingActive == 0) {
                    if (document.getElementById("timerDiv").style.display == 'none') {
                        if (ShowMenu) {
                            CurMenu = ShowMenu;
                            curMenuName = ShowMenu.name;
                            ChanObj.prevNo = ChanObj.currentNo;
                            ChanObj.currentNo = ShowMenu.GetItemId() + 1;
                            ShowMenu.HideEx();
                            ChanObj.Play();
                        } else {
                            MainMenu.Display();
                        }
                    } else {
                        if (TIMER.status == 'off') {
                            TIMER.StartAlarm();
                        } else {
                            TIMER.StopAlarm();
                        }
                    }
                }
                keyrtn = false;
                break;
            case VK_BLUE:
            case VK_EPG:
                x = document.getElementById("EpgFull").style.display;
                if (x == "none") {
                    epgActive = 1;
                    $("#EpgFull").html("<img src=\"./images/ajax_loader.gif\">");
                    document.getElementById("EpgFull").style.display = "block";
                    ChanObj.weekday = null;
                    ChanObj.EpgFull();
                } else {
                    epgActive = 0;
                    document.getElementById("EpgFull").style.display = "none";
                }
                keyrtn = false;
                break;

            case VK_BACK:
                $("#EpgFull").hide();
                ChanObj.Back();
                keyrtn = false;
                break;

            case VK_REFRESH:
                window.location.reload();
                break;

            default:
                if (key > 47 && key < 58) {
                    ChanObj.Keypress(key - 48);
                    keyrtn = false;
                }
                break;
        }
    }
    return keyrtn = false;
}

function VolumeRender(val) {
    var delimetr = 5;
    var vol_max = 100;
    var vol_min = 0;
    var html = "";

    var volBlocks = vol_max / delimetr;
    var $div = $("#Volume");

    for (i = 1; i <= volBlocks; i++) {
        if (val < i * delimetr) {
            html = '<div id="block" class="empty"></div>' + html;
        } else if (val == i * delimetr) {
            html = '<div id="block" class="full">' + val + '</div>' + html;
        } else {
            html = '<div id="block" class="full"></div>' + html;
        }
    }
    html = '<div class="image">+</div>' + html;
    html += '<div class="image">-</div>';
    $div.html(html);
}

//-->