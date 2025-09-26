import { Spinner } from "@fluentui/react-components";
import * as React from "react";


export interface ILoadingProps {
    label?: string;
    possition?: "above" | "below" | "before" | "after";
    size?: "small" | "medium" | "large" | "tiny" | "extra-small" | "extra-large" | "huge" | "extra-tiny";
}


function Loading(props: ILoadingProps) {
    return (
        <div className='loading-container'>
            <Spinner
                size={props.size}
                labelPosition={props.possition}
                style={{ marginTop: '10px' }}
            />
        </div>
    )
}

export default React.memo(Loading);