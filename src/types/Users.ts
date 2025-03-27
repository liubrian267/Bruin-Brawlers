
//to avoid aliasing with User model, we use appUser, essentially the same
export interface appUser {
    id: string;
    userName: string; 
    BrawlID: string;
    email: string;
    password: string; 
}

//we have two states beacuse we don't want to store pfp which can contain lots of bytes in the global state of user
export interface UserPayloadState {
    _id: any;
    brawlID: string;
    name: string;
    email: string;
}

export interface User {
    _id: string;
    username: string;
    profilePicture?: string;
    BrawlID: string;
  }

  interface ErrorsState {
    errors: {
      email?: string[];
      password?: string[];
    };
    message?: undefined;
    error?: undefined;
  }
  
  interface ErrorMessageState {
    message: string;
    error: unknown;
    errors?: undefined;
  }
  
  export type State = ErrorsState | ErrorMessageState | undefined;