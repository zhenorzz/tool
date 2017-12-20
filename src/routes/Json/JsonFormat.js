import React, {Component} from 'react';
import {Input, message} from 'antd';

class JsonFormat extends Component {
    constructor(pros) {
        super(pros);
        this.jsonFormat = this.jsonFormat.bind(this);
        this.jsonInput = this.jsonInput.bind(this);
    }
    state = {
        jsonValue: "",
    }

    jsonInput(e) {
        let data = e.target.value;
        this.setState({
            jsonValue: data
        })
    }

    jsonFormat() {
        let data = this.state.jsonValue;
        if (!data) {
            return true;
        }

        let obj = '';
        try {
            obj = JSON.parse(data);
            this.setState({
                jsonValue: JSON.stringify(obj, null, '    ')
            })
        } catch (e) {
            message.error(e.message);
        }

    }
    render() {
        const { TextArea } = Input;
        return (
            <div>
                <TextArea placeholder="输入Json" autosize={{ minRows: 5}} value={this.state.jsonValue} onChange={this.jsonInput} onBlur={this.jsonFormat}/>
            </div>
        );
    }
}

export default JsonFormat;