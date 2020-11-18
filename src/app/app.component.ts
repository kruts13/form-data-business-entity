import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as entityMeta from '../assets/entityMeta.json';
import * as entityData from '../assets/entityData.json';
import { genderOptions } from '../app/gender-constants';
import { namePrefixOptions } from '../app/name-prefix-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  businessEntityForm: FormGroup = this.fb.group({});
  originalForm: object = {};
  formulaResults!: object;
  entityMetaArr: any = [];
  entityDataArr: any = [];
  genderOptions = genderOptions;
  namePrefixOptions = namePrefixOptions;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let entityDataObj = JSON.parse(JSON.stringify(entityData));
    for (const eachProp in entityDataObj['default']) {
      this.entityDataArr.push(eachProp);
    }
    entityMeta.field.forEach(each => {
      let dataTypeUpdate;
      let system;
      let dataVal = null;
      if (this.entityDataArr.includes(each.name)) {
        dataVal = entityDataObj['default'][each.name];
      }
      this.businessEntityForm.addControl(each.name, new FormControl(dataVal, Validators.required));

      if (each.dataType === 'String') {
        dataTypeUpdate = 'text';
      } else if (each.dataType === 'Integer') {
        dataTypeUpdate = 'number';
      } else if (each.dataType === 'Decimal') {
        dataTypeUpdate = 'decimal';
      } else if (each.dataType === 'Date') {
        dataTypeUpdate = 'date';
      } else if (each.dataType === 'lookup') {
        dataTypeUpdate = 'select';
      }

      if (each.system === undefined) {
        system = false;
      } else {
        system = each.system;
      }

      const newObj = {
        name: each.name,
        label: each.label,
        dataType: dataTypeUpdate,
        system: system
      }
      this.entityMetaArr.push(newObj);
    });

    this.originalForm = this.businessEntityForm.value;
  }

  saveForm() {
    const finalObj = this.businessEntityForm.value;
    finalObj['$original'] = this.originalForm;
    if (finalObj['birthdate'] !== finalObj['$original']['birthdate'] && finalObj['birthdate'] !== null) {
      finalObj['birthdate'] = finalObj['birthdate'].toISOString();
    }
    finalObj['lastUpdateDate'] = new Date().toISOString();
    finalObj['updatedBy'] = 'John Smith';
    console.log(finalObj);
    alert(JSON.stringify(finalObj));
  }
}
