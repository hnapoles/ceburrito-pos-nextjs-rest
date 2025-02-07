
export enum ApiOperationNames {
    FindAllByKeywordWithPageLimit = "FindAllByKeywordWithPageLimit",
	AddNewRecord                  = "AddNewRecord",
	FindOneForUpdate              = "FindOneForUpdate",
	FindOneForDelete              = "FindOneForDelete",
    FindOneForDisplay             = "FindOneForDisplay",
}

export interface FindAllByKeywordWithPageLimitProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindAllByKeywordWithPageLimit,
    keyword?:       string | '',
    limit?:         string | '10', //string due to searchParams
    page?:          string | '1',           
}

export interface FindOneForDeleteProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindOneForDelete,
    id:             string,        
}

export interface FindOneForUpdateProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindOneForUpdate,
    id:             string,        
}

export interface FindOneForDisplayProps {
    entity:         string,
    operation?:     ApiOperationNames | ApiOperationNames.FindOneForDisplay,
    searchFor:      object,      
}