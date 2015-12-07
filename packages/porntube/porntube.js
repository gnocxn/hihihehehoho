// Write your package code here!
if (Meteor.isServer) {
    Meteor.methods({
        porntube_Search: function (term, page) {
            try {
                var page = page || 0;
                check(term, String);
                var searchUrl = _.template('http://www.porntube.com/search?p=<%=page%>&q=<%=term%>&quality=hd');
                var _term = s.words(term).join('+');
                var rs = Async.runSync(function (done) {
                    var Xray = Meteor.npmRequire('x-ray'),
                        x = Xray();
                    var url = searchUrl({page: page, term: _term});
                    x(url,'#video_list_column', {
                        items : x('div.thumb_video[data-idmodal]',[
                            {
                                id : 'button@data-video-uuid',
                                thumbnail : '.thumb img@data-master',
                                title : '.thumb img@alt',
                                href : 'a@href'
                            }
                        ])
                    })
                    (function (error, data) {
                        if (error) done(error, null);
                        if (data) done(null, data);
                    })
                });
                if (rs.error) {
                    console.log('Error', rs.error);
                    throw new Meteor.Error(rs.error);
                }

                if (rs.result) {
                    return rs.result;
                }
            } catch (ex) {
                throw new Meteor.Error(ex);
            }
        },
        porntube_detail : function(movieUrl){
            try{
                var rs = Async.runSync(function(done){
                    var Xray = Meteor.npmRequire('x-ray'),
                        x = Xray();
                    x(movieUrl,{
                        id : 'button#favoritesBtn@data-video-uuid',
                        title : 'meta[itemprop="name"]@content',
                        poster : 'meta[property="og:image"]@content',
                        tags : ['.tags .list li > a@title'],
                        pornstars : ['ul.list.pornlist li a:not(".thumb-link")@title']
                    })
                    (function(error, data){
                        if (error) done(error, null);
                        if (data) done(null, data);
                    })
                });

                if (rs.error) {
                    console.log('Error', rs.error);
                    throw new Meteor.Error(rs.error);
                }

                if (rs.result) {
                    return rs.result;
                }
            }catch(ex){
                throw new Meteor.Error(ex);
            }
        }
    })
}