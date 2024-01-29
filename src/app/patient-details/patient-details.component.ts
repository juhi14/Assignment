import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { OperationServiceService } from '../operation-service.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patientDetailsArr: any = [];
  isReadonly=false;
  physicianArr: any = [];
  patientObj:any={
    patientName:'',
    patientAge: '',
    prescribedTest:'',
    physicianName:'',
    patientGender:''
  };
  categories = [
    {id: 1, name: 'CBC'},
    {id: 2, name: 'RTC'},
    {id: 3, name: 'Chemistry'}
  ];
  physicianObj:any={
    physicianName:'',
    physicianAge:'',
    physicianSpec:'',
    physicianGender:'',
    physicianQualification:''
  }
  specilizationArr = [
    {id: 1, name: 'General Medicine'},
    {id: 2, name: 'General Physician'},
    {id: 3, name: 'Pediatrics'}
  ];
  selectedSpec:any=[];
  selected = [];
  gender: null;
  buttonValue = 'Add';
  selectedTab='Consulation';
  index: any;
  ctcCount=10;
  rtcCount=30;
  chemistryCount=60;
  ctcPercent: number = 0;;
  rtcPercent: number = 0;
  chemistryPercent: number=0;
  expanded = false;

  constructor(private operationService: OperationServiceService) { }

  ngOnInit(): void {
    setTimeout(()=>{
    this.chartFunc();
    },300);
    this.patientDetailsArr = this.operationService.getDetails('patientDetails');
    this.dynamicGraph();
  }

  //set the value of graph dynamicallly
  dynamicGraph(){
    if(this.patientDetailsArr.length>0){
      this.chemistryCount=0;
      this.ctcCount=0;
      this.rtcCount=0;
      for(let patient of this.patientDetailsArr){
        if(patient.prescribedTest.includes('CBC')){
          ++this.ctcCount;
        }
        if(patient.prescribedTest.includes('RTC')){
          ++this.rtcCount;
        }
        if(patient.prescribedTest.includes('Chemistry')){
          ++this.chemistryCount;
        }
      }
      this.ctcPercent=(this.ctcCount/this.patientDetailsArr.length)*100;
      this.rtcPercent=(this.rtcCount/this.patientDetailsArr.length)*100;
      this.chemistryPercent=(this.chemistryCount/this.patientDetailsArr.length)*100;
    }
  }
  
   //checkbox expand function
  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded = false;
    }
  }

  //piechart display function
  chartFunc(){
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data=[];
    if(this.ctcPercent>0){
      chart.data.push({
        "test": "CBC",
        "percentage": this.ctcPercent
      });
    }
    if(this.rtcPercent>0){
      chart.data.push({
        "test": "RTC",
        "percentage": this.rtcPercent
      });
    }
    if(this.chemistryPercent>0){
      chart.data.push({
        "test": "Chemistry",
        "percentage": this.chemistryPercent
      });
    }
    let title = chart.titles.create();
    title.text = "Test Share";
    title.fontSize = 15;
    title.margin(10,0,0,10);
    title.align = 'left';
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "percentage";
    pieSeries.dataFields.category = "test";
    pieSeries.labels.template.text = "{category}";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("black");
    pieSeries.slices.template.stroke = am4core.color('#1E90FF');
    pieSeries.colors.list = [
      am4core.color("#FFED5F"),
      am4core.color("#6699CC"),
      am4core.color("#3B7A57")
    ];
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.valueLabels.template.disabled = true;
  }

  //Menu/Tab change function
  changeTab(str){
    this.selectedTab = str;
    if(this.selectedTab == 'Consulation'){
      this.dynamicGraph();
      setTimeout(()=>{
        this.chartFunc();
      },300);
      this.patientDetailsArr = this.operationService.getDetails('patientDetails');
    }else{
      this.physicianArr = this.operationService.getDetails('physicianDetails');
    }
  }

  //radio buyttonn selection function
  onChange(iEvent){
    this.patientObj.patientGender = iEvent.target.value;
    this.physicianObj.physicianGender = iEvent.target.value;
  }

  //Adding patient details function
  addPatientDetails(){
    let str='';
    for(let i=0;i<this.selected.length;++i){
      if(this.selected.length == 1) str=this.selected[i].name;
      else if(i == this.selected.length-1) str=str+this.selected[i].name;
      else str= str + this.selected[i].name + ',';
    }
    this.patientObj.prescribedTest = str;
    this.operationService.addDetails(this.patientObj,'patientDetails');
    this.patientDetailsArr = this.operationService.getDetails('patientDetails');
    this.dynamicGraph();
    setTimeout(()=>{
      this.chartFunc();
    },300);
    this.resetDetails();
  }

  //Reset the form data function
  resetDetails(){
    this.selected = [];
    this.gender=null;
    this.patientObj={
      patientName:'',
      patientAge: '',
      prescribedTest:'',
      physicianName:'',
      patientGender:''
    };
    this.selectedSpec=[];
    this.physicianObj={
      physicianName:'',
      physicianAge:'',
      physicianSpec:'',
      physicianGender:'',
      physicianQualification:''
    }
    this.isReadonly =false;
    this.buttonValue='Add';
  }

  //Adding physician detaills
  addPhysicianDetails(){
    this.physicianObj.physicianSpec = this.selectedSpec['name'];
    this.operationService.addDetails(this.physicianObj,'physicianDetails');
    this.physicianArr = this.operationService.getDetails('physicianDetails');
    this.resetDetails();
  }

  //Particular row select of physician table and add the details in form
  selectDetails(obj,index){
    this.physicianObj = obj;
    this.selectedSpec = {id: index+1, name: obj.physicianSpec};
    this.index=index;
    this.buttonValue = 'Update';
    this.isReadonly=true;
  }

  //Update the physician details of selected row
  updatePhysicianDetails(){
    this.physicianObj.physicianSpec = this.selectedSpec['name'];
    this.operationService.updateDetails(this.physicianObj,this.index,'physicianDetails');
    this.resetDetails();
  }

  //To clear the local Storage
  clearLocalStorage(){
    localStorage.clear();
    this.operationService.load();
    this.operationService.physicianLoad();
    this.patientDetailsArr = this.operationService.getDetails('patientDetails');
    this.physicianArr = this.operationService.getDetails('physicianDetails');
    this.ctcPercent=0;
    this.rtcPercent=0;
    this.chemistryPercent=0;
    setTimeout(()=>{
      this.chartFunc();
    },300);
  }
}
