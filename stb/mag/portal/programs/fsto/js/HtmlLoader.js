/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */

var HtmlLoader = {
    domain: 'http://fs.to',
    prev_url: '',
    data: 0,
    dataReceivedCallback: null
};

HtmlLoader.Load = function (url, data, callback, add_method) {

    loading = true;

    Popup.Show('Loading...', 'always');
    
    $.ajax({
        url: this.domain + url,
        data: data,
        dataType: 'html',
        success: function (response) {
            loading = false;
            callback(response, add_method);
        }

    });

}

HtmlLoader.GetSubSections = function (url, add_method) {
    this.SetPrevURL(url);
    HtmlLoader.Load(url, null, HtmlLoader.ParseSubSections, add_method);

}

HtmlLoader.GetListSection = function (url, add_method) {
    this.SetPrevURL(url);

    //url += "?view=detailed&page="+Data.getExternalPage();
    url += "?page=" + Data.getExternalPage() + '&sort=new&view=list';

    HtmlLoader.Load(url, '', HtmlLoader.ParseListSection, add_method);

}

HtmlLoader.GetFolders = function (url, folder_id, add_method) {
    this.SetPrevURL(url);

    var folder = 0;
    if (folder_id) {
        folder = folder_id;
    }

    var extend_url = "?ajax&download=1&view=1&view_embed=0&blocked=0&folder_quality=null&folder_lang=null&folder_translate=null&folder=" + folder + "&_=1414159926093";

    HtmlLoader.Load(url + extend_url, '', HtmlLoader.ParseFolders, add_method);

}

HtmlLoader.GetFiles = function (url, folder_id, add_method) {
    this.SetPrevURL(url);

    var folder = 0;
    if (folder_id) {
        folder = folder_id;
    }

    var extend_url = "?ajax&download=1&view=1&view_embed=0&blocked=0&folder_quality=null&folder_lang=null&folder_translate=null&folder=" + folder + "&_=1414159926093";

    HtmlLoader.Load(url + extend_url, '', HtmlLoader.ParseFiles, add_method);

}

HtmlLoader.GetSearch = function (data, add_method) {
    //this.SetPrevURL(url);
    HtmlLoader.Load('/search.aspx', 'search=' + data, HtmlLoader.ParseSearch, add_method);

}

