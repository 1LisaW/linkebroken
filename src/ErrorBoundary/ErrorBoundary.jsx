import React from 'react';

import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: ''
        };
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError: true,
            error: error,
            errorInfo: info,
        });
    }

    render() {
        if (this.state.hasError) {
            console.log(this.state.error);
            console.log(this.state.errorInfo);
            return (
                <div className="service-error">
                    <h1>Карлсон, у нас проблема!</h1>
                    <div className="service-error__image" />
                    <p>{this.state.error.toString()}</p>
                    {this.state.errorInfo.componentStack && (
                        <p dangerouslySetInnerHTML={{
                            __html: this.state.errorInfo.componentStack.replace('\n', '<br />')
                        }} />
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
