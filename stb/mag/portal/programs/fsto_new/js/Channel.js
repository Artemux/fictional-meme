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

Channel.Play = function (quality) {

  if(!quality) {
    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.Render();
        Menu.SetActiveItem();
    }
  }else {
    Server.dataReceivedCallback = function () {
        Menu.SetList(Data.getVideoNames());
        Menu.QualityRender();
        Menu.SetActiveItem();
    }
  }

    if(arguments.length > 0){
      var type = this.prev_data_object.type;
      var url = this.prev_data_object.url;
      var parent_id = this.prev_data_object.extended.parent_id;
      var menu_active_item_id = this.prev_data_object.extended.menu_item_id;
    } else{
      var type = Data.getVideoType(Menu.GetItemPos() * (Menu.page + 1));
      var url = Data.getVideoURL(Menu.GetItemId());
      var parent_id = 0;
    }

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
            extended_info.parent_id ? parent_id = extended_info.parent_id : parent_id;
            Server.fetchFiles(url, parent_id, "", quality);
            save_prev_data = true;
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
        if(save_prev_data && quality) {
          this.prev_data_object.extended.menu_item_name = null;
        }
        Channel.prev_data.push(this.prev_data_object);
        this.prev_data_object = null;
    }

    if (!save_prev_data && type == "play_link") {
        var len = this.prev_data.length;
        url = this.prev_data[len - 1].url;
        type = this.prev_data[len - 1].type;
        parent_id = this.prev_data[len - 1].extended.parent_id;
        Channel.prev_data.pop();
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

    else if (save_prev_data) {
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
        //Menu.Render();
        Menu.SetQualities();
        Menu.SetQualityHtml();
        Menu.SetBreadcrumbs();
      //	Menu.RecountPages();
        Menu.SetPage(2);
      	Menu.SetPageHtml();
        Menu.PagePrev();
    //    Menu.SelectLast();

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

    if(Menu.GetQualities().length > 0) {
      var index = Menu.getQualitySwitchCount();
      var len = Channel.prev_data.length;
      var prev_values = Channel.prev_data[(len - index) - 1];
      for(var i = 0; i <= index; i++){
        Channel.prev_data.pop();
      }
    }
    else {
      var prev_values = Channel.prev_data.pop();
    }

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
            Menu.clearRemoved();
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

    var name = Data.getVideoName(itemID);
    var index = name.indexOf("(");
    var fileSize = "";
    if(index != -1) {
      fileSize = name.slice(index);
      name = name.slice(0, index);
    }

    if (type == 'search-folders' && name.length > 35) {
      name = name.slice(0, 35) + "..." + fileSize;
    } else if (name.length > 60) {
      name = name.slice(0, 60) + "..." + fileSize;
    } else if(fileSize){
      name += " " + fileSize;
    }
    // if(type == 'play_link' && name.length > 30) {
    //   name = name.slice(0, 30) + '...';
    // }

    var quality = false;

    image = '<img title="" src="./image/system/' + Channel.GetFileType(Data.getVideoName(itemID)) + '_image.png"/>';
    if (quality = Data.getVideoExtended(itemID).quality) {
        //console.log(Menu.GetQualities()[0]);
        return '<div id="n' + itemID + '" class="unselected ' + type + '">' + image + name + '</div>';
    } else {
        return '<div id="n' + itemID + '" class="unselected ' + type + '">' + image + name + '</div>';
    }
}

Channel.getExtendedData = function(id){
  var itemID = id - 1;
  return Data.getVideoExtended(itemID);
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