HtmlLoader.ParseSubSections = function (data, add_method) {

    var result = [];

    Popup.Show('Preparing content...', 'always');
    //$('#playlist_block').html($(data).find('.b-header__menu a'));
    var elements = $(data).find('.b-header__menu a');

    $.each(elements, function (i, val) {

        var link = $(val).attr('href');
        var image = null;

        switch (link) {
            case '/video/films/':
                image = "./images/movie-icon.png";
                break;
            case '/video/serials/':
                image = "./images/serials-movie-icon.png";
                break;
            case '/video/cartoons/':
                image = "./images/childrens-icon.png";
                break;
            case '/video/cartoonserials/':
                image = "./images/serials-children-icon.png";
                break;
            case '/video/tvshow/':
                image = "./images/shows-icon.png";
                break;
            case '/video/clips/':
                image = "./images/default-icon.png";
                break;
            default:
                image = "./images/default-icon.png";
                break;
        }


        var itemInfo = {
            'type': 'sub_section',
            'name': $(val).text().trim(),
            'link': $(val).attr('href'),
            'extended': {
                'image': image
            }
        }

        if (link.indexOf('/games') == -1 && link.indexOf('/texts')) {
            result.push(itemInfo);
        }

    })

    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseListSection = function (data, add_method) {

    var result = [];

    Popup.Show('Preparing content...', 'always');

    var posters = $(data).find('.b-poster-tile');

    $.each(posters, function (i, val) {

        qualityImage = null;


        var fsQuality = $(val).find('.b-poster-tile__title-info-qualities .quality').removeClass('quality');
        if ($(fsQuality).hasClass('m-hd')) {
            qualityImage = '<img src="./images/quality-hd.png"/>';
        } else {
            qualityImage = '<img src="./images/quality-sd.png"/>';
        }

        var itemInfo = {
            'type': 'folders',
            'name': qualityImage + $(val).find('.b-poster-tile__title-full').text().trim(),
            'link': $(val).find('.b-poster-tile__link').attr('href'),
            'extended': {
                'image': $(val).find('img').attr('src'),
                'info': $(val).find('.b-poster-tile__title-info-items').text().trim(),
                'vote_positive': $(val).find('.b-poster-tile__title-info-vote-positive').text().trim(),
                'vote_negative': $(val).find('.b-poster-tile__title-info-vote-negative').text().trim(),
                'quailty': $(fsQuality).attr('class'),
            }
        }
        result.push(itemInfo);
    })

    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseListDetailedSection = function (data, add_method) {

    var result = [];

    Popup.Show('Preparing content...', 'always');

    var posters = $(data).find('.b-poster-detail');
    console.log(posters);
    $.each(posters, function (i, val) {
        var itemInfo = {
            'type': 'folders',
            'name': $(val).find('b-poster-detail__title').text().trim(),
            'link': $(val).find('.b-poster-detail__link').attr('href'),
            'extended': {
                'image': $(val).find('.b-poster-detail__image').find('img').attr('src'),
            }
        }
        result.push(itemInfo);
    })

    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseFiles = function (data, add_method) {
    var result = [];

    Popup.Show('Preparing content...', 'always');
    var files = $(data).find("li.b-file-new:not('.m-file-new__material-filename_type_archive')");

    $.each(files, function (i, item) {

        var name = $(item).find('span.b-file-new__link-material-filename-text').text().trim();

        if (name.length <= 0) {

            name = $(item).find('.b-file-new__material-filename').text().trim();

        }

        var itemInfo = {
            type: 'play_link',
            name: name + ' (' + $(item).find('span.b-file-new__link-material-size').text().trim() + ')',
            link: HtmlLoader.domain + $(item).find('a.b-file-new__link-material-download').attr('href').trim(),
            extended: {}
        }
        result.push(itemInfo);

    })
    console.log(result);
    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseFolders = function (data, add_method) {

    var result = [];
    $dataJquery = $(data);
    $dataJquery.find('li.folder>ul.filelist').remove();

    Popup.Show('Preparing content...', 'always');

    var folders = $dataJquery.find('li.folder');

    $.each(folders, function (i, val) {

        var type = '';
        var link = '';
        var name = '';
        var extended = {};

        var file_link = $(val).find('a.folder-filelist').attr('href');
        var file_link_new = $(val).find('a.material-video-quality').attr('href');

        var subfolder_link = $(val).find('.link-simple');

        if (file_link || file_link_new) {
            type = 'files';
            name = $(val).find('a.title').text().trim() + ' ' + $(val).find('span.material-details').text().trim() + ' ' + $(val).find('span.material-size').eq(0).text().trim() + ' (' + $(val).find('span.material-size').eq(1).text().trim() + ')';
        } else if (subfolder_link) {
            type = 'sub_folders';
            name = $(val).find('a.title').text().trim();
        }

        link = HtmlLoader.prev_url;


        var parent_id = $(val).find('a').attr('name').trim().replace(/fl/g, '');

        extended = {
            'parent_id': parent_id,
            'image': './images/folder-icon.png'
        };

        var itemInfo = {
            type: type,
            name: name,
            link: link,
            extended: extended
        }
        result.push(itemInfo);
    })

    //console.log(result);
    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseSearch = function (data, add_method) {

    var result = [];

    Popup.Show('Preparing content...', 'always');

    var posters = $(data).find('div.b-search-page__results a');

    $.each(posters, function (i, val) {

        var item_type = null;

        switch ($(val).data('subsection')) {
            case 'films':
                item_type = 'Фильм';
                break;
            case 'tvshow':
                item_type = 'Телепередача';
                break;
            case 'serials':
                item_type = 'Сериал';
                break;
        }

        var fsQuality = $(val).find('.b-poster-tile__title-info-qualities .quality').removeClass('quality');
        if ($(fsQuality).hasClass('m-hd')) {
            qualityImage = '<img src="./images/quality-hd.png"/>';
        } else {
            qualityImage = '<img src="./images/quality-sd.png"/>';
        }

        if (item_type) {
            var itemInfo = {
                'name': item_type + ': ' + $(val).find('span.b-search-page__results-item-title').text().trim(),
                'image': $(val).find('.b-search-page__results-item-image img').attr('src'),
                'link': $(val).attr('href'),
                'type': 'search-folders',
                'extended': {
                    'image': $(val).find('img').attr('src'),
                    'info': $(val).find('.b-search-page__results-item-genres').text().trim(),
                    'vote_positive': $(val).find('.b-search-page__results-item-rating-positive').text().trim(),
                    'vote_negative': $(val).find('.b-search-page__results-item-rating-negative').text().trim(),
                    'quailty': null,
                }

            }
            result.push(itemInfo);
        }


    })
    console.log(result);
    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ReturnData = function (data, add_method) {

    Popup.Hide();

    if (this.dataReceivedCallback) {

        this.dataReceivedCallback(data, add_method);

    }

}

HtmlLoader.SetPrevURL = function (url) {
    this.prev_url = url;


};