export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface LoginScenarioData {
  testCaseId: string;
  scenarioId: string;
  description: string;
  username: string;
  password: string;
  expectedUrlPath: string;
  expectedErrorKey?: string;
  priority: Priority;
  tags: string[];
  enabled: boolean;
}

export interface CheckoutInfoData {
  testCaseId: string;
  scenarioId: string;
  description: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedUrlPath: string;
  expectedErrorKey?: string;
  priority: Priority;
  tags: string[];
  enabled: boolean;
}

export interface ProductSelectionData {
  testCaseId: string;
  scenarioId: string;
  description: string;
  productNames: string[];
  priority: Priority;
  tags: string[];
  enabled: boolean;
}

export interface SortingScenarioData {
  testCaseId: string;
  scenarioId: string;
  description: string;
  sortOption: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)';
  comparator: 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc';
  priority: Priority;
  tags: string[];
  enabled: boolean;
}

export interface ExpectedMessages {
  invalidCredentials: string;
  lockedOutUser: string;
  usernameRequired: string;
  passwordRequired: string;
  firstNameRequired: string;
  lastNameRequired: string;
  postalCodeRequired: string;
  protectedRoute: string;
  orderSuccess: string;
}
