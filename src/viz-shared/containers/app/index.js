import React from 'react'
import styles from './styles.less';
import { hoistStatics } from 'recompose';
import { connect, container } from '@graphistry/falcor-react-redux';
import { renderNothing } from 'recompose';
import { View } from 'viz-shared/containers/view';

let DevTools = renderNothing();

if (__DEV__) {
    DevTools = require('viz-shared/components').DevTools;
}

export const App = hoistStatics(connect)(container(
    ({ workbooks = [] } = {}) => {
        const { open: workbook = {} } = workbooks;
        const { views = [] } = workbook;
        const { current: view = {} } = views;
        return `{
            workbooks: {
                length, open: {
                    id, title, views: {
                        length, current: ${
                            View.fragment(view)
                        }
                    }
                }
            }
        }`;
    }
)(renderApp));

function renderApp({ workbooks = [], ...props } = {}) {
    const { open: workbook = {} } = workbooks;
    const { views = [] } = workbook;
    const { current: view } = views;
    return (
        <div className={styles['app']}>
            <View key='view' data={view} />
            <DevTools key='dev-tools'/>
        </div>
    );
}
