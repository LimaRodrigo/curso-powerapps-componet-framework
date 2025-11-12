import * as React from 'react';
import {
    Badge,
    FluentProvider,
    Title3,
    webLightTheme
} from '@fluentui/react-components';
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
import {
    Apps32Color,
    LightbulbFilamentFilled
} from '@fluentui/react-icons';
import './style.css';

export interface IMainProps {
    context: ComponentFramework.Context<IInputs>;
    setOutputChanges: (validationDate: Date, validationDetails: string) => void;
}
interface IMainState {
    enableValidation: boolean;
    isVIP?: boolean;
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
                    isVIP: parameters.creditLimit.raw && parameters.creditLimit.raw > 1000000 ? true : false
                });
            } catch (error: unknown) {
                console.error("PCFCurso.PCFSeletor - Error", error);
                setMainState({
                    ...mainState,
                    loading: false
                });
            }

        };
        fetchData().catch(() => { return; });
    }, [props.context.parameters.accountNumber.raw,
    props.context.parameters.dtLastValidation.raw,
    props.context.parameters.creditLimit.raw
    ]);


    /**
     * Função para desabilitar a validação positiva
     * Atualiza o estado do componente principal para não exibir mais o componente de validação positiva
     */
    const disableValidation = () => {
        props.setOutputChanges(new Date(), resources.getString(`${new Date()
            .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${resources.getString("msg-validation-outptus")}`));
    }

    const triggerEvent = (jorneyId: string) => {
        props.context.events.clickJorney({ jorneyId: jorneyId });
    }

    const renderLoading = () => {
        return (
            mainState.loading && <Loading possition='below' size='medium' />
        );
    }
    const renderPositiveValidation = () => {
        return (
            (!mainState.loading && mainState.enableValidation) &&
            <PositiveValidation
                context={props.context}
                questions={mainState.questions}
                loading={mainState.loading}
                disableValidation={disableValidation.bind(Main)} />
        );
    }
    const renderJorneySelector = () => {
        return (
            (!mainState.loading && !mainState.enableValidation) &&
            <>
                <div className='seletor-main-container'>
                    {mainState.isVIP && <Badge appearance="filled" color="danger" icon={<LightbulbFilamentFilled />} size='large' shape='rounded'>
                        VIP
                    </Badge>}
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
        );
    }

    return (
        <FluentProvider theme={webLightTheme} className='selector-fluent-provider'>
            {console.log('PCFCurso.PCFSeletor - state', mainState)}
            {renderLoading()}
            {renderPositiveValidation()}
            {renderJorneySelector()}
        </FluentProvider>
    );
}
export default Main;
