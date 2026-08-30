export interface User {
  id: number;
  ime: string;
  email: string;
  role: 'admin' | 'user'; 
}