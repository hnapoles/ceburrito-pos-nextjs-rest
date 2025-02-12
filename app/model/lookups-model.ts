export interface Lookup {
  _id?: string,
  lookupCode: string,
  lookupDescription: string,
  lookupGroup: string,
  lookupValue: string,
  sortSeq?: number,
}


export interface LookupQueryResults {
  count: number,
  data: Lookup[] 
}
