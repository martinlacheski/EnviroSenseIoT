export interface Usuario {
    _id: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    enabled: boolean;
    is_admin: boolean;
  }
