export interface SignupUser {
    id:number;
    fullname: string;
    username: string;
    email: string;
    password: string;
    role:string;
    isactive:string;
  }
  
  export interface LoginUser {
    email: string;
    password: string;
  }