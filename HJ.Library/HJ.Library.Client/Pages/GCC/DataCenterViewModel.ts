///<reference path="../PageBase.ts" />
//import G2 from '../../Scripts/g2.min.js';

module hj.library.pages {    
    declare var G2;
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
            //this.mainVideoContainer().playlist.add("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov");
            //this.mainVideoContainer().playlist.playItem(0);

            setTimeout(() => {
                const data = [
                    { genre: 'Sports', sold: 275 },
                    { genre: 'Strategy', sold: 115 },
                    { genre: 'Action', sold: 120 },
                    { genre: 'Shooter', sold: 350 },
                    { genre: 'Other', sold: 150 },
                ];

                // Step 1: 创建 Chart 对象
                const chart = new G2.Chart({
                    container: 'C1', // 指定图表容器 ID
                    width: 600, // 指定图表宽度
                    height: 300, // 指定图表高度
                });

                // Step 2: 载入数据源
                chart.data(data);

                // Step 3：创建图形语法，绘制柱状图
                chart.interval().position('genre*sold');

                // Step 4: 渲染图表
                chart.render();
            }, 2000);
        }
    }
}