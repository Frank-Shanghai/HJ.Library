///<reference path="../PageBase.ts" />
//import G2 from '../../Scripts/g2.min.js';

module hj.library.pages {    
    declare var Chart;
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
            }, 2000);
        }
    }
}