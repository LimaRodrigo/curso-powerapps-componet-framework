import * as React from 'react';
import { Card, FluentProvider, Label, MessageBar, MessageBarBody, MessageBarTitle, Subtitle2Stronger, Title3, webLightTheme } from '@fluentui/react-components';
import { IInputs } from './generated/ManifestTypes';
import { calcularDiferencaEmDias } from './helpers';
import PositiveValidation from './components/PositiveValidation';
import { MainService } from './services/MainService';
import { IJorney } from './types/IJorney';
import { IPositiveconfirmationquestions } from './types/IPositiveconfirmationquestions';
import * as MOCK from './mock';
import Loading from './components/common/Loading';
import * as Helper from './helpers';
import CardInfo from './components/common/CardInfo';
import { Apps32Color } from '@fluentui/react-icons';
import './style.css';

export interface IMainProps {
    context: ComponentFramework.Context<IInputs>;
    setOutputChanges: (validationDate: Date) => void;
}
interface IMainState {
    enableValidation: boolean;
    loading: boolean;
    journeys: IJorney[];
    questions: IPositiveconfirmationquestions[];
}

function Main(props: IMainProps) {
    const [mainState, setMainState] = React.useState<IMainState>({
        enableValidation: false,
        loading: true,
        journeys: [],
        questions: []
    });
    const { resources, parameters } = props.context;

    React.useEffect(() => {

        async function fetchData() {
            try {
                setMainState({
                    ...mainState,
                    loading: true
                });
                const jorneyService = new MainService<IJorney>(props.context, MOCK.journeys.entities);
                const questionsService = new MainService<IPositiveconfirmationquestions>(props.context, MOCK.questionPositive.entities);
                const jorneyOdata = "?$select=dyndev_journeyid,dyndev_name";
                const questionsOdata = "?$select=dyndev_positiveconfirmationquestionsid,dyndev_question";

                const [jorneyData, questionsData] = await Promise.all([
                    jorneyService.getData("dyndev_journey", jorneyOdata),
                    questionsService.getData("dyndev_positiveconfirmationquestions", questionsOdata)
                ]);
                const dtValidation = parameters.dtLastValidation.raw ?? new Date("2000-01-01");
                const dtDiferenca = calcularDiferencaEmDias(new Date(), dtValidation);
                setMainState({
                    ...mainState,
                    enableValidation: dtDiferenca >= 1 ? true : false,
                    journeys: jorneyData,
                    questions: Helper.obterAmostraAleatoria(questionsData, 2),
                    loading: false,
                });
            } catch (error: unknown) {
                console.error("Erro ao buscar dados:", error);
                setMainState({
                    ...mainState,
                    loading: false
                });
            }

        };
        fetchData().catch(() => { return; });
    }, [props.context.parameters.cnpj.raw, props.context.parameters.dtLastValidation.raw]);



    /**
     * Função para renderizar a MessageBar informando que a validação positiva não foi necessária
     * @returns 
     */
    const getMessageBar = () => {
        return (
            <MessageBar intent='info'>
                <MessageBarBody>
                    <MessageBarTitle>
                        {resources.getString('msgbar-title-main')}
                    </MessageBarTitle>
                    <Label>
                        {resources.getString('msgbar-body-main')}
                    </Label>
                </MessageBarBody>
            </MessageBar>
        );
    }

    /**
     * Função para desabilitar a validação positiva
     * Atualiza o estado do componente principal para não exibir mais o componente de validação positiva
     */
    const disableValidation = () => {
        props.setOutputChanges(new Date());
    }

    const triggerEvent = (jorneyId: string) => {
        props.context.events.clickJorney({ jorneyId: jorneyId });
    }

    return (
        <FluentProvider theme={webLightTheme}>
            {mainState.loading && <Loading possition='below' size='medium' />}

            {(!mainState.loading && mainState.enableValidation) &&
                <PositiveValidation
                    context={props.context}
                    questions={mainState.questions}
                    loading={mainState.loading}
                    disableValidation={disableValidation.bind(Main)} />
            }
            {(!mainState.loading && !mainState.enableValidation) &&
                <>
                    <div className='seletor-main-container'>
                        {getMessageBar()}
                        {mainState.journeys.map((journey) => (
                            <CardInfo key={journey.dyndev_journeyid}>
                                <div
                                    className='seletor-list-container'
                                    onClick={() => triggerEvent(journey.dyndev_journeyid ?? '')}
                                >
                                    <Apps32Color />
                                    <Title3 truncate>{journey.dyndev_name}</Title3>
                                </div>
                            </CardInfo>))
                        }
                    </div>
                </>
            }
        </FluentProvider>
    );
}
export default Main;
