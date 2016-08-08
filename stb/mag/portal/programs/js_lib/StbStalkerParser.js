/* 
 * Connecting to StalkerPortal library
 * Borshchov Dimitriy (grimstal@bigmir.net)
 */

function StalkerParser() {
    this.GenresArrayParser = function (data) {
        var array = [];
        array.push("");
        for (var i = 0; i < data.length; i++) {
            array.push(data[i].id);
        }
        return array;
    };

    this.ChannelsArrayParser = function (data) {
        var array = [];
        
        for (var i = 0; i < data.length; i++) {
            array.push([data[i].id, data[i].name, data[i].xmltv_id]);
        }

        if (array.length == 0) {
            array.push(['0', 'ПУСТО', '-']);
        }
        return array;
    };
}


