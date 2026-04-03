export interface PendingSignupQuery{
    search?:string;
    role?:string;
    status?:string;
    
}

export interface PendingSignupFilter{
    status?:string;
    role?:string;
    $or?:Array<{
        email?:{$regex:string,$options:string};
        documents?:{$regex:string,$options:string};
    }>;
}