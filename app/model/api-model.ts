
export enum ApiOperationNames {
    FindAllByKeywordWithPageLimit = "FindAllByKeywordWithPageLimit",
	AddNewRecord                  = "AddNewRecord",
	FindOneForUpdate              = "FindOneForUpdate",
	FindOneForDelete              = "FindOneForDelete",
}

export interface FindAllByKeywordWithPageLimitProps {
    entity:         string,
    operation?:      ApiOperationNames | ApiOperationNames.FindAllByKeywordWithPageLimit,
    keyword?:       string | '',
    limit?:         string | 10,
    page?:          string | 1,           
}