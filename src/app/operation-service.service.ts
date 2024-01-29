import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationServiceService {

  constructor() { 
    this.load();
    this.physicianLoad();
  }

  //Check whether patient table is present or not in localStorage
  load() {
    if(localStorage.getItem('patientDetails') === null || localStorage.getItem('patientDetails') == undefined) {
      console.log('No patientDetails Found... Creating...');
      let patientDetails = [];
      localStorage.setItem('patientDetails', JSON.stringify(patientDetails));
      return 
    }else {
      console.log('Found patientDetails...');
    }
  }

  //Check whether physician table is present or not in localStorage
  physicianLoad(){
    if(localStorage.getItem('physicianDetails') === null || localStorage.getItem('physicianDetails') == undefined) {
      console.log('No physicianDetails Found... Creating...');
      let physicianDetails = [];
      localStorage.setItem('physicianDetails', JSON.stringify(physicianDetails));
      return 
    }else {
      console.log('Found physicianDetails...');
    }
  }

  //To details the details of particular key/table
  getDetails(tableType){
    let details = JSON.parse(localStorage.getItem(tableType));
    return details;
  }

  //To Add the details in particular key/table
  addDetails(newDetails,tableType) {
     let details = JSON.parse(localStorage.getItem(tableType));
     details.push(newDetails);
     localStorage.setItem(tableType, JSON.stringify(details));
  }

  //To Delete the details from particular key/table
  deleteDetails(index,tableType) {
    let details = JSON.parse(localStorage.getItem(tableType));
    for(let i = 0; i <details.length; i++) {
      if(details[i].text == index) {
        details.splice(i, 1);
      }
    }
    localStorage.setItem(tableType, JSON.stringify(details));
  }

  //To Update the details in particular key/table
  updateDetails(newObj,index,tableType){  
      let details = JSON.parse(localStorage.getItem(tableType));
      for(let i = 0; i < details.length; i++) {
      if(i == index) {
        details[i] = newObj;
      }
      localStorage.setItem(tableType, JSON.stringify(details));
    }
  }
}
