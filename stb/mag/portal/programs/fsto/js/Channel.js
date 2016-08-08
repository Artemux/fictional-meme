/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */
var Channel =
{
    prev_data: [],
    prev_data_object: null,
    genreList: ["favorites", "", "movies", "news", "educations", "sports", "childrens", "musics", "hdtv", "russia", "ukraine", "odessa", "specials", "shows"],

    genresRus: [{'Name': "Избранные", 'Callback': "Favorites.Load()"},
        {'Name': "Все каналы"},
        {'Name': "Фильмовые"},
        {'Name': "Новостные"},
        {'Name': "Познавательные"},
        {'Name': "Спортивные"},
        {'Name': "Детские"},
        {'Name': "Музыкальные"},
        {'Name': "HDTV"},
        {'Name': "Российские"},
        {'Name': "Украинские"},
        {'Name': "Одесские"},
        {'Name': "International"},
        {'Name': "Развлекательные"}],

    delay: 350,
    delayTm: null
}

Channel.Play = function () {

    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.Render();
        Menu.SetActiveItem();
    }

    var type = Data.getVideoType(Menu.GetItemId());
    var url = Data.getVideoURL(Menu.GetItemId());
    var parent_id = 0;
    var save_prev_data = true;

    switch (type) {
        case 'main_sections':

            if (url.indexOf('audio') > -1){
                HtmlLoader.domain = 'http://brb.to';
            } else {
                HtmlLoader.domain = 'http://fs.to';
            }

            Server.fetchSubSections(url);
            this.prev_data_object = {
                url: url,
                type: type,
                extended: {
                    parent_id: parent_id,
                    menu_item_id: null,
                    menu_item_name: null
                }
            }
            break;
        case 'sub_section':
            Server.fetchListSection(url);
            break;
        case 'folders':
            Server.fetchFolders(url);
            break;
        case 'search-folders':
            Server.fetchFolders(url);
            break;
        case 'sub_folders':
            var extended_info = Data.getVideoExtended(Menu.GetItemId());
            parent_id = extended_info.parent_id;
            Server.fetchFolders(url, extended_info.parent_id);
            break;
        case 'files':
            var extended_info = Data.getVideoExtended(Menu.GetItemId());
            parent_id = extended_info.parent_id;
            Server.fetchFiles(url, parent_id);
            save_prev_data = false;
            //Server.fetchFiles(url);
            break;
        case 'play_link':
            var extended_info = Data.getVideoExtended(Menu.GetItemId());
            parent_id = extended_info.parent_id;
            VODPlay(Data.getVideoURL(Menu.GetItemId()), '', true);
            $('#chanInfo .chan-name').html(Data.getVideoName(Menu.GetItemId()));
            save_prev_data = false;
            break;
    }

    if (this.prev_data_object) {
        this.prev_data_object.extended.menu_item_id = Menu.GetItemId();
        this.prev_data_object.extended.menu_item_name = Data.getVideoName(Menu.GetItemId());

        Channel.prev_data.push(this.prev_data_object);
        this.prev_data_object = null;
    }

    if (save_prev_data) {
        this.prev_data_object = {
            url: url,
            type: type,
            extended: {
                parent_id: parent_id,
                menu_item_id: null,
                menu_item_name: null
            }
        }
    }

    return true;
}

Channel.nextExternalPage = function () {
    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.Render();
    }
    url = Channel.prev_data_object.url;
    Server.fetchListSection(url);
}

Channel.prevExternalPage = function () {
    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.Render();
        Menu.PageNext();
        Menu.SelectLast();

    }
    url = Channel.prev_data_object.url;
    Server.fetchListSection(url);
}

Channel.Prev = function () {

    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.Render();
        Menu.SetActiveItem();
    }

    var prev_values = Channel.prev_data.pop();

    if (!prev_values) {
        var StartupMenuData = [];
        StartupMenuData.push({type: 'main_sections', name: "Видео", link: '/video/', extended: {'image': './images/movies-icon.png'}});
        StartupMenuData.push({type: 'main_sections', name: "Аудио", link: '/audio/', extended: {'image': './images/music-icon.png'}});

        Server.createVideoList(StartupMenuData);
        return;
    }

    console.log('after prev button object');
    console.log(prev_values);

    var type = prev_values.type;
    var url = prev_values.url;
    var parent_id = prev_values.extended.parent_id;
    var menu_active_item_id = prev_values.extended.menu_item_id;
    var save_prev_data = true;

    if (menu_active_item_id) {
        Menu.SetSavedActiveItemID(menu_active_item_id);
    }

    switch (type) {
        case 'main_sections':
            Server.fetchSubSections(url);
            break;
        case 'sub_section':
            Server.fetchListSection(url);
            break;
        case 'folders':
            Server.fetchFolders(url);
            break;
        case 'search-folders':
            Server.fetchFolders(url);
            break;
        case 'sub_folders':
            Server.fetchFolders(url, parent_id);
            break;
        case 'files':
            Server.fetchFiles(url, parent_id);
            break;
        case 'search':
            Server.fetchSearch(url);
            break;
    }

    if (save_prev_data) {
        this.prev_data_object = {
            url: url,
            type: type,
            extended: {
                parent_id: parent_id,
                menu_item_id: null,
                menu_item_name: null
            }
        }
    }
}
Channel.Stop = function () {
    //Player.stopVideo();
}

Channel.Search = function (search_text) {
    this.prev_data_object = {
        url: search_text,
        type: 'search',
        extended: {
            parent_id: null,
            menu_item_id: null,
            menu_item_name: null
        }
    }
    Server.fetchSearch(search_text);
}

Channel.GetContainer = function (id) {
    var itemID = id - 1;

    var type = Data.getVideoType(itemID);

    image = '<img title="" src="./image/system/' + Channel.GetFileType(Data.getVideoName(itemID)) + '_image.png"/>';
    return '<div id="n' + itemID + '" class="unselected ' + type + '">' + image + Data.getVideoName(itemID) + '</div>';
}
Channel.GetDetails = function (id) {
    var itemID = id - 1;
    return '<div><img src="' + Data.getVideoImage(itemID) + '"><div class="poster-text">' + Data.getVideoName(itemID) + '</div></div>';

}
Channel.ShowCurrentProgram = function () {
    return false;
}

Channel.ShowProgram = function () {
    return false;
}
Channel.GetFileType = function (filename) {
    //console.log(filename);
    var image_pat = /(?:\.jpg|\.jpeg)/;
    var music_pat = /(?:\.wav|\.mp3)/;
    var video_pat = /(?:\.mkv|\.mov|\.mpg|\.avi|\.ts|\.mp4)/;
    var fileType = 'folder';

    if (filename.toLowerCase().search(image_pat) != -1) {
        fileType = 'photo';
    } else if (filename.toLowerCase().search(video_pat) != -1) {
        fileType = 'film';
    } else if (filename.toLowerCase().search(music_pat) != -1) {
        fileType = 'music';
    } else {
        fileType = 'folder';
    }
    return fileType;
}