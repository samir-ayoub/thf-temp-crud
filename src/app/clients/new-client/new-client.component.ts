import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ThfBreadcrumb } from '@totvs/thf-ui/components/thf-breadcrumb/thf-breadcrumb.interface';
import { ThfCheckboxGroupOption, ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';
import { ThfPageAction } from '@totvs/thf-ui/components/thf-page';

import { ClientsService } from './../services/clients.service';
import { Customer } from './../../shared/customer';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  confirmDelete = false;
  customer: Customer = new Customer();
  pageEditActions: boolean;

  public readonly newUserActions: Array<ThfPageAction> = [
    { label: 'Adicionar Cliente', action: this.addClient.bind(this, this.customer), icon: 'thf-icon-plus' },
    { label: 'Voltar', action: () => this.location.back() }
  ];

  public readonly editUserActions: Array<ThfPageAction> = [
    { label: 'Salvar Cliente', action: this.updateClient.bind(this, this.customer), icon: 'thf-icon-plus' },
    { label: 'Deletar', action: () => this.modalDeleteUser.open() },
    { label: 'Voltar', action: () => this.location.back() }
  ];

  public readonly modalPrimaryAction: ThfModalAction = {
    action: () => this.returnToHome(() => this.formModal.close()),
    label: 'Fechar'
  };

  public readonly editUserBreadcrumb: ThfBreadcrumb = {
    items: [
      { label: 'Clientes', link: '/clients' },
      { label: 'Editar Cliente', link: '/clients/edit-client' }
    ]
  };

  public readonly newUserBreadcrumb: ThfBreadcrumb = {
    items: [
      { label: 'Clientes', link: '/clients' },
      { label: 'Adicionar Cliente', link: '/clients/new-client' }
    ]
  };

  readonly statusOptions: Array<ThfSelectOption> = [
    { label: 'Rebel', value: 'rebel' },
    { label: 'Tattoine', value: 'tatooine' },
    { label: 'Galactic', value: 'galactic' }
  ];

  readonly nationalityOptions: Array<ThfSelectOption> = [
    { label: 'Coruscant', value: 'coruscant' },
    { label: 'Death Star', value: 'deathstar' },
    { label: 'Kamino', value: 'kamino' },
    { label: 'Naboo', value: 'naboo' }
  ];

  public readonly personalityOptions: Array<ThfCheckboxGroupOption> = [
    { value: '1', label: 'Crafter' },
    { value: '2', label: 'Inventor' },
    { value: '3', label: 'Protetor' },
    { value: '4', label: 'Controlador' },
    { value: '5', label: 'Performer' },
    { value: '6', label: 'Idealista' }
  ];

  public readonly confirmDeleteAction: ThfModalAction = {
    action: () => this.onConfirmDelete(), label: 'Deletar'
  };

  public readonly cancelDeleteAction: ThfModalAction = {
    action: () => this.modalDeleteUser.close(), label: 'Cancelar'
  };

  @ViewChild('modalDeleteUser') modalDeleteUser: ThfModalComponent;

  @ViewChild('formModal') formModal: ThfModalComponent;

  constructor(
    private clientsService: ClientsService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public thfNotification: ThfNotificationService
  ) { }

  ngOnInit() {
    this.getClient();
  }

  private addClient(customer: Customer) {
    this.clientsService.addClient(customer);
    this.formModal.open();
  }

  private getClient() {
    const id = this.route.snapshot.paramMap.get('id');
    const result = this.clientsService.getClient(id);
    if (id && result) {
      this.pageEditActions = true;
      result.subscribe(params => {
        this.customer = params;
      });
    }
  }

  private returnToHome(param: Function) {
    this.clientsService.getClients();
    this.router.navigate(['/clients']);
  }

    private updateClient() {
      this.route.params.subscribe(params => {
      this.clientsService.updateClient(this.customer);
      this.router.navigate(['/clients']);
      this.thfNotification.success('Alteração efetuada com sucesso.');
    });
  }

  private onConfirmDelete() {
    this.confirmDelete = true;
    this.modalDeleteUser.close();
    this.deleteClient();
  }

  private deleteClient() {
    this.clientsService.deleteClient(this.customer.id).subscribe(data => {
      this.router.navigate(['/clients']);
      this.thfNotification.success('O usuário foi excluído.');
    });
  }


}
