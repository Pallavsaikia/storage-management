import React, { useRef, useState, useContext } from 'react';
import { loginApi } from '../api/api';
import { AlertData, AlertType } from '../components/alert/Alert';
import { Card } from '../components/card/Card';
import { CenterRootContainer } from '../components/container/CenterRootContainer';
import { SubmitButton } from '../components/form/buttons/SubmitButton';
import { H4text } from '../components/texts/H4text';
import { LogoText } from '../components/texts/LogoText';
import { RegularText } from '../components/texts/RegularText';
import { AlertContext } from '../context/AlertContext';
import { isEmailValid } from '../util/regex';
import { isStringEmpty } from '../util/string_ops';
import { EditText} from '../components/form/input_fields/EditText';
import INPUT_TYPE from '../components/form/input_fields/INPUT_TYPE';
import {  useNavigate } from 'react-router-dom';
import { setEmail, setEmpID, setJWT, setName, setRole ,setRefresh} from '../util/local_storage/local_storage';




export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const email = useRef(null)
    const password = useRef(null)
    const {  updateAlert } = useContext(AlertContext)
    async function loginSubmit(e) {
        setLoading(true)
        e.preventDefault();
        if (!isEmailValid(email.current.value)) {
            updateAlert(AlertData("Invalid Email"))
        }
        if (isStringEmpty(password.current.value)) {
            updateAlert(AlertData("Fields Cant Be Empty"))
        }
        if (isEmailValid(email.current.value) && !isStringEmpty(password.current.value)) {
            const response = await loginApi(email.current.value, password.current.value)
            console.log(response)
            if (response.success === true) {
                setJWT(response.data.accesstoken)
                setName(response.data.name)
                setEmail(response.data.email)
                setEmpID(response.data.empID)
                setRole(response.data.role)
                setRefresh(response.data.refreshtoken)
                updateAlert(AlertData(response.message,AlertType.success))
                navigate("/");
            } else {
                updateAlert(AlertData(response.message))
            }
        }
        setLoading(false)

    }

    return (
        
            <CenterRootContainer>

                <Card>

                    <LogoText header="Cosmos" top={5} />
                    <H4text text="Welcome to Styldod Cosmos! 👋" top={3} />
                    <RegularText text="Please sign-in to your account and start the adventure" top={1} />
                    <form onSubmit={e => loginSubmit(e)}>
                        <div className="form-group">
                            <EditText reference={email} name={"Email"} label={"Email"} placeholder={"Enter your email"} top={4} type={INPUT_TYPE.text} />
                            <EditText reference={password} name={"Password"} label={"Password"} placeholder={"Enter Password"} top={2} type={INPUT_TYPE.password} />
                            <SubmitButton text={"Sign In"} top={5} bottom={5} disabled={loading} />
                        </div>
                    </form>
                </Card>

            </CenterRootContainer>
        

    )
}

