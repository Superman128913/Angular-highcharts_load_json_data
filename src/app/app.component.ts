import { Hours,DataPerHour,RootObject } from './../model/ResponseData';
import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import HC_heatmap from 'highcharts/modules/heatmap';
import { Http, Response } from "@angular/http";

import { map } from 'rxjs/operators';

// import * as data from '../assets/data.json';

const week : any = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6
};

HC_heatmap(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  Highcharts: typeof Highcharts = Highcharts;

  
  public dataJason: any ;
  public finalData :any[][] = [];

  ngOnInit() {
    this.loadData();
    // this.prepareData();
  }

  constructor(private http: HttpClient) {
    // var i,j;
    // for ( i = 0 ; i < 8; i++)
    // {
    //   for(j = 0; j < 7; j++)
    //   {
    //     // this.finalData.push([i,j,i+j*8]);
    //     // this.finalData.push([i,j,0]);
    //     this.setData([i,j,0])
    //   }
    // }
    // var i,j;
    // for ( i = 0 ; i < 7; i++)
    // {
    //   for(j = 0; j < 8; j++)
    //   {
    //     // this.finalData.push([i,j,i+j*8]);
    //     // this.finalData.push([i,j,0]);
    //     this.setData(i, j, i * 8 + j);
    //   }
    // }
    // console.log(this.finalData);
  }
  

  loadData() {
    // console.log(data);
    // this.dataJason = data;
    // this.http
    // .get("assets/data.json").pipe(map(data => data ))
    // .subscribe(data => {
    //   this.dataJason = data.json();
    //   // console.log(data);
    // });
      // .toPromise()
      // .then((res) => res)
      // .then((data) => {
      //   // console.log(data);
      //   this.dataJason=data;
        
      //   console.log(this.dataJason?.currency);
      //   // return (this.dataJason = data);
      // });

      this.http
      .get<RootObject>('assets/data.json')
      .toPromise()
      .then((res) => res)
      .then((data) => {
        {
          this.dataJason=JSON.parse(JSON.stringify(data));
          let prData=this.dataJason;
          this.prepareData(prData);
        }
      });
      
      return ;
  }

  setData(x: any, y: any, val: any){
    // console.log([y, 6 - x, val])
    this.finalData[x * 8 + y] = ([y, 6 - x, val])
  }


  prepareData(data:any)
  {
    var i,j;
    for ( i = 0 ; i < 7; i++)
    {
      for(j = 0; j < 8; j++)
      {
        this.setData(i, j, 0);
      }
    }
    // let data =this.dataJason;

    let t_dates   = data['dates'];
    
    let len = Object.values(t_dates).length;
    let keys = Object.keys(t_dates)
    
    var i,j;
    for (i=0; i<len; i++)
    {
      let Data=t_dates[keys[i]];
      let dayNum=week[Data['dayWeek']];
      var ii=dayNum;
      let hours=Data['hours'];
      
      let cnt=Object.values(hours).length;
      let hourkeys = Object.keys(hours)

      for(j=0;j<cnt;j++)
      {
        let hourData=hours[hourkeys[j]];
        let val=(hourData['hourNumber'])*2;
        let times=new Date(keys[i]+' '+hourkeys[j]).getTime();
        let bftimes=new Date(times);
        let compHour=bftimes.getHours();
        let jj=Math.floor(compHour/3);
        this.setData(ii,jj,val);
      }
    }
    this.updateFlag = true;
  }

  chartOptions: Highcharts.Options = {
    
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
    },

    xAxis: {
      opposite: true,
      categories: [
        '0-3',
        '3-6',
        '6-9',
        '9-12',
        '12-15',
        '15-18',
        '18-21',
        '21-24',
      ],
    },
    yAxis: {
      categories: [
        'Saturday',
        'Friday',
        'Thursday',
        'Wednesday',
        'Tuesday',
        'Monday',
        'Sunday'
      ],
    },

    legend: {
      enabled: false,
    },

    series : 
    [
      {
        name: 'Sales per employee',
        type: 'heatmap',
        borderWidth: 1,
        data: this.finalData,
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }
    ],
   
  };

  updateFlag = false;

  handleUpdate() {
    // console.log(this.updateFlag)
    // console.log(this.finalData[0]);

    // this.prepareData(this.dataJason);
    
    // console.log(this.finalData);
    // // console.log(mydata);

    // this.chartOptions.title =  {
    //   text: 'Updated'
    // };
    
    // // this.chartOptions.series = [
    // //     {
    // //       name: 'Sales per employee',
    // //       type: 'heatmap',
    // //       borderWidth: 1,
    // //       data: this.finalData,
    // //       dataLabels: {
    // //         enabled: true,
    // //         color: '#000000'
    // //       }
    // //     }
    // //   ]
    // this.updateFlag = true;
    // console.log(this.updateFlag)
    // // alert(this.finalData[42]);
  }
  
}
