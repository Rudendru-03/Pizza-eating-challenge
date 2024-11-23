export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  coins: number;
  rank: number;
}

export interface Pizza {
  id: string;
  userId: string;
  timestamp: Date;
}
