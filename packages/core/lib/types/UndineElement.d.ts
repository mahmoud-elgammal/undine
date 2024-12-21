export interface IUndineDefaultProps {
    [key: string]: any;
    children: UndineElement[];
}

export interface UndineElement {
    type: string | Function;
    props: IUndineDefaultProps;   
}