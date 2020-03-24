///<reference path="../PageBase.ts" />
//import G2 from '../../Scripts/g2.min.js';

module hj.library.pages {
    declare var Chart;
    declare var qq;
    export class DataCenterViewModel extends PageBase {
        private isC1Loaded = ko.observable(false);
        private isMainVideoContainerLoaded = ko.observable(false);
        private mainVideoContainer: KnockoutObservable<any> = ko.observable({});

        constructor() {
            super();
            this.templateId = gcc.DataCenterViewId;
            this.title("Data Center");

            this.isMainVideoContainerLoaded.subscribe(newValue => {
                this.prepareData();
            });
            //setTimeout(this.prepareData, 2000);
        }

        private toggleVideo = () => {
            if (this.mainVideoContainer().playlist.items.count == 1) {
                this.mainVideoContainer().playlist.add("http://localhost/ElasticSearch.mp4");
                this.mainVideoContainer().playlist.playItem(1);
            }
            else {
                this.mainVideoContainer().playlist.playItem(this.mainVideoContainer().playlist.currentItem == 1 ? 0 : 1);
            }
        }

        private prepareData() {
            // By the code below, dynamically set video width and height
            //$(this.mainVideoContainer()).width(500).height(300);
            // https://wiki.videolan.org/Documentation:WebPlugin/#Playlist_items_object
            // By link above, can use playlist to implement (轮播, 自己写方法切换playitem index), 
            // Can also clear playlist to play another video
            this.mainVideoContainer().playlist.add("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov");
            this.mainVideoContainer().playlist.playItem(0);

            var ctx = document.getElementById('myChart');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            var map = new qq.maps.Map(
                document.getElementById("mapContainer"),
                {
                    center: new qq.maps.LatLng(34.766670, 113.67000),
                    zoom: 13
                });

            var marker = new qq.maps.Marker({
                position: new qq.maps.LatLng(34.753803, 113.661693),
                map: map
            });

            var info = new qq.maps.InfoWindow({ map: map });

            qq.maps.event.addListener(marker, 'click', () => {
                info.open();
                info.setContent(`<embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" 
                                    src= "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov"
                                   width= "640"
                                   height= "480"
                                   id= "vlcin" />`);
                info.setPosition(new qq.maps.LatLng(34.753803, 113.661693)); 
            });

            // info里面的内容并没有真正remove掉，所以添加这个事件来处理
            qq.maps.event.addListener(info, 'closeclick', function () {                
                info.setContent('');
                //info.destroy();//没有destory 方法，webgl版本里面才有

                //即使上面set to empty了，这个元素还在，还是要手动用jquery找到并remove掉
                $("embed#vlcin").remove();
            });
        };
    }
}