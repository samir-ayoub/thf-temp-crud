import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ThfBreadcrumb } from '@totvs/thf-ui/components/thf-breadcrumb/thf-breadcrumb.interface';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';
import { ThfPageAction } from '@totvs/thf-ui/components/thf-page';

import { ClientsService } from '../services/clients.service';
import { Customer } from './../../shared/customer';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  confirmDelete = false;
  customer: Customer = new Customer();

  @ViewChild('modalDeleteUser') modalDeleteUser: ThfModalComponent;

  public readonly breadcrumb: ThfBreadcrumb = {
    items: [
      { label: 'Clientes', link: '/clients' },
      { label: 'Editar Cliente', link: '/clients/edit-client' }
    ]
  };

  public readonly editUserActions: Array<ThfPageAction> = [
    { label: 'Salvar Cliente', action: this.updateClient.bind(this, this.customer), icon: 'thf-icon-plus' },
    { label: 'Deletar', action: () => this.modalDeleteUser.open() },
    { label: 'Voltar', action: () => this.location.back() }
  ];

  public readonly confirmDeleteAction: ThfModalAction = {
    action: () => this.onConfirmDelete(), label: 'Deletar'
  };

  public readonly cancelDeleteAction: ThfModalAction = {
    action: () => this.modalDeleteUser.close(), label: 'Cancelar'
  };

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

  private deleteClient() {
    this.clientsService.deleteClient(this.customer.id).subscribe(data => {
      this.router.navigate(['/clients']);
      this.thfNotification.success('O usuário foi excluído.');
    });
  }

  private getClient() {
    const id = this.route.snapshot.paramMap.get('id');
    const result = this.clientsService.getClient(id);
    if (result) {
      result.subscribe(params => {
        this.customer = params;
      });
    }
  }

  private onConfirmDelete() {
    this.confirmDelete = true;
    this.modalDeleteUser.close();
    this.deleteClient();
  }

  private updateClient() {
      this.route.params.subscribe(params => {
      this.clientsService.updateClient(this.customer);
      this.router.navigate(['/clients']);
      this.thfNotification.success('Alteração efetuada com sucesso.');
    });
  }

}
