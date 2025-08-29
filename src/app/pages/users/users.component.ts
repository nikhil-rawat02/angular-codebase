import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import {
  allStringValidator,
  mobileNumberValidator,
  noSpacesValidator,
  customEmailValidator,
} from '../../core/validators/global.validators';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableComponent,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any = signal([]);
  currentPage = 1;
  total = 0;
  length: number = 10;
  searchTerm: string = '';
  loading: boolean = false;
  eloading: boolean = false;
  isModalOpen: boolean = false;
  selectedUser: any;
  action: string = '';
  reason: string = '';
  isReasonError: boolean = false;
  userRole: string = '';

  createForm!: FormGroup;

  get name() {
    return this.createForm.get('name');
  }
  get msisdn() {
    return this.createForm.get('msisdn');
  }
  // get password() { return this.createForm.get("password"); }
  // get confirmPassword() { return this.createForm.get("confirmPassword"); }
  get emailId() {
    return this.createForm.get('emailId');
  }

  constructor(private appService: AppService, private toastr: ToastrService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userRole = decodedToken?.role;
    }

    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required, allStringValidator()]),
      msisdn: new FormControl('', [
        Validators.required,
        // mobileNumberValidator(),
      ]),
      // password: new FormControl('', [Validators.required, strongPasswordValidator()]),
      // confirmPassword: new FormControl('', [Validators.required, matchValidator('password')]),
      emailId: new FormControl('', [
        noSpacesValidator(),
        customEmailValidator(),
      ]),
    });

    this.fetchUsers();
  }

  // Fetch Agents List
  fetchUsers() {
    const FILTER: {
      page: number;
      size: number;
      status?: string;
      roleName?: string;
    } = {
      page: 0,
      size: 10,
    };

    this.loading = true;
    this.appService.fetchUsers(FILTER).subscribe({
      next: (res) => {
        this.loading = false;
        this.users.set(res?.data?.content);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error?.message, 'Error');
      },
    });
  }

  // Create User
  createUser = () => {
    if (this.createForm.valid) {
      const REQ: {
        fullName: string;
        msisdn: string;
        email: string;
      } = {
        fullName: this.name?.value,
        msisdn: this.msisdn?.value,
        email: this.emailId?.value,
      };

      this.loading = true;
      this.appService.createUser(REQ).subscribe({
        next: (res) => {
          if (res.result === 'SUCCESS') {
            this.loading = false;
            this.toastr.success('User created successfully', 'Success');
            this.fetchUsers();
            this.closeModal();
            this.isModalOpen = true;
            this.action = 'SUCCESS';
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error(error?.message, 'Error');
        },
      });
    } else {
      this.createForm.markAllAsTouched();
    }
  };

  deleteUser = () => {
    this.eloading = true;
    this.appService.deleteUser(this.selectedUser.id).subscribe({
      next: (res) => {
        this.eloading = false;
        this.fetchUsers();
        this.selectedUser = null;
        this.isModalOpen = false;
        this.action = '';
        if (res.result === 'SUCCESS') {
          this.toastr.success('User deleted successfully', 'Success');
        } else {
          this.toastr.error(res?.message, 'Error');
        }
      },
      error: (error) => {
        this.eloading = false;
        this.toastr.error(error?.message, 'Error');
      },
    });
  };

  // Create User
  updateUser = () => {
    if (this.createForm.valid) {
      const REQ: {
        id: number;
        fullName: string;
        msisdn: string;
        email: string;
      } = {
        id: this.selectedUser.id,
        fullName: this.name?.value,
        msisdn: this.msisdn?.value,
        email: this.emailId?.value,
      };

      this.loading = true;
      this.appService.updateUser(REQ).subscribe({
        next: (res) => {
          if (res.result === 'SUCCESS') {
            this.loading = false;
            this.toastr.success('User updated successfully', 'Success');
            this.fetchUsers();
            this.closeModal();
            this.isModalOpen = true;
            this.action = 'SUCCESS';
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error(error?.message, 'Error');
        },
      });
    } else {
      this.createForm.markAllAsTouched();
    }
  };

  patchForm(user: any) {
    this.createForm.patchValue({
      name: user.fullName,
      emailId: user.email,
      msisdn: user.msisdn,
    });
  }

  // Actions
  onEdit(user: any) {
    this.action = 'EDIT';
    this.isModalOpen = true;
    this.selectedUser = user;

    this.patchForm(user);
  }

  onDelete(user: any) {
    this.action = 'DELETE';
    this.isModalOpen = true;
    this.selectedUser = user;
  }

  onApprove(agent: any) {
    this.action = 'APPROVE';
    this.selectedUser = agent;
    this.isModalOpen = true;
  }

  onReject(agent: any) {
    this.action = 'REJECT';
    this.selectedUser = agent;
    this.isModalOpen = true;
  }

  onUnblock(agent: any) {
    this.isModalOpen = true;
    this.selectedUser = agent;
  }

  // // Unblock Agent (Note: Agent is blocked after 5 failed login attempts by agent)
  // unblockAgent = () => {
  //   try {
  //     const REQ: { id: number } = {
  //       id: this.selectedUser.id,
  //     };
  //     this.appService.unblockAgent(REQ).subscribe({
  //       next: (res) => {
  //         this.toastr.success('Agent unblocked successfully', 'Success');
  //         this.selectedUser = null;
  //         this.closeModal();
  //         this.fetchUsers();
  //       },
  //       error: (error) => {
  //         this.toastr.error(error, 'Error');
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // getDate(date: any) {
  //   return new Date(date).toLocaleString();
  // }

  // // Event Handlers
  // handleApprove = () => {
  //   try {
  //     this.isModalOpen = false;
  //     this.appService.approveAgent(this.selectedUser.id).subscribe({
  //       next: (res) => {
  //         if (res.result === 'ok') {
  //           this.fetchUsers();
  //           this.closeModal();
  //           this.toastr.success(
  //             `${this.selectedUser.name} approved successfully`,
  //             'Success'
  //           );
  //         }
  //       },
  //       error: (error) => {
  //         this.toastr.error('Something went wrong!', 'Error');
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // handleReject = () => {
  //   if (this.reason) {
  //     try {
  //       this.isModalOpen = false;
  //       const REQ: { id: number; reason: string } = {
  //         id: this.selectedUser.id,
  //         reason: this.reason,
  //       };

  //       this.appService.rejectAgent(REQ).subscribe({
  //         next: (res) => {
  //           if (res.result === 'ok') {
  //             this.fetchUsers();
  //             this.closeModal();
  //             this.toastr.success(
  //               `${this.selectedUser.name} rejected successfully`,
  //               'Success'
  //             );
  //           }
  //         },
  //         error: (error) => {
  //           this.toastr.error('Something went wrong!', 'Error');
  //         },
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     this.isReasonError = true;
  //   }
  // };

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.fetchUsers();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.fetchUsers();
  }

  openModal() {
    this.action = 'CREATE';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.action = '';
    this.createForm.reset();
  }
}
