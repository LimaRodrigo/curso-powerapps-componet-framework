import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import { IItem } from "./types/IItem";
import Datagrid from "./components/Datagrid/Datagrid";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { IConfigContainer } from "./types/IConfigContainer";

export interface IMainProps {
    context: ComponentFramework.Context<IInputs>;
}

interface IMainState {
    itens: object[];
    configContainer: IConfigContainer;
    enableColors: boolean;
}

function Main(props: IMainProps) {

    /**
     * Estado do componente principal
     */
    const [state, setState] = React.useState<IMainState>({
        itens: [],
        enableColors: props.context.parameters.enableColors.raw ?? false,
        configContainer: { maxWidth: 100, maxHeight: 100 }
    });

    /**
        * React useEffect para monitorar alterações no dataset e gerar novamente a lista
        * e também monitorar alterações na propriedade enableColors
        * e alterações no tamanho do contêiner (largura e altura)
        * para atualizar o estado do configContainer
     */
    React.useEffect(() => {
        setState(prevState => ({
            ...prevState,
            enableColors: props.context.parameters.enableColors.raw ?? false,
            itens: generateItensList(),
            configContainer: { maxWidth: props.context.mode.allocatedWidth, maxHeight: props.context.mode.allocatedHeight }

        }));
    }, [props.context.parameters.enableColors.raw,
        props.context.parameters.datasetBase.records,
        props.context.mode.allocatedWidth,
        props.context.mode.allocatedHeight
        ]);

    /**
     * Função para gerar a lista de itens a partir do dataset
     * recuperando os valores e valores formatados
     * @returns Lista de itens gerada a partir do dataset
     */
    const generateItensList = (): object[] => {
        const itens: object[] = [];
        const columns = props.context.parameters.datasetBase.columns.map(x => x.name);
        const ids: string[] = props.context.parameters.datasetBase.sortedRecordIds;

        ids.forEach((id) => {
            const item: IItem = {} as IItem;
            item.id = id;
            columns.forEach((col) => {
                item[col + "_formatted"] = props.context.parameters.datasetBase.records[id].getFormattedValue(col);
                item[col] = props.context.parameters.datasetBase.records[id].getValue(col);
            });
            itens.push(item);
        });
        return itens;
    }

    return (
        <FluentProvider theme={webLightTheme} style={{ width: `${state.configContainer.maxWidth}px`, height: `${state.configContainer.maxHeight}px`, overflow: 'auto' }}>
            <Datagrid
                Itens={state.itens as IItem[]}
                enableColors={state.enableColors}
                configContainer={state.configContainer}
                columns={props.context.parameters.datasetBase.columns}
            />
        </ FluentProvider>
    );
}
export default Main;