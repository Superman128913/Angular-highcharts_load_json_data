import { Hours,DataPerHour,RootObject } from './../model/ResponseData';
import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import HC_heatmap from 'highcharts/modules/heatmap';
import { Http, Response } from "@angular/http";

import { map } from 'rxjs/operators';

// import * as data from '../assets/data.json';

const week : any = {
  "Sunday": 6,
  "Monday": 0,
  "Tuesday": 1,
  "Wednesday": 2,
  "Thursday": 3,
  "Friday": 4,
  "Saturday": 5
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
  }

  constructor(private http: HttpClient) {
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
    this.finalData[x * 9 + y] = ([y, 6 - x, val])
  }

  getData(x: any, y: any){
    // console.log([y, 6 - x, val])
    return this.finalData[x * 9 + y][2];
  }


  prepareData(data:any)
  {
    var i,j;
    for ( i = 0 ; i < 7; i++)
    {
      for(j = 0; j < 9; j++)
      {
        this.setData(i, j, 0);
      }
    }
    // let data =this.dataJason;

    let t_dates   = data['dates'];
    
    let len = Object.values(t_dates).length;
    let keys = Object.keys(t_dates)
    
    var i,j;
    var weekly_sum=0;
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
        let val=(hourData['betAmount']);
        let times=new Date(keys[i]+' '+hourkeys[j]).getTime();
        let bftimes=new Date(times);
        let compHour=bftimes.getHours();
        let jj=Math.floor(compHour/3);
        var cur_val=this.getData(ii,jj);
        this.setData(ii,jj,val+cur_val);
        // console.log(ii,jj,val);
        weekly_sum=weekly_sum+val;
      }

    }
    var k,m;
    // alert(weekly_sum);
    for (k=0;k<7;k++)
    {
      var day_sum=0;
      for (m=0;m<9;m++)
      {
        day_sum=day_sum+this.getData(k,m);
      }
      var rating=(day_sum*100/weekly_sum).toFixed(2);
      this.setData(k,8,parseFloat(rating));
    }
    console.log(this.finalData);
    this.updateFlag = true;
  }

  chartOptions: Highcharts.Options = {
    
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
    },

    xAxis: {
      title: {
        text: 'Hour(GMT)'
      },
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
        '%'
      ],
    },
    yAxis: {
      title: {
        text: 'Week Day'
      },
      categories: [
        'Sunday',
        'Saturday',
        'Friday',
        'Thursday',
        'Wednesday',
        'Tuesday',
        'Monday'
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
    // this.prepareData(this.dataJason);
    // this.updateFlag = true;
  }
  
}
