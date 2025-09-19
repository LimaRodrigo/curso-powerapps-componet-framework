import * as React from 'react';
import { IItem } from '../../types/IItem';
import { Body1Stronger, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';
import { IConfigContainer } from '../../types/IConfigContainer';

interface IDatagridProps {
    Itens: IItem[];
    enableColors: boolean;
    columns: ComponentFramework.PropertyHelper.DataSetApi.Column[];
    configContainer: IConfigContainer;
}

interface IDatagridState {
    Itens: IItem[];
    enableColors: boolean;
}

function Datagrid(props: IDatagridProps) {
    /**
     * Estado do componente Datagrid
     */
    const [state, setState] = React.useState<IDatagridState>({
        Itens: props.Itens,
        enableColors: props.enableColors
    });

    /**
     * React useEffect para monitorar alterações nas props Itens e enableColors
     * e atualizar o estado do componente
     */
    React.useEffect(() => {
        setState(prevState=> ({
            ...prevState,
            Itens: props.Itens,
            enableColors: props.enableColors
        }));
    }, [props.Itens, props.enableColors]);

    return (<>
        <Table size='medium' as='table'>
            {console.log('Renderizando Datagrid', state, props)}
            <TableHeader>
                <TableRow>
                    {props.columns.map((column) => (
                        <TableHeaderCell key={"header" + column.name} as='th'>
                            <Body1Stronger>{column.name}</Body1Stronger>
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody as='tbody'>
                {state.Itens.map((item, i) => {
                    return (
                        <TableRow
                            key={`row-${item.id}-${i}`}
                            as='tr'
                        >
                            {props.columns.map((column) => {
                                return (
                                    <TableCell key={`${column.name}-${item.id}-${i}`} as='td'>
                                        {item[column.name] || '-'}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </>);
}
/**
 * Exporta o componente Datagrid com React.memo para evitar renderizações desnecessárias
 * caso as props não tenham sido alteradas
 */
export default React.memo(Datagrid);