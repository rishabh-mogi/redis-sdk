type DataById = {
    type: string;
    id: string;
};

type KeyObject = {
    appId?: string;
    key: string;
    dataByIds?: DataById[]; 
    keys?: string[] ; 
}

export default KeyObject;
