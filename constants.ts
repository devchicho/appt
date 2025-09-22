export type Court = {
    Id: number;
    Name: string;
    Type: string;
    CourtTypeId: number;
    OrderIndex: number;
    DisplayName: string;
    IsConflicted: boolean;
    MobileSchedulerId: number | null;
    ComboCourtIds: number[] | null;
    HasComboCourts: boolean;
    ComboCourts: any[]; // or define type if known
    IsCourtAssignmentHiddenOnPortal: boolean;
    IsChecked: boolean;
    IsEligibleForPrimeTime: boolean;
    IsWaitlistEnabled: boolean;
  };

const THIRD_ST_COURTS = [
    {
        "Id": 28262,
        "Name": "209 3rd St - Court #1",
        "Type": "Badminton",
        "CourtTypeId": 7,
        "OrderIndex": 3,
        "DisplayName": "Badminton - 209 3rd St - Court #1",
        "IsConflicted": false,
        "MobileSchedulerId": null,
        "ComboCourtIds": null,
        "HasComboCourts": false,
        "ComboCourts": [],
        "IsCourtAssignmentHiddenOnPortal": false,
        "IsChecked": false,
        "IsEligibleForPrimeTime": false,
        "IsWaitlistEnabled": false
    },
    {
        "Id": 28263,
        "Name": "209 3rd St - Court #2",
        "Type": "Badminton",
        "CourtTypeId": 7,
        "OrderIndex": 4,
        "DisplayName": "Badminton - 209 3rd St - Court #2",
        "IsConflicted": false,
        "MobileSchedulerId": null,
        "ComboCourtIds": null,
        "HasComboCourts": false,
        "ComboCourts": [],
        "IsCourtAssignmentHiddenOnPortal": false,
        "IsChecked": false,
        "IsEligibleForPrimeTime": false,
        "IsWaitlistEnabled": false
    },
    {
        "Id": 28430,
        "Name": "209 3rd St - Court #3",
        "Type": "Badminton",
        "CourtTypeId": 7,
        "OrderIndex": 5,
        "DisplayName": "Badminton - 209 3rd St - Court #3",
        "IsConflicted": false,
        "MobileSchedulerId": null,
        "ComboCourtIds": null,
        "HasComboCourts": false,
        "ComboCourts": [],
        "IsCourtAssignmentHiddenOnPortal": false,
        "IsChecked": false,
        "IsEligibleForPrimeTime": false,
        "IsWaitlistEnabled": false
    }
] as Court[];

export const THIRD_ST_COURTS_IDS = new Set(THIRD_ST_COURTS.map(o => o.Id));
