import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ApiEndpoints from './ApiEndPoints';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;


const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 16px;
    flex-grow: 1;
`;

const Select = styled.select`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 16px;
    flex-grow: 1;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const Checkbox = styled.input`
    margin-right: 10px;
`;

const Button = styled.button`
    padding: 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    &:hover {
        background-color: #0056b3;
    }
`;

const RemoveButton = styled(Button)`
    background-color: transparent;
    color: #dc3545;
    font-size: 20px;
    padding: 0 10px;
    margin-left: 10px;
    &:hover {
        color: #c82333;
    }
`;

const ApiEndpointContainer = styled.div`
    margin-top: 20px;
    padding: 20px;
    background-color: #e9ecef;
    border-radius: 10px;
    text-align: center;
`;

const CopyButton = styled(Button)`
    background-color: #28a745;
    &:hover {
        background-color: #218838;
    }
`;


const ApiContainer = styled.div`
    margin-top: 20px;
    padding: 20px;
    background-color: #e9ecef;
    border-radius: 10px;
`;

const EndpointItem = styled.div`
    margin-bottom: 10px;
`;


const CreateApiForm = () => {
    const [modelName, setModelName] = useState('');
    const [fields, setFields] = useState([{ name: '', type: '', required: false }]);
    const [document, setDocument] = useState({});
    const [apiEndpoint, setApiEndpoint] = useState('');
    


    // const [endpoints, setEndpoints] = useState([]);
    



    const handleFieldChange = (index, event) => {
        const values = [...fields];
        values[index][event.target.name] = event.target.value;
        setFields(values);
    };

    const handleAddField = () => {
        setFields([...fields, { name: '', type: '', required: false }]);
    };

    const handleRemoveField = (index) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    const handleCopyApiEndpoint = () => {
        navigator.clipboard.writeText(apiEndpoint);
        alert('API Endpoint copied to clipboard!');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const schemaDefinition = fields.reduce((acc, field) => {
            if (!field.name || !field.type) {
                alert("Please fill out all field names and types");
                return acc;
            }
            acc[field.name] = { type: field.type, required: field.required };
            return acc;
        }, {});

        // Generate random document data
        const randomDocument = fields.reduce((acc, field) => {
            acc[field.name] = field.type === 'Number' ? Math.floor(Math.random() * 100) : field.name + '_example';
            return acc;
        }, {});

        const apiData = { modelName, schemaDefinition, document: randomDocument };

        try {
            const response = await axios.post('https://api-generator.onrender.com/api/create', apiData);
            setApiEndpoint(`https://api-generator.onrender.com${response.data.apiEndpoint}`);
            alert('API created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create API');
        }
    };

    return (
        <FormContainer>
            <h2>Generate API</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Model Name"
                    required
                />
                {fields.map((field, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            type="text"
                            name="name"
                            value={field.name}
                            onChange={(event) => handleFieldChange(index, event)}
                            placeholder="Field Name"
                            required
                        />
                        <Select
                            name="type"
                            value={field.type}
                            onChange={(event) => handleFieldChange(index, event)}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="String">String</option>
                            <option value="Number">Number</option>
                            <option value="Date">Date</option>
                        </Select>
                        <CheckboxLabel>
                            <Checkbox
                                type="checkbox"
                                name="required"
                                checked={field.required}
                                onChange={(event) => handleFieldChange(index, { target: { name: 'required', value: event.target.checked } })}
                            />
                            Required
                        </CheckboxLabel>
                        <RemoveButton type="button" onClick={() => handleRemoveField(index)}>✕</RemoveButton>
                    </div>
                ))}
                <Button type="button" onClick={handleAddField}>Add Field</Button>
                <Button type="submit">Create API</Button>
            </Form>
            {apiEndpoint && (
                <ApiEndpointContainer>
                    <h3>API Endpoint:</h3>
                    <p>{apiEndpoint}</p>
                    <CopyButton onClick={handleCopyApiEndpoint}>Copy API Endpoint</CopyButton>
                </ApiEndpointContainer>
            )}
        </FormContainer>
    );
};

export default CreateApiForm;
