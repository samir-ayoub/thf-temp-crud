import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ThfBreadcrumb } from '@totvs/thf-ui/components/thf-breadcrumb/thf-breadcrumb.interface';
import { ThfPageAction, ThfPageFilter } from '@totvs/thf-ui/components/thf-page';
import { ThfTableAction } from '@totvs/thf-ui/components/thf-table';

import { ClientsService } from './services/clients.service';
import { Customer } from './../shared/customer';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'thf-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  columns: Array<any>;
  disclaimers = [];
  disclaimerGroup;
  items: Array<any>;
  itemsFiltered: Array<any>;
  labelFilter = '';
  toolbarTitle: 'THF-CRUD';

  customerDetail: Array<ThfTableAction> = [
    { action: 'editCustomer', label: 'Editar' },
  ];

  public readonly actions: Array<ThfPageAction> = [
    { label: 'Adicionar Novo Cliente', action: () => this.router.navigate(['/new-client']), icon: 'thf-icon-plus' },
    { label: 'Imprimir', action: this.printPage },
    { label: 'acao', action: this.printPage },
    { label: 'acao2', action: this.printPage }
  ];

  public readonly breadcrumb: ThfBreadcrumb = {
    items: [
      { label: 'Clientes', link: '/clients' }
    ]
  };

  public readonly filterSettings: ThfPageFilter = {
    action: 'filterAction',
    ngModel: 'labelFilter',
    placeholder: 'Search'
  };

  constructor( private clientsService: ClientsService, private router: Router ) { }

  ngOnInit() {
    this.columns = this.clientsService.columns;
    this.getClients();

    this.disclaimerGroup = {
      title: 'Filters',
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this)
    };
  }

  editCustomer(customer: Customer) {
    this.router.navigate(['/edit', customer.id]);
  }

  getClients() {
    this.clientsService.getClients().subscribe(response => {
      this.items = response;
      this.itemsFiltered = [...this.items];
    });
  }

  printPage() {
    alert('Imprimir');
  }

  onChangeDisclaimer(disclaimers) {
    this.disclaimers = disclaimers;
    this.filter();
  }

  filterAction() {
    this.populateDisclaimers([this.labelFilter]);
    this.filter();
  }

  populateDisclaimers(filters: Array<any>) {
    this.disclaimers = filters.map(value => ({ value }));

    if (this.disclaimers && this.disclaimers.length > 0) {
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }

  filter() {
    const filters = this.disclaimers.map(disclaimer => disclaimer.value);
    if (this.itemsFiltered) {
      this.applyFilters(filters);
      if (this.labelFilter === '' || !this.disclaimers.length) {
        this.resetFilterHiringProcess();
      }
    }
  }

  applyFilters(filters) {
    this.itemsFiltered = this.items.filter(item => {
      return Object.keys(item)
      .some(key => (!(item[key] instanceof Object) && this.includeFilter(item[key], filters)));
    });
  }

  includeFilter(item, filters) {
    const result = filters.some(filter => String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    return result;
  }

  resetFilterHiringProcess() {
    this.itemsFiltered = [...this.items];
    this.labelFilter = '';
  }

}
