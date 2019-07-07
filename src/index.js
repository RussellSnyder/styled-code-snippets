import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import hljs from './highlight.min.js'
import ContentEditable from 'react-contenteditable'
import {Helmet} from "react-helmet";

import {
    DisplayText,
    Paragraph,
    SectionHeading,
    TextInput,
    Textarea,
    FieldGroup,
    RadioButtonField,
    SelectField,
    Select,
    Option,
    Form
} from '@contentful/forma-36-react-components';
import {init, locations} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';
import THEMES from './highlightStyles'


hljs.configure({useBR: true});

export class App extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const { theme: defaultTheme, language: defaultLanguage } = props.sdk.parameters.instance;

        let {title, language, theme, code} = props.sdk.entry.fields;

        language = defaultLanguage || language.getValue()
        theme = defaultTheme || theme.getValue()

        this.state = {
            language,
            theme,
            title: title.getValue(),
            code: code.getValue(),
            styledCode: ''
        };

        this.styledCodeContainer = React.createRef();

        this.isLanguageEditable = !defaultTheme;
        this.isThemeEditable = !defaultLanguage;
    }

    componentDidMount() {
        if(this.state.language) {
            this.generateStyledCode()
        }
    }

    generateStyledCode() {
        this.setState(prevState => {
            const { language, code } = prevState
            if (!code) return
            const styledCode =  hljs.highlight(language, code);
            return {
                ...prevState,
                styledCode
            }
        })
    }

    onTitleChangeHandler = event => {
        const title = event.target.value;
        this.setState({title});
        this.props.sdk.entry.fields['title'].setValue(title);
    }

    onLanguageChangeHandler = event => {
        const language = event.target.value;
        if (this.isLanguageEditable) {
            this.props.sdk.entry.fields.language.setValue(language);
        }
        this.setState({language}, () => this.generateStyledCode());
    };

    onThemeChangeHandler = event => {
        const theme = event.target.value;
        if (this.isThemeEditable) {
            this.props.sdk.entry.fields.theme.setValue(theme);
        }
        this.setState({theme}, () => this.generateStyledCode());
    };

    onCodeChangeHandler = event => {
        const code = event.target.value
        this.props.sdk.entry.fields.code.setValue(code);
        this.setState({code}, () => {
            this.generateStyledCode()
        });
    }

    onStyledCodeChangeHandler = event => {
        const rawCode = this.styledCodeContainer.current.innerText;
        this.props.sdk.entry.fields.code.setValue(rawCode);
        this.setState({code: rawCode}, () => {
            this.generateStyledCode()
        });
    }

    render() {
        const {title, language, theme, styledCode} = this.state;
        const isLanguageEditable = this.isLanguageEditable;
        const isThemeEditable = this.isThemeEditable;

        return (
                <>
                <Helmet>
                    <link rel="stylesheet" href={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/${theme}.min.css`} />
                </Helmet>
                <Form className="f36-margin--l">
                    <DisplayText>Code Snippet{(theme || language) && ': '}{language}{(theme && language) && ', '}{theme}</DisplayText>
                    <SectionHeading>Title</SectionHeading>
                    <TextInput
                            testId="field-title"
                            onChange={this.onTitleChangeHandler}
                            value={title}
                    />
                    <SectionHeading>Language</SectionHeading>
                    <FieldGroup>
                        <Select onChange={this.onLanguageChangeHandler}
                                value={language}
                                isDisabled={!isLanguageEditable}>
                            {hljs.listLanguages().map(language => <Option key={language}
                                                                          value={language}>{language}</Option>)}
                        </Select>
                    </FieldGroup>
                    <SectionHeading>Highlight Theme</SectionHeading>
                    <FieldGroup>
                        <Select onChange={this.onThemeChangeHandler}
                                value={theme}
                                isDisabled={!isThemeEditable}>
                            {THEMES.map(theme => <Option key={theme} value={theme}>{theme}</Option>)}
                        </Select>
                    </FieldGroup>
                    <SectionHeading>Code Snippet</SectionHeading>
                    <ContentEditable
                            style={{border: '1px solid #d3dce0', minHeight: '50px'}}
                            className={`hljs ${language}`}
                            innerRef={this.styledCodeContainer}
                            html={styledCode.value || ''}
                            onChange={this.onStyledCodeChangeHandler}
                            tagName='pre'
                    />
                </Form>
                </>
        );
    }
}

init(sdk => {
    if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
        render(<App sdk={sdk}/>, document.getElementById('root'));
    }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
