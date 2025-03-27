import { ObjectId } from 'mongodb';
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
    _id: string | ObjectId;
    brawlID: string;
    name: string;
    email: string;
}

export interface UserType { 
  _id: string | ObjectId; 
  username: string; 
  profilePicture?: string | null; 
  BrawlID: string;
  socialMedia?: {
    twitter: string;
    instagram: string;
    discord: string;
  } | null;  // Allow null here;
  friends: UserType[]; 
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
  
  export type LoginState = ErrorsState | ErrorMessageState | undefined;

  interface SignUpErrorsState {
    errors: {
      email?: string[];
      password?: string[];
      BrawlID?: string[]; // Added BrawlID to match your form field
    };
  }
  
  interface SignUpErrorMessageState {
    error: string; // Changed from 'unknown' to 'string' to match expected type
  }
  
  export type SignUpState = SignUpErrorsState | SignUpErrorMessageState | undefined;