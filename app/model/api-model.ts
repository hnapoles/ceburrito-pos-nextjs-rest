
export enum ApiOperationNames {
    FindAll             = "FindAll",
	Create              = "Create",
	Update              = "Update",
	Delete              = "Delete",
    FindOne             = "FindOne",
}

export interface FindAll {
    entity?:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindAll,
    keyword?:       string | null,
    searchKeywordFields?: string[],
    limit?:         number | 10, //string due to searchParams
    page?:          number | 1,  
    andFilter?:       object,
    orFilter?:       object,         
}

export interface FindOne {
    entity?:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindAll,   
}

export interface FindOneForDeleteProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.Delete,
    id:             string,        
}

export interface FindOneForUpdateProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.Update,
    id:             string,        
}

export interface FindOneForDisplayProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindOne,
    searchFor:      object,      
}