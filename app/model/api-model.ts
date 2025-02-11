
export enum ApiOperationNames {
    FindAll = "FindAll",
	Create                  = "Create",
	Update              = "Update",
	Delete              = "Delete",
    FindOne             = "FindOne",
}

export interface FindAllByKeywordWithPageLimitProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindAll,
    keyword?:       string | '',
    limit?:         string | '10', //string due to searchParams
    page?:          string | '1',           
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