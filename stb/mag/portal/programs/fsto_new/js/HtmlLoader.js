/*
 * @author Vladimir Pavlov kolobokhtc@gmail.com
 */

var HtmlLoader = {
    domain: 'http://fs.to',
    prev_url: '',
    data: 0,
    dataReceivedCallback: null
};

HtmlLoader.Load = function (url, data, callback, add_method, quality) {

    loading = true;

    Popup.Show('Loading...', 'always');

    $.ajax({
        url: this.domain + url,
        data: data,
        dataType: 'html',
        success: function (response) {
            loading = false;
            callback(response, add_method, quality);
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

HtmlLoader.GetFiles = function (url, folder_id, add_method, quality) {
    this.SetPrevURL(url);

    var folder = 0;
    if (folder_id) {
        folder = folder_id;
    }

    var extend_url = "?ajax&download=1&view=1&view_embed=0&blocked=0&folder_quality=null&folder_lang=null&folder_translate=null&folder=" + folder + "&_=1414159926093";


    HtmlLoader.Load(url + extend_url, '', HtmlLoader.ParseFiles, add_method, quality);

}

HtmlLoader.GetSearch = function (data, add_method) {
    //this.SetPrevURL(url);
    HtmlLoader.Load('/search.aspx', 'search=' + data, HtmlLoader.ParseSearch, add_method);

}

HtmlLoader.GetAutoComplete = function (data, add_method) {
    //this.SetPrevURL(url);
    HtmlLoader.Load('/search.aspx', 'search=' + data, HtmlLoader.ParseAutoComplete, add_method);

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

HtmlLoader.SortFiles = function(arr, qualities_length) {
	return arr;
	arr.sort(function(a, b){
		 //var index = a.name.search(/(\(\d+\.\d+\s\w{2}\))/i);
		 a = a.split(' ');
		 a = a.slice(1);
		 a = a[0].replace(/[\(\)]/, '') + a[1].replace(/[\(\)]/, '');

		 //index = b.name.search(/(\(\d+\.\d+\s\w{2}\))/i);
		 b = b.split(' ');
		 b = b.slice(1);
		 b = b[0].replace(/[\(\)]/, '') + b[1].replace(/[\(\)]/, '');
		 if(a.search(/(GB)/) >= 0) {
			 a = parseFloat(a) * 1000;
		 }
		 if(b.search(/(GB)/) >= 0) {
			 b = parseFloat(b) * 1000;
		 }
		 return parseFloat(b) - parseFloat(a);
	});
	var super_arr = [];
	for(var i = 0; i < qualities_length; i++) {
		var len = arr.length;
		var split_arr = arr.splice(0, (len / (qualities_length - i)));
		split_arr.sort(function(a, b){
			 var index = a.search(/(s\d{2}e\d{2})/i);
			 a = a.slice(index+4, index+6);
					 index = b.search(/(s\d{2}e\d{2})/i);
			 b = b.slice(index+4, index+6);
			 return parseInt(a) - parseInt(b);
		});
		super_arr = super_arr.concat(split_arr);
	}
	return super_arr;
}

HtmlLoader.ParseFiles = function (data, add_method, quality_check) {
    var result = [];
    var qualities = [];
    var names = [];

    Popup.Show('Preparing content...', 'always');
    var files = $(data).find("li.b-file-new:not('.m-file-new__material-filename_type_archive')");

    $.each(files, function (i, item) {

        var name = $(item).find('span.b-file-new__link-material-filename-text').text().trim();


        if (name.length <= 0) {

            name = $(item).find('.b-file-new__material-filename').text().trim();

        }

        var quality = $(item).find('span.video-qulaity').text().trim();

        if(qualities.indexOf(quality) == -1) {
          qualities.push(quality);
        }

        if(quality.length <= 0) {
            quality = false;
        }

        var serials = null;
        var className = $(item).attr('class');
        var regexString = /series\-([a-zA-Z0-9]+\-*\d+)/;
        serials = className.match(regexString);
        if(Array.isArray(serials)) {
          serials = serials[1];
        }

        var itemInfo = {
            type: 'play_link',
            name: name + ' (' + $(item).find('span.b-file-new__link-material-size').text().trim() + ')',
            link: HtmlLoader.domain + $(item).find('a.b-file-new__link-material-download').attr('href').trim(),
            extended: {
                quality: quality,
                serials: serials
            }
        }

        // if(quality_check) {
        //   if(itemInfo.extended.quality == quality_check) {
        //     names.push(itemInfo.name);
        //     result.push(itemInfo);
        //   }
        // }else {
        //  names.push(itemInfo.name);
          result.push(itemInfo);
        //}

    });
    // var arr = HtmlLoader.SortFiles(names, qualities.length);
    // var temp = {};
    // for(var i = 0; i < arr.length; i++) {
    //   for(var j = 0; j < result.length; j++) {
    //     if(arr[i] == result[j].name) {
    //       temp.name = result[j].name;
    //       temp.link = result[j].link;
    //       temp.quality = result[j].extended.quality;
    //       result[j].name = result[i].name;
    //       result[i].name = temp.name;
    //       result[j].link = result[i].link;
    //       result[i].link = temp.link;
    //       result[j].extended.quality = result[i].extended.quality;
    //       result[i].extended.quality = temp.quality;
    //     }
    //   }
    // }
    //console.log(result);
    HtmlLoader.ReturnData(result, add_method);

}

HtmlLoader.ParseFolders = function (data, add_method) {

    var result = [];
    $dataJquery = $(data);
    $dataJquery.find('li.folder>ul.filelist').remove();

    Popup.Show('Preparing content...', 'always');

    var folders = $dataJquery.find('li.folder');

    var series_count = $(folders[0]).find('span.material-series-count').text().trim();
    series_count = parseInt(series_count);
    $('#series_count').html(series_count);

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
            name = $(val).find('a.title').text().trim() + ' ' + $(val).find('span.material-details').text().trim() + ' ' + $(val).find('span.material-size').eq(0).text().trim() + ' (' + $(val).find('span.material-series-count').text().trim() + ')';
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

HtmlLoader.ParseAutoComplete = function (data, add_method) {
    var search = $('#search').val();
    var posters = $(data).find('div.b-search-page__results a');
    //var val = posters[0];
    var text = "";
    $.each(posters, function (i, val) {

        text = $(val).find('span.b-search-page__results-item-title').text().trim();
        text = text.slice(0, 1).toLowerCase() + text.slice(1);
        var index = text.indexOf(search);
        if(index === 0) {
          index = text.indexOf("/");
          if(index != -1) {
            text = text.slice(0, index);
          }

          $('.autocomplete').html(text);
        }

    });
    //Server.busy = false;

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
                    'quality': null,
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
