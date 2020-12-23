import React, { Component } from 'react';
import { emailProvider, emailRegex } from "./EmailConstants";
import './Email.css';

export default class Email extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            suggestion: [],
        };

        this.handleChange = this.handleChange.bind(this);
    }
    emailIsValid() {
        const { value } = this.state;
        return emailRegex.test(value);
    }
    handleChange(event) {
        // STORE INPUT IN STATE
        const {value: emailAddress} = event.target;

        if (emailAddress.indexOf('@') === -1) {
            this.setState({value: emailAddress, suggestion: emailProvider.slice(0, 3)});
        } else {
            // DISPLAY SUGGESTIONS BASED ON STATE
            const suggest = this.findSuggestions(emailAddress);
            this.setState({value: emailAddress, suggestion: suggest});
        }
    }
    findSuggestions(string) {
        // TO ONLY KEEP THE PROVIDER
        let strArr = string.split('@');
        if (strArr.length - 1 !== 0) {
            string = strArr.pop();
        } else return;

        const suggestions = [];

        if (!this.emailIsValid()) {
            // PUSH RELEVANT PROVIDER IN SUGGESTIONS UP TO 3
            for (let i = 0; i < emailProvider.length; i++) {
                if (emailProvider[i].startsWith(string.toLowerCase()) && suggestions.length < 3) {
                    suggestions.push(emailProvider[i]);
                }
            }
        }

        return suggestions;
    }
    chooseProvider(provider) {
        const { value } = this.state;

        // DISPLAY VALID EMAIL AND REMOVE SUGGESTIONS
        this.setState({value: value.split('@').shift() + '@' + provider, suggestion: []});

        this.emailHandler.focus();
    }
    render() {
        const { value, suggestion } = this.state;

        let emailProvider;
        if (suggestion) {
            if (value.length > 0) {
                // DISPLAY PROVIDERS
                emailProvider = suggestion.map((provider, index) => {
                    return <span key={index} className="email-provider" onClick={() => this.chooseProvider(provider)}>
                    @{provider}
                </span>;
                });
            }
        }

        return (
            <div className={`email-wrapper ${value.length ? "active" : ""}`}>
                <div className="email-provider-wrapper">
                    {emailProvider}
                </div>
                <input
                    id="email"
                    type="text"
                    inputMode="email"
                    autoComplete="false"
                    value={value}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.emailHandler = input;
                    }}
                    className="email-input"
                />
                <label className={`email-label ${this.emailIsValid() ? "valid" : ""}`}>
                    <span className="email-label-content">
                        Email
                    </span>
                </label>
            </div>
        );
    }
}