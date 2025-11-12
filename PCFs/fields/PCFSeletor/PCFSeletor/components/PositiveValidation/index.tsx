import React, { memo } from 'react';
import { IInputs } from '../../generated/ManifestTypes';
import { IPositiveconfirmationquestions } from '../../types/IPositiveconfirmationquestions';
import CardInfo from '../common/CardInfo';
import {
    Body2,
    Button
} from '@fluentui/react-components';
import {
    BookmarkMultipleFilled,
    CheckmarkCircleColor,
    PresenceBlockedRegular
} from '@fluentui/react-icons';

import './style.css';

export interface IPositiveValidationProps {
    context: ComponentFramework.Context<IInputs>;
    questions: IPositiveconfirmationquestions[];
    loading?: boolean;
    disableValidation?: () => void;
}

function PositiveValidation(props: IPositiveValidationProps) {
    const { resources } = props.context;


    return (
        <div className='positivevalidation-container'>
            {!props.loading &&
                <>
                    {props.questions.map((question) => (
                        <CardInfo
                            key={question.dyndev_positiveconfirmationquestionsid}
                        >
                            <div className='positivevalidation-dataquestion' >
                                <BookmarkMultipleFilled />
                                <Body2>
                                    {question.dyndev_question}
                                </Body2>
                            </div>
                        </CardInfo>
                    ))
                    }
                    < div className='positivevalidation-dataquestion-actions'>
                        <Button
                            shape="rounded"
                            appearance='secondary'
                            icon={<PresenceBlockedRegular style={{ color: 'red' }} />}
                        >
                            {resources.getString('btn-cancelar-cpn-positivevalidations')}

                        </Button>
                        <Button
                            shape="rounded"
                            appearance='primary'
                            icon={<CheckmarkCircleColor />}
                            onClick={props.disableValidation}
                        >
                            {resources.getString('btn-concluir-cpn-positivevalidation')}
                        </Button>

                    </div>
                </>
            }
        </div >
    );
}
export default memo(PositiveValidation);