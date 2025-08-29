import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'verify-otp',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/auth/verify-otp/verify-otp.component').then(
        (m) => m.VerifyOtpComponent
      ),
  },
  {
    path: 'reset-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      ///////////////
      // Admission //
      ///////////////
      {
        path: 'admission',
        canActivate: [authGuard],
        children: [
          {
            path: 'new-registration',
            loadComponent: () =>
              import(
                './pages/admission/new-registration/new-registration.component'
              ).then((m) => m.NewRegistrationComponent),
          },
          {
            path: 'registered-students',
            loadComponent: () =>
              import(
                './pages/admission/registered-students/registered-students.component'
              ).then((m) => m.RegisteredStudentsComponent),
            children: [
              {
                path: 'details/:id',
                loadComponent: () =>
                  import(
                    './pages/admission/registered-students/pages/student-details/student-details.component'
                  ).then((m) => m.StudentDetailsComponent),
              },
            ],
          },
          {
            path: 'pending-students',
            loadComponent: () =>
              import(
                './pages/admission/pending-students/pending-students.component'
              ).then((m) => m.PendingStudentsComponent),
              children: [
              {
                path: 'details/:id',
                loadComponent: () =>
                  import(
                    './pages/admission/registered-students/pages/student-details/student-details.component'
                  ).then((m) => m.StudentDetailsComponent),
              },
            ],
          },
          {
            path: 'entry-students',
            loadComponent: () =>
              import(
                './pages/admission/entry-students/entry-students.component'
              ).then((m) => m.EntryStudentsComponent),
              children: [
              {
                path: 'details/:id',
                loadComponent: () =>
                  import(
                    './pages/admission/registered-students/pages/student-details/student-details.component'
                  ).then((m) => m.StudentDetailsComponent),
              },
            ],
          },
          {
            path: 'transferred-students',
            loadComponent: () =>
              import(
                './pages/admission/transferred-students/transferred-students.component'
              ).then((m) => m.TransferredStudentsComponent),
          },
          {
            path: 'upgrading-students',
            loadComponent: () =>
              import(
                './pages/admission/upgrading-students/upgrading-students.component'
              ).then((m) => m.UpgradingStudentsComponent),
          },
          {
            path: 'assign-section',
            loadComponent: () =>
              import(
                './pages/admission/assign-section/assign-section.component'
              ).then((m) => m.AssignSectionComponent),
          },
          {
            path: 'crash-add',
            loadComponent: () =>
              import(
                './pages/admission/crash-add/crash-add.component'
              ).then((m) => m.CrashAddComponent),
            children: [
              {
                path: 'assign-instructor',
                loadComponent: () =>
                  import(
                    './pages/admission/crash-add/pages/assign-crash-instructor/assign-crash-instructor.component'
                  ).then((m) => m.AssignCrashInstructorComponent),
              },
            ],
          },
          {
            path: 'bulk-photo',
            loadComponent: () =>
              import('./pages/admission/bulk-photo/bulk-photo.component').then(
                (m) => m.BulkPhotoComponent
              ),
          },
          {
            path: 'bulk-data',
            loadComponent: () =>
              import('./pages/admission/bulk-data/bulk-data.component').then(
                (m) => m.BulkDataComponent
              ),
          },
          {
            path: 'bulk-remove',
            loadComponent: () =>
              import(
                './pages/admission/bulk-remove-students/bulk-remove-students.component'
              ).then((m) => m.BulkRemoveStudentsComponent),
          },
          {
            path: 'manage-courses',
            loadComponent: () =>
              import(
                './pages/admission/add-drop-courses/add-drop-courses.component'
              ).then((m) => m.AddDropCoursesComponent),
          },
        ],
      },

      ///////////////
      // Academics //
      ///////////////
      {
        path: 'academics',
        canActivate: [authGuard],
        children: [
          {
            path: 'faculty',
            loadComponent: () =>
              import('./pages/academics/faculty/faculty.component').then(
                (m) => m.FacultyComponent
              ),
          },
          {
            path: 'academic-year',
            loadComponent: () =>
              import(
                './pages/academics/academic-year/academic-year.component'
              ).then((m) => m.AcademicYearComponent),
          },
          {
            path: 'department',
            loadComponent: () =>
              import('./pages/academics/department/department.component').then(
                (m) => m.DepartmentComponent
              ),
          },
          {
            path: 'course',
            loadComponent: () =>
              import(
                './pages/academics/course-breakdown/course-breakdown.component'
              ).then((m) => m.CourseBreakdownComponent),
          },
          {
            path: 'batch',
            loadComponent: () =>
              import('./pages/academics/batch/batch.component').then(
                (m) => m.BatchComponent
              ),
          },
          {
            path: 'semester',
            loadComponent: () =>
              import('./pages/academics/semester/semester.component').then(
                (m) => m.SemesterComponent
              ),
          },
          {
            path: 'shift',
            loadComponent: () =>
              import('./pages/academics/shift/shift.component').then(
                (m) => m.ShiftComponent
              ),
          },
          {
            path: 'section',
            loadComponent: () =>
              import('./pages/academics/section/section.component').then(
                (m) => m.SectionComponent
              ),
          },
          {
            path: 'course-offering',
            loadComponent: () =>
              import(
                './pages/academics/course-offering/course-offering.component'
              ).then((m) => m.CourseOfferingComponent),
          },
          {
            path: 'academic-calender',
            loadComponent: () =>
              import(
                './pages/academics/academic-calender/academic-calender.component'
              ).then((m) => m.AcademicCalenderComponent),
          },
        ],
      },

      ///////////////
      // Instructor /
      ///////////////
      {
        path: 'instructor',
        // canActivate: [authGuard],
        children: [
          {
            path: 'instructor-load',
            loadComponent: () =>
              import(
                './pages/instructor/instructor-load/instructor-load.component'
              ).then((m) => m.InstructorLoadComponent),
          },
          {
            path: 'attendance',
            loadComponent: () =>
              import('./pages/instructor/attendance/attendance.component').then(
                (m) => m.AttendanceComponent
              ),
          },
        ],
      },

      ////////////////
      // Examination /
      ////////////////
      {
        path: 'examination',
        // canActivate: [authGuard],
        children: [
          {
            path: 'manage-exam',
            loadComponent: () =>
              import(
                './pages/examination/manage-exam/manage-exam.component'
              ).then((m) => m.ManageExamComponent),
          },
          {
            path: 'manage-date-sheet',
            loadComponent: () =>
              import(
                './pages/examination/manage-date-sheet/manage-date-sheet.component'
              ).then((m) => m.ManageDateSheetComponent),
          },
          {
            path: 'seating-arrangement',
            loadComponent: () =>
              import(
                './pages/examination/seating-arrangement/seating-arrangement.component'
              ).then((m) => m.SeatingArrangementComponent),
          },
        ],
      },

      ////////////
      // Result //
      ////////////
      {
        path: 'result',
        // canActivate: [authGuard],
        children: [
          {
            path: 'manage-result',
            loadComponent: () =>
              import(
                './pages/result/manage-result/manage-result.component'
              ).then((m) => m.ManageResultComponent),
          },
          {
            path: 'hold-result',
            loadComponent: () =>
              import(
                './pages/result/hold-result/hold-result.component'
              ).then((m) => m.HoldResultComponent),
          },
          {
            path: 'active-result',
            loadComponent: () =>
              import(
                './pages/result/active-result/active-result.component'
              ).then((m) => m.ActiveResultComponent),
          },
          {
            path: 'student-result',
            loadComponent: () =>
              import(
                './pages/result/student-semester-result/student-semester-result.component'
              ).then((m) => m.StudentSemesterResultComponent),
          },
          {
            path: 'assign-marks',
            loadComponent: () =>
              import(
                './pages/result/assign-marks/assign-marks.component'
              ).then((m) => m.AssignMarksComponent),
          },
        ],
      },

      /////////////
      // Campus ///
      /////////////
      {
        path: 'campus',
        // canActivate: [authGuard],
        children: [
          {
            path: 'view-campus',
            loadComponent: () =>
              import('./pages/campus/view-campus/view-campus.component').then(
                (m) => m.ViewCampusComponent
              ),
          },
          {
            path: 'classroom',
            loadComponent: () =>
              import('./pages/campus/class-rooms/class-rooms.component').then(
                (m) => m.ClassRoomsComponent
              ),
          },
        ],
      },

      ///////////////
      // Payment ////
      ///////////////
      {
        path: 'payment',
        // canActivate: [authGuard],
        children: [
          {
            path: 'registration-fees',
            loadComponent: () =>
              import(
                './pages/payment/registration-fees/registration-fees.component'
              ).then((m) => m.RegistrationFeesComponent),
          },
          {
            path: 'offline-fees',
            loadComponent: () =>
              import('./pages/payment/collect-offline-fees/collect-offline-fees.component').then(
                (m) => m.CollectOfflineFeesComponent
              ),
          },
          {
            path: 'quick-pay',
            loadComponent: () =>
              import('./pages/payment/quick-assign-fees/quick-assign-fees.component').then(
                (m) => m.QuickAssignFeesComponent
              ),
          },
          {
            path: 'student-wallet',
            loadComponent: () =>
              import('./pages/payment/student-wallet/student-wallet.component').then(
                (m) => m.StudentWalletComponent
              ),
          },
          {
            path: 'scholarship',
            loadComponent: () =>
              import('./pages/payment/scholarship/scholarship.component').then(
                (m) => m.ScholarshipComponent
              ),
          },
        ],
      },

      ////////////////
      // Fee Config //
      ////////////////
      {
        path: 'fee-config',
        // canActivate: [authGuard],
        children: [
          {
            path: 'fee-type',
            loadComponent: () =>
              import(
                './pages/fee-configuration/fee-type/fee-type.component'
              ).then((m) => m.FeeTypeComponent),
          },
          {
            path: 'fee-detail',
            loadComponent: () =>
              import(
                './pages/fee-configuration/fee-detail/fee-detail.component'
              ).then((m) => m.FeeDetailComponent),
          }
        ],
      },

      ///////////////
      // Reports ////
      ///////////////
      {
        path: 'reports',
        // canActivate: [authGuard],
        children: [
          {
            path: 'student-ledger/:id',
            loadComponent: () =>
              import(
                './pages/reports/student-ledger/student-ledger.component'
              ).then((m) => m.StudentLedgerComponent),
          },
          {
            path: 'student-balance/:id',
            loadComponent: () =>
              import(
                './pages/reports/student-balance/student-balance.component'
              ).then((m) => m.StudentBalanceComponent),
          },
          {
            path: 'audit-history/:id',
            loadComponent: () =>
              import(
                './pages/reports/audit-history/audit-history.component'
              ).then((m) => m.AuditHistoryComponent),
          },

          {
            path: 'transactions',
            loadComponent: () =>
              import(
                './pages/reports/transaction-list/transaction-list.component'
              ).then((m) => m.TransactionListComponent),
          },
          {
            path: 'department-balance',
            loadComponent: () =>
              import(
                './pages/reports/department-balance/department-balance.component'
              ).then((m) => m.DepartmentBalanceComponent),
          },
          {
            path: 'rv-by-books',
            loadComponent: () =>
              import(
                './pages/reports/rv-by-books/rv-by-books.component'
              ).then((m) => m.RvByBooksComponent),
          },
          {
            path: 'scholarship',
            loadComponent: () =>
              import(
                './pages/reports/scholarship-reports/scholarship-reports.component'
              ).then((m) => m.ScholarshipReportsComponent),
          },
          {
            path: 'student-admission-report',
            loadComponent: () =>
              import(
                './pages/reports/student-admission-report/student-admission-report.component'
              ).then((m) => m.StudentAdmissionReportComponent),
          },
          {
            path: 'student-wallet-report',
            loadComponent: () =>
              import(
                './pages/reports/student-wallet-report/student-wallet-report.component'
              ).then((m) => m.StudentWalletReportComponent),
          },
          {
            path: 'monthly-income-report',
            loadComponent: () =>
              import(
                './pages/reports/monthly-income-report/monthly-income-report.component'
              ).then((m) => m.MonthlyIncomeReportComponent),
          },
          {
            path: 'department-student-balance',
            loadComponent: () =>
              import(
                './pages/reports/department-student-balance/department-student-balance.component'
              ).then((m) => m.DepartmentStudentBalanceComponent),
          },
          {
            path: 'audit-report',
            loadComponent: () =>
              import(
                './pages/reports/audit-report/audit-report.component'
              ).then((m) => m.AuditReportComponent),
          },
        ],
      },

      /////////////////////
      // Role Management //
      /////////////////////
      {
        path: 'role',
        // canActivate: [authGuard],
        children: [
          {
            path: 'create-new-staff',
            loadComponent: () =>
              import(
                './pages/role-management/create-new-staff/create-new-staff.component'
              ).then((m) => m.CreateNewStaffComponent),
          },
          {
            path: 'manage-staff',
            loadComponent: () =>
              import(
                './pages/role-management/manage-staff/manage-staff.component'
              ).then((m) => m.ManageStaffComponent),
          },
          {
            path: 'remove-staff',
            loadComponent: () =>
              import(
                './pages/role-management/bulk-remove-staff/bulk-remove-staff.component'
              ).then((m) => m.BulkRemoveStaffComponent),
          },
          {
            path: 'assign-roles',
            loadComponent: () =>
              import(
                './pages/role-management/assign-roles/assign-roles.component'
              ).then((m) => m.AssignRolesComponent),
          },
          {
            path: 'unblock-user',
            loadComponent: () =>
              import(
                './pages/role-management/unblock-user/unblock-user.component'
              ).then((m) => m.UnblockUserComponent),
          }
        ],
      },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
